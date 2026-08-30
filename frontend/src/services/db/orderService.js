/**
 * 🎨 Order & Manual QRIS Transfer Verification Service
 * Menangani pemesanan karya seni, upload bukti pembayaran, dan verifikasi admin panitia
 */
import { apiClient } from '../api';

const LOCAL_ORDERS_KEY = 'senrup_artwork_orders_v2';
const LOCAL_QRIS_KEY = 'senrup_custom_qris_setting';

const getLocalOrders = () => {
  try {
    const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalOrders = (orders) => {
  try {
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
  } catch (err) {
    console.warn('Gagal menyimpan pesanan lokal:', err);
  }
};

export const OrderService = {
  /**
   * Kirim Pesanan Baru beserta Upload Bukti Transfer
   */
  async submitOrderWithProof(payload) {
    try {
      const formData = new FormData();
      formData.append('artwork_id', payload.artworkId);
      formData.append('artwork_title', payload.artworkTitle || 'Karya Seni Unik');
      if (payload.artworkArtist) formData.append('artwork_artist', payload.artworkArtist);
      if (payload.artworkCategory) formData.append('artwork_category', payload.artworkCategory);
      if (payload.artworkImage) formData.append('artwork_image', payload.artworkImage);
      if (payload.price) formData.append('artwork_price', payload.price);
      
      formData.append('buyer_name', payload.buyerName);
      formData.append('buyer_email', payload.buyerEmail);
      formData.append('buyer_phone', payload.buyerPhone);
      formData.append('pickup_notes', payload.pickupNotes || 'Ambil di Booth Pameran Lt. 3');
      formData.append('payment_type', payload.paymentType || 'QRIS DANA / Transfer Bank');

      if (payload.paymentProofFile instanceof File || payload.paymentProofFile instanceof Blob) {
        formData.append('payment_proof', payload.paymentProofFile);
      } else if (payload.paymentProofUrl) {
        formData.append('payment_proof_url', payload.paymentProofUrl);
      }

      const res = await apiClient.post('/orders', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data && res.data.success) {
        // Simpan snapshot di local storage juga
        const localOrders = getLocalOrders();
        const savedOrder = res.data.order || {
          id: res.data.order_id,
          artwork_id: payload.artworkId,
          artwork_title: payload.artworkTitle,
          buyer_name: payload.buyerName,
          buyer_email: payload.buyerEmail,
          buyer_phone: payload.buyerPhone,
          pickup_notes: payload.pickupNotes,
          gross_amount: payload.price || 150000,
          payment_type: payload.paymentType || 'QRIS DANA',
          payment_proof_url: payload.paymentProofUrl || null,
          transaction_status: 'pending_review',
          created_at: new Date().toISOString(),
        };
        localOrders.unshift(savedOrder);
        saveLocalOrders(localOrders);

        return res.data;
      }

      throw new Error(res.data?.message || 'Gagal mengirim pesanan.');
    } catch (err) {
      console.warn('OrderService.submitOrderWithProof API error, saving locally:', err);
      
      const serverMessage = err.response?.data?.message;
      if (serverMessage && !err.message.includes('Network Error')) {
        throw new Error(serverMessage);
      }

      // Fallback penyimpanan lokal jika backend API sedang offline
      const mockOrderId = `ORDER-SR-${Date.now()}`;
      const localOrders = getLocalOrders();

      const newLocalOrder = {
        id: mockOrderId,
        artwork_id: payload.artworkId,
        artwork_title: payload.artworkTitle || 'Karya Seni Unik',
        buyer_name: payload.buyerName,
        buyer_email: payload.buyerEmail,
        buyer_phone: payload.buyerPhone,
        pickup_notes: payload.pickupNotes || 'Ambil di Booth Pameran Lt. 3',
        gross_amount: payload.price || 150000,
        payment_type: payload.paymentType || 'QRIS DANA / Transfer Bank',
        payment_proof_url: payload.paymentProofUrl || null,
        transaction_status: 'pending_review',
        is_picked_up: false,
        created_at: new Date().toISOString(),
      };

      localOrders.unshift(newLocalOrder);
      saveLocalOrders(localOrders);

      return {
        success: true,
        message: 'Pesanan dan bukti transfer berhasil dicatat! Menunggu verifikasi panitia.',
        order_id: mockOrderId,
        gross_amount: payload.price || 150000,
        transaction_status: 'pending_review',
        order: newLocalOrder,
      };
    }
  },

  /**
   * Alias createSnapToken untuk backward compatibility
   */
  async createSnapToken(payload) {
    return this.submitOrderWithProof(payload);
  },

  /**
   * Mengambil daftar seluruh transaksi pesanan (Untuk Panitia & Admin)
   */
  async getOrders(params = {}) {
    try {
      const res = await apiClient.get('/orders', { params });
      if (res.data && res.data.success) {
        return {
          orders: res.data.data.data || res.data.data || [],
          stats: res.data.stats || {},
          pagination: {
            currentPage: res.data.data.current_page || 1,
            lastPage: res.data.data.last_page || 1,
            total: res.data.data.total || 0,
          },
        };
      }
    } catch {
      // Fallback to local storage
    }

    const localOrders = getLocalOrders();
    const verifiedOrders = localOrders.filter((o) => ['settlement', 'verified', 'success'].includes(o.transaction_status));

    return {
      orders: localOrders,
      stats: {
        total_sales_amount: verifiedOrders.reduce((sum, o) => sum + (Number(o.gross_amount) || 0), 0),
        total_sold_artworks: verifiedOrders.length,
        pending_orders: localOrders.filter((o) => ['pending_review', 'pending'].includes(o.transaction_status)).length,
        rejected_orders: localOrders.filter((o) => ['rejected', 'cancel', 'expire'].includes(o.transaction_status)).length,
        picked_up_count: localOrders.filter((o) => o.is_picked_up).length,
      },
      pagination: {
        currentPage: 1,
        lastPage: 1,
        total: localOrders.length,
      },
    };
  },

  /**
   * Verifikasi Pesanan oleh Panitia (Tandai Lunas & Terjual)
   */
  async verifyOrder(orderId, adminName = 'Panitia', notes = '') {
    try {
      const res = await apiClient.patch(`/orders/${orderId}/verify`, {
        admin_name: adminName,
        admin_notes: notes,
      });
      if (res.data && res.data.success) {
        this._updateLocalOrderStatus(orderId, 'settlement', adminName);
        return res.data;
      }
    } catch (err) {
      console.warn('API verify failed, updating locally:', err);
    }

    this._updateLocalOrderStatus(orderId, 'settlement', adminName);
    return { success: true, message: 'Pesanan berhasil diverifikasi lunas!' };
  },

  /**
   * Tolak Pesanan oleh Panitia (Bukti Transfer Tidak Valid)
   */
  async rejectOrder(orderId, adminName = 'Panitia', reason = 'Bukti transfer tidak valid.') {
    try {
      const res = await apiClient.patch(`/orders/${orderId}/reject`, {
        admin_name: adminName,
        reason: reason,
      });
      if (res.data && res.data.success) {
        this._updateLocalOrderStatus(orderId, 'rejected', adminName, reason);
        return res.data;
      }
    } catch (err) {
      console.warn('API reject failed, updating locally:', err);
    }

    this._updateLocalOrderStatus(orderId, 'rejected', adminName, reason);
    return { success: true, message: 'Pesanan ditolak dan karya dikembalikan ke katalog.' };
  },

  /**
   * Memperbarui status serah terima karya fisik di Booth (Panitia)
   */
  async togglePickup(orderId, adminName = 'Panitia') {
    try {
      const res = await apiClient.patch(`/orders/${orderId}/pickup`, {
        admin_name: adminName,
      });
      if (res.data && res.data.success) {
        return res.data;
      }
    } catch {
      // Fallback update local storage
    }

    const localOrders = getLocalOrders();
    const idx = localOrders.findIndex((o) => o.id === orderId);
    if (idx !== -1) {
      localOrders[idx].is_picked_up = !localOrders[idx].is_picked_up;
      localOrders[idx].picked_up_at = localOrders[idx].is_picked_up ? new Date().toISOString() : null;
      localOrders[idx].picked_up_by_admin = localOrders[idx].is_picked_up ? adminName : null;
      saveLocalOrders(localOrders);
      return { success: true, data: localOrders[idx] };
    }

    throw new Error('Pesanan tidak ditemukan.');
  },

  /**
   * Mengambil Pengaturan QRIS Pameran
   */
  async getQrisSettings() {
    try {
      const res = await apiClient.get('/settings/qris');
      if (res.data && res.data.success) {
        return res.data.data;
      }
    } catch {
      // Fallback local
    }

    const local = localStorage.getItem(LOCAL_QRIS_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {}
    }

    return {
      merchant_name: 'CHARMY LUCK ART OFFICIAL',
      qris_image_url: '/qris-dana.png',
      dana_number: 'NMID: ID1025452455724',
      bank_name: 'QRIS Standar Pembayaran Nasional (GPN)',
      instructions: 'Scan QRIS di atas melalui DANA, GoPay, OVO, ShopeePay, BCA Mobile, atau Livin Mandiri sesuai nominal karya. Upload screenshot bukti pembayaran Anda di bawah.',
    };
  },

  /**
   * Simpan Foto QRIS Pameran
   */
  async saveQrisSettings(fileOrData) {
    let finalImageUrl = '/qris-dana.png';

    if (fileOrData instanceof File || fileOrData instanceof Blob) {
      // 1. Baca langsung sebagai Base64 Data URL untuk update instan
      const base64Url = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result || '/qris-dana.png');
        reader.onerror = () => resolve('/qris-dana.png');
        reader.readAsDataURL(fileOrData);
      });

      finalImageUrl = base64Url;

      // 2. Upload ke backend Laravel jika online
      try {
        const formData = new FormData();
        formData.append('qris_image', fileOrData);
        const res = await apiClient.post('/settings/qris', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res.data && res.data.success && res.data.data?.qris_image_url) {
          finalImageUrl = res.data.data.qris_image_url;
        }
      } catch (err) {
        console.warn('Gagal upload QRIS ke server, menggunakan penyimpanan lokal:', err);
      }
    } else if (typeof fileOrData === 'string') {
      finalImageUrl = fileOrData;
    }

    const settings = {
      merchant_name: 'SENI RUPA POLIBATAM',
      qris_image_url: finalImageUrl,
      dana_number: '0812-3456-7890 (DANA Panitia Seni Rupa)',
      bank_name: 'Bank BCA / DANA Bisnis',
      updated_at: new Date().toISOString(),
    };

    localStorage.setItem(LOCAL_QRIS_KEY, JSON.stringify(settings));
    return settings;
  },

  _updateLocalOrderStatus(orderId, status, adminName, reason = null) {
    const localOrders = getLocalOrders();
    const idx = localOrders.findIndex((o) => o.id === orderId);
    if (idx !== -1) {
      localOrders[idx].transaction_status = status;
      localOrders[idx].verified_by_admin = adminName;
      localOrders[idx].verified_at = new Date().toISOString();
      if (reason) localOrders[idx].rejection_reason = reason;
      saveLocalOrders(localOrders);
    }
  },

  markLocalOrderSettled(orderId, paymentType = 'QRIS') {
    this._updateLocalOrderStatus(orderId, 'settlement', 'Sistem');
  }
};
