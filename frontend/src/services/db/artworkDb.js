/**
 * 🖼️ Artwork Catalog & Likes Database Service
 * Sesuai Spesifikasi: BLUEPRINT_ART_SHOWCASE.md (Tabel: artworks, artwork_likes)
 */
import axios from 'axios';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import { StorageService } from '../storageService';
import { INITIAL_ARTWORKS } from '../../data/mockData';

const LOCAL_STORAGE_KEY = 'senrup_artworks_v1';
const LIKED_KEY = 'senrup_liked_artworks_v1';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const resolveBoothId = (art) => {
  if (!art) return 'booth-a';

  const rawCat = String(art.category || art.kategori || '').toLowerCase().trim();
  const rawBoothId = String(art.boothId || art.booth_id || '').toLowerCase().trim();
  const rawBoothName = String(art.boothName || art.booth_name || '').toLowerCase().trim();

  // 1. Primary Mapping by Category (Most accurate & deterministic across all databases)
  if (rawCat.includes('lukis') || rawCat.includes('paint') || rawCat.includes('kanvas') || rawCat.includes('canvas') || rawCat.includes('akrilik') || rawCat.includes('oil')) {
    return 'booth-a';
  }
  if (rawCat.includes('kriya') || rawCat.includes('rajin') || rawCat.includes('craft') || rawCat.includes('resin') || rawCat.includes('3d') || rawCat.includes('keramik') || rawCat.includes('terracotta') || rawCat.includes('patung') || rawCat.includes('makrame') || rawCat.includes('daur ulang')) {
    return 'booth-b';
  }
  if (rawCat.includes('sketsa') || rawCat.includes('ilustrasi') || rawCat.includes('sketch') || rawCat.includes('draw') || rawCat.includes('digital') || rawCat.includes('doodle') || rawCat.includes('gambar') || rawCat.includes('vektor') || rawCat.includes('komik')) {
    return 'booth-c';
  }

  // 2. Direct standard IDs
  if (rawBoothId === 'booth-a' || rawBoothId === 'zona-a') return 'booth-a';
  if (rawBoothId === 'booth-b' || rawBoothId === 'zona-b') return 'booth-b';
  if (rawBoothId === 'booth-c' || rawBoothId === 'zona-c') return 'booth-c';
  if (rawBoothId === 'booth-d' || rawBoothId === 'zona-d') return 'booth-d';
  if (rawBoothId === 'booth-e' || rawBoothId === 'zona-e') return 'booth-e';

  // 3. Supabase fixed UUIDs from seed scripts
  if (rawBoothId.endsWith('-000000000001') || rawBoothId.endsWith('0001')) return 'booth-a';
  if (rawBoothId.endsWith('-000000000002') || rawBoothId.endsWith('0002')) return 'booth-b';
  if (rawBoothId.endsWith('-000000000003') || rawBoothId.endsWith('0003')) return 'booth-c';
  if (rawBoothId.endsWith('-000000000004') || rawBoothId.endsWith('0004')) return 'booth-d';
  if (rawBoothId.endsWith('-000000000005') || rawBoothId.endsWith('0005')) return 'booth-e';

  // 4. Exact word boundary regex check on boothId & boothName (e.g. "zona a", "booth a", "zona-a")
  const combinedBoothText = `${rawBoothId} ${rawBoothName}`;
  if (/\b(zona|booth)[- ]?a\b/i.test(combinedBoothText) || combinedBoothText.includes('galeri lukis')) return 'booth-a';
  if (/\b(zona|booth)[- ]?b\b/i.test(combinedBoothText) || combinedBoothText.includes('kriya') || combinedBoothText.includes('kerajinan')) return 'booth-b';
  if (/\b(zona|booth)[- ]?c\b/i.test(combinedBoothText) || combinedBoothText.includes('live painting') || combinedBoothText.includes('pojok gambar')) return 'booth-c';
  if (/\b(zona|booth)[- ]?d\b/i.test(combinedBoothText) || combinedBoothText.includes('panggung') || combinedBoothText.includes('stage') || combinedBoothText.includes('talkshow')) return 'booth-d';
  if (/\b(zona|booth)[- ]?e\b/i.test(combinedBoothText) || combinedBoothText.includes('photobooth') || combinedBoothText.includes('souvenir') || combinedBoothText.includes('suvenir') || combinedBoothText.includes('info desk')) return 'booth-e';

  // 5. Default fallback to Zona A
  return 'booth-a';
};

export const resolveBoothName = (bId) => {
  switch (bId) {
    case 'booth-b': return 'Zona B - Galeri Kerajinan & Kriya Tangan';
    case 'booth-c': return 'Zona C - Pojok Gambar & Live Painting';
    case 'booth-d': return 'Zona D - Panggung Utama (Talkshow & Seminar)';
    case 'booth-e': return 'Zona E - Photobooth Retro & Info Desk';
    default: return 'Zona A - Galeri Karya Lukis';
  }
};

export const formatArtItem = (art) => {
  const bId = resolveBoothId(art);
  const artistName = art.artist || art.seniman_nama || 'Kolektif Anggota Seni Rupa';
  const isAnonymous = Boolean(
    art.isAnonymous || 
    art.is_anonymous || 
    /rahasia|dirahasiakan|anonim|anonymous|secret|misterius/i.test(artistName)
  );

  return {
    id: String(art.id || `art-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`),
    slug: art.slug || (art.title || art.judul || 'karya').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    title: art.title || art.judul || 'Tanpa Judul',
    artist: artistName,
    artistNim: art.artistNim || art.seniman_nim || '-',
    artistBatch: art.artistBatch || art.seniman_angkatan || '2024',
    isAnonymous,
    category: art.category || art.kategori || 'Lukis',
    medium: art.medium || art.medium_bahan || 'Mixed Media',
    dimensions: art.dimensions || art.dimensi || 'Ukuran Standar',
    price: Number(art.price ?? art.harga ?? 150000),
    isForSale: Boolean(art.isForSale ?? art.is_for_sale ?? true),
    saleStatus: String(art.saleStatus || art.sale_status || 'available'),
    buyerName: art.buyerName || art.buyer_name || null,
    buyerEmail: art.buyerEmail || art.buyer_email || null,
    buyerPhone: art.buyerPhone || art.buyer_phone || null,
    bookedUntil: art.bookedUntil || art.booked_until || null,
    currentOrderId: art.currentOrderId || art.current_order_id || null,
    year: String(art.year || art.tahun_pembuatan || '2024'),
    imageUrl: art.imageUrl || art.foto_utama_url || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
    description: art.description || art.deskripsi_filosofi || '',
    boothId: bId,
    boothName: art.boothName || art.booth_name || resolveBoothName(bId),
    likesCount: Number(art.likesCount ?? art.likes_count ?? 0),
    isHighlighted: Boolean(art.isHighlighted ?? art.is_highlighted ?? false),
    tags: Array.isArray(art.tags) ? art.tags : (typeof art.tags === 'string' ? JSON.parse(art.tags || '[]') : ['Retro Pop', 'History']),
  };
};

const getLocalArtworks = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map(formatArtItem);
    }
    return [];
  } catch {
    return [];
  }
};

const saveLocalArtworks = (list) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list || []));
  } catch (e) {
    console.error('Failed to save artworks to localStorage:', e);
  }
};

export const ArtworkDb = {
  /**
   * Ambil seluruh karya seni murni dari Supabase / Backend Database
   * Tidak menggunakan data dummy frontend
   */
  async getAllArtworks() {
    // 1. Prioritas Utama: Ambil langsung dari Supabase Database
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('artworks')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data)) {
          const formatted = data.map(formatArtItem);
          saveLocalArtworks(formatted);
          return formatted;
        } else if (error) {
          console.warn('Supabase fetch artworks error:', error.message);
        }
      } catch (err) {
        console.warn('Supabase fetch artworks exception:', err);
      }
    }

    // 2. Fallback Opsional: Laravel REST API (jika ada)
    try {
      const res = await axios.get(`${API_BASE_URL}/artworks`, { timeout: 3000 });
      if (res.data && res.data.success && Array.isArray(res.data.data)) {
        const formatted = res.data.data.map(formatArtItem);
        saveLocalArtworks(formatted);
        return formatted;
      }
    } catch (apiErr) {
      // Offline / API inactive
    }

    return getLocalArtworks();
  },

  /**
   * Ambil karya seni berdasarkan Booth / Zona Denah
   */
  async getArtworksByBooth(boothId) {
    const all = await this.getAllArtworks();
    return all.filter(a => (a.boothId || resolveBoothId(a)) === boothId);
  },

  /**
   * Tambah karya baru ke katalog
   * Mendukung upload file fisik (imageFile) langsung ke Supabase Storage
   * Dilengkapi Transactional Rollback jika insert database gagal!
   */
  async addArtwork(newArt) {
    let uploadedStoragePath = null;
    let finalImageUrl = newArt.imageUrl || '';

    // 1. Jika ada file fisik gambar (imageFile), upload langsung ke Supabase Storage
    if (newArt.imageFile && (newArt.imageFile instanceof File || newArt.imageFile instanceof Blob)) {
      try {
        const uploadRes = await StorageService.uploadImage(newArt.imageFile, {
          bucket: 'artworks',
          folder: 'artworks'
        });
        finalImageUrl = uploadRes.publicUrl;
        uploadedStoragePath = uploadRes.filePath;
      } catch (uploadErr) {
        console.error('Gagal mengunggah gambar ke Supabase Storage:', uploadErr);
        throw new Error(`Upload gambar gagal: ${uploadErr.message}`);
      }
    }

    const list = getLocalArtworks();
    const created = {
      id: 'art-' + Date.now(),
      slug: (newArt.title || 'karya').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      likesCount: 0,
      tags: ['Retro Pop', 'History'],
      isAnonymous: Boolean(newArt.isAnonymous),
      ...newArt,
      imageUrl: finalImageUrl,
    };
    delete created.imageFile;

    let dbSucceeded = false;

    // 2. Coba simpan ke Laravel REST API
    try {
      const res = await axios.post(`${API_BASE_URL}/artworks`, created, { timeout: 5000 });
      if (res.data && res.data.success && res.data.data) {
        dbSucceeded = true;
        const synced = formatArtItem(res.data.data);
        list.unshift(synced);
        saveLocalArtworks(list);
        return synced;
      }
    } catch (apiErr) {
      console.warn('Laravel API add artwork failed, fallback to Supabase/Local:', apiErr.message);
    }

    // 3. Coba simpan ke PostgreSQL Supabase
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('artworks')
          .insert([
            {
              judul: created.title,
              slug: created.slug,
              seniman_nama: created.artist,
              seniman_nim: created.artistNim || '-',
              seniman_angkatan: created.artistBatch || '2024',
              kategori: created.category,
              deskripsi_filosofi: created.description,
              medium_bahan: created.medium,
              dimensi: created.dimensions,
              tahun_pembuatan: created.year || '2024',
              foto_utama_url: created.imageUrl,
              booth_name: created.boothName,
              likes_count: 0,
              is_highlighted: Boolean(created.isHighlighted),
              tags: created.tags,
            },
          ])
          .select()
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          dbSucceeded = true;
          created.id = data.id;
        }
      } catch (err) {
        console.warn('Supabase insert artwork failed, saving locally:', err.message);

        // 🔄 TRANSACTION ROLLBACK: Hapus file yang terlanjur di-upload jika DB gagal
        if (uploadedStoragePath && !uploadedStoragePath.startsWith('local/')) {
          console.warn('Melakukan rollback file Supabase Storage:', uploadedStoragePath);
          await StorageService.deleteImage(uploadedStoragePath, 'artworks').catch(e => console.warn('Rollback failed:', e));
        }

        // Fallback simpan ke local storage agar input data panitia tidak hilang
        list.unshift(created);
        saveLocalArtworks(list);
        return created;
      }
    }

    list.unshift(created);
    saveLocalArtworks(list);
    return created;
  },

  /**
   * Perbarui / Edit data karya di katalog
   * Dilengkapi upload gambar baru & pembersihan gambar lama
   */
  async updateArtwork(id, updatedArt) {
    const list = getLocalArtworks();
    const existing = list.find(a => String(a.id) === String(id)) || {};
    let finalImageUrl = updatedArt.imageUrl || existing.imageUrl || '';
    let newlyUploadedStoragePath = null;

    // 1. Jika ada file gambar baru yang di-upload
    if (updatedArt.imageFile && (updatedArt.imageFile instanceof File || updatedArt.imageFile instanceof Blob)) {
      try {
        const uploadRes = await StorageService.uploadImage(updatedArt.imageFile, {
          bucket: 'artworks',
          folder: 'artworks'
        });
        finalImageUrl = uploadRes.publicUrl;
        newlyUploadedStoragePath = uploadRes.filePath;
      } catch (uploadErr) {
        console.error('Gagal mengunggah gambar baru:', uploadErr);
        throw new Error(`Upload gambar baru gagal: ${uploadErr.message}`);
      }
    }

    const formatted = formatArtItem({
      ...existing,
      ...updatedArt,
      id,
      imageUrl: finalImageUrl,
      slug: (updatedArt.title || existing.title || 'karya').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      isAnonymous: Boolean(updatedArt.isAnonymous),
      isHighlighted: Boolean(updatedArt.isHighlighted),
    });
    delete formatted.imageFile;

    // 2. Coba kirim ke Laravel REST API
    try {
      const res = await axios.put(`${API_BASE_URL}/artworks/${id}`, formatted, { timeout: 5000 });
      if (res.data && res.data.success && res.data.data) {
        // Hapus file lama jika ada file baru dan berbeda
        if (newlyUploadedStoragePath && existing.imageUrl && existing.imageUrl !== finalImageUrl) {
          StorageService.deleteImage(existing.imageUrl, 'artworks').catch(() => {});
        }
        const synced = formatArtItem(res.data.data);
        const nextList = list.map(a => String(a.id) === String(id) ? synced : a);
        saveLocalArtworks(nextList);
        return synced;
      }
    } catch (apiErr) {
      console.warn('Laravel API update artwork failed, fallback to Supabase/Local:', apiErr.message);
    }

    // 3. Coba kirim ke Supabase
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase
          .from('artworks')
          .update({
            judul: formatted.title,
            slug: formatted.slug,
            seniman_nama: formatted.artist,
            seniman_nim: formatted.artistNim || '-',
            seniman_angkatan: formatted.artistBatch || '2024',
            kategori: formatted.category,
            deskripsi_filosofi: formatted.description,
            medium_bahan: formatted.medium,
            dimensi: formatted.dimensions,
            tahun_pembuatan: formatted.year || '2024',
            foto_utama_url: formatted.imageUrl,
            booth_name: formatted.boothName,
            is_highlighted: formatted.isHighlighted,
            tags: formatted.tags,
          })
          .eq('id', id);

        if (error) {
          throw error;
        }

        // Hapus file lama dari storage jika berhasil diperbarui
        if (newlyUploadedStoragePath && existing.imageUrl && existing.imageUrl !== finalImageUrl) {
          StorageService.deleteImage(existing.imageUrl, 'artworks').catch(() => {});
        }
      } catch (err) {
        console.warn('Supabase update artwork failed, saving locally:', err.message);

        // 🔄 ROLLBACK: Hapus file baru jika update database gagal
        if (newlyUploadedStoragePath && !newlyUploadedStoragePath.startsWith('local/')) {
          await StorageService.deleteImage(newlyUploadedStoragePath, 'artworks').catch(() => {});
        }

        const nextList = list.map(a => String(a.id) === String(id) ? formatted : a);
        saveLocalArtworks(nextList);
        return formatted;
      }
    }

    const nextList = list.map(a => String(a.id) === String(id) ? formatted : a);
    saveLocalArtworks(nextList);
    return formatted;
  },

  /**
   * Hapus karya dari katalog (Lengkap dengan penghapusan file fisik di Supabase Storage)
   */
  async deleteArtwork(id) {
    const list = getLocalArtworks();
    const targetArt = list.find((a) => String(a.id) === String(id));

    // 1. Coba hapus via Laravel REST API
    try {
      await axios.delete(`${API_BASE_URL}/artworks/${id}`, { timeout: 4000 });
    } catch (apiErr) {
      console.warn('Laravel API delete artwork failed:', apiErr.message);
    }

    // 2. Coba hapus di Supabase
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('artworks').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete artwork failed:', err);
      }
    }

    // 3. 🧹 LIFECYCLE CLEANUP: Hapus file fisik gambar dari Supabase Storage
    if (targetArt && targetArt.imageUrl) {
      StorageService.deleteImage(targetArt.imageUrl, 'artworks').catch((err) => {
        console.warn('Storage file cleanup failed on delete:', err);
      });
    }

    const filtered = list.filter((a) => String(a.id) !== String(id));
    saveLocalArtworks(filtered);
    return filtered;
  },

  /**
   * Toggle like karya seni (Optimistic UI: langsung return & simpan lokal, sinkronisasi backend di background)
   */
  async toggleLike(artworkId) {
    let liked = JSON.parse(localStorage.getItem(LIKED_KEY) || '[]');
    const list = getLocalArtworks();
    const isAlreadyLiked = liked.includes(artworkId);

    let updatedLiked;
    let delta = 0;

    if (isAlreadyLiked) {
      updatedLiked = liked.filter((id) => id !== artworkId);
      delta = -1;
    } else {
      updatedLiked = [...liked, artworkId];
      delta = 1;
    }

    localStorage.setItem(LIKED_KEY, JSON.stringify(updatedLiked));

    const updatedList = list.map((art) => {
      if (art.id === artworkId) {
        return {
          ...art,
          likesCount: Math.max(0, (art.likesCount || 0) + delta),
        };
      }
      return art;
    });

    saveLocalArtworks(updatedList);

    // Kirim sinkronisasi ke backend secara asynchronous di background (tanpa menunggu/await)
    this._syncLikeToBackend(artworkId, updatedList, !isAlreadyLiked).catch((err) => {
      console.warn('Background like sync error:', err);
    });

    return {
      updatedList,
      isLiked: !isAlreadyLiked,
    };
  },

  /**
   * Helper background sync ke Laravel REST API & Supabase
   */
  async _syncLikeToBackend(artworkId, updatedList, isLiked) {
    // 1. Coba via Laravel REST API
    try {
      const res = await axios.post(`${API_BASE_URL}/artworks/${artworkId}/like`, {}, { timeout: 3000 });
      if (res.data && res.data.success) {
        return res.data;
      }
    } catch (apiErr) {
      console.warn('Laravel API toggle like background sync fallback:', apiErr.message);
    }

    // 2. Update to Supabase if connected
    if (isSupabaseConfigured() && supabase) {
      try {
        const target = updatedList.find((a) => a.id === artworkId);
        if (target) {
          await supabase
            .from('artworks')
            .update({ likes_count: target.likesCount })
            .eq('id', artworkId);
        }
      } catch (err) {
        console.warn('Supabase update like failed:', err);
      }
    }
  },

  getLikedIds() {
    try {
      return JSON.parse(localStorage.getItem(LIKED_KEY) || '[]');
    } catch {
      return [];
    }
  },

  /**
   * Memperbarui status penjualan karya di cache lokal / DB
   */
  updateArtworkSaleStatus(artworkId, saleStatus, buyerData = {}) {
    const list = getLocalArtworks();
    const idx = list.findIndex((a) => String(a.id) === String(artworkId));
    if (idx !== -1) {
      list[idx].saleStatus = saleStatus;
      if (buyerData.buyerName) list[idx].buyerName = buyerData.buyerName;
      if (buyerData.buyerEmail) list[idx].buyerEmail = buyerData.buyerEmail;
      if (buyerData.buyerPhone) list[idx].buyerPhone = buyerData.buyerPhone;
      if (buyerData.orderId) list[idx].currentOrderId = buyerData.orderId;
      saveLocalArtworks(list);
      return list[idx];
    }
    return null;
  },
};

