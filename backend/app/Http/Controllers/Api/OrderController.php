<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Artwork;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    /**
     * Membuat Pesanan Karya dengan Upload Bukti Transfer (QRIS DANA / Rekening)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'artwork_id' => 'required|string',
            'buyer_name' => 'required|string|max:100',
            'buyer_email' => 'required|email|max:150',
            'buyer_phone' => 'required|string|max:25',
            'pickup_notes' => 'nullable|string|max:500',
            'payment_type' => 'nullable|string|max:50',
            'payment_proof' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:10240',
            'payment_proof_url' => 'nullable|string',
        ]);

        try {
            return DB::transaction(function () use ($validated, $request) {
                $rawArtworkId = (string) $validated['artwork_id'];

                // 1. Kunci baris karya seni secara atomik
                $artwork = Artwork::where('id', $rawArtworkId)
                    ->orWhere('slug', $rawArtworkId)
                    ->lockForUpdate()
                    ->first();

                if (!$artwork && $request->filled('artwork_title')) {
                    $artwork = Artwork::where('judul', $request->artwork_title)
                        ->lockForUpdate()
                        ->first();
                }

                // Auto-register jika belum ada di database
                if (!$artwork) {
                    $fallbackTitle = $request->artwork_title ?: 'Karya Seni #' . $rawArtworkId;
                    $artwork = Artwork::create([
                        'id' => Str::startsWith($rawArtworkId, 'art-') ? $rawArtworkId : 'art-' . $rawArtworkId,
                        'judul' => $fallbackTitle,
                        'slug' => Str::slug($fallbackTitle),
                        'seniman_nama' => $request->artwork_artist ?: 'Seniman Polibatam',
                        'seniman_nim' => $request->artwork_artist_nim ?: '-',
                        'seniman_angkatan' => '2024',
                        'kategori' => $request->artwork_category ?: 'Lukis',
                        'medium_bahan' => 'Mixed Media',
                        'dimensi' => 'Ukuran Standar',
                        'tahun_pembuatan' => '2024',
                        'foto_utama_url' => $request->artwork_image ?: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
                        'deskripsi_filosofi' => 'Karya seni eksklusif pameran Seni Rupa Polibatam.',
                        'booth_id' => 'booth-a',
                        'booth_name' => 'Zona A - Galeri Karya Lukis',
                        'price' => (int) ($request->artwork_price ?: 150000),
                        'is_for_sale' => true,
                        'sale_status' => 'available',
                        'likes_count' => 0,
                    ]);
                }

                // 2. Validasi apakah karya boleh dijual
                if ($artwork->is_for_sale === false || $artwork->is_for_sale === 0) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Karya seni ini saat ini hanya untuk pameran (tidak dijual).',
                    ], 400);
                }

                // 3. Validasi status karya jika sudah resmi terjual
                if ($artwork->sale_status === 'sold') {
                    return response()->json([
                        'success' => false,
                        'message' => 'Maaf, karya seni unik (1-of-1) ini telah resmi dibeli dan dikoleksi oleh pengunjung lain.',
                    ], 400);
                }

                // 4. Tentukan harga karya
                $price = (int) ($artwork->price ?: ($request->artwork_price ?: 150000));
                if ($price <= 0) {
                    $price = 150000;
                }

                // 5. Handle Upload Bukti Transfer Pembeli
                $paymentProofUrl = $request->payment_proof_url;

                if ($request->hasFile('payment_proof')) {
                    $path = $request->file('payment_proof')->store('payment_proofs', 'public');
                    $paymentProofUrl = asset('storage/' . $path);
                }

                if (empty($paymentProofUrl)) {
                    $paymentProofUrl = $request->input('payment_proof_base64');
                }

                // 6. Buat ID Pesanan Unik
                $orderId = 'ORDER-SR-' . date('YmdHis') . '-' . strtoupper(Str::random(4));

                // 7. Simpan Order ke Database dengan status pending_review
                $order = Order::create([
                    'id' => $orderId,
                    'artwork_id' => $artwork->id,
                    'artwork_title' => $artwork->judul,
                    'buyer_name' => $validated['buyer_name'],
                    'buyer_email' => $validated['buyer_email'],
                    'buyer_phone' => $validated['buyer_phone'],
                    'pickup_notes' => $validated['pickup_notes'] ?? 'Ambil di Booth Pameran Lt. 3',
                    'gross_amount' => $price,
                    'payment_type' => $request->payment_type ?: 'QRIS DANA / Transfer Bank',
                    'payment_proof_url' => $paymentProofUrl,
                    'transaction_status' => 'pending_review',
                    'expired_at' => now()->addHours(24),
                ]);

                // 8. Tandai status karya menjadi booked (sedang diproses verifikasi)
                $artwork->update([
                    'sale_status' => 'booked',
                    'buyer_name' => $validated['buyer_name'],
                    'buyer_email' => $validated['buyer_email'],
                    'buyer_phone' => $validated['buyer_phone'],
                    'current_order_id' => $orderId,
                    'booked_until' => now()->addHours(24),
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Pesanan dan bukti transfer berhasil dikirim! Panitia akan memverifikasi pembayaran Anda.',
                    'order_id' => $orderId,
                    'gross_amount' => $price,
                    'transaction_status' => 'pending_review',
                    'order' => $order,
                    'artwork' => [
                        'id' => $artwork->id,
                        'title' => $artwork->judul,
                        'price' => $price,
                        'sale_status' => 'booked',
                    ],
                ], 201);
            });
        } catch (\Exception $e) {
            Log::error('Order Creation Error:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Gagal memproses pesanan: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Backward-compatible alias untuk createSnapToken (mengarah ke pembuatan pesanan)
     */
    public function createSnapToken(Request $request)
    {
        return $this->store($request);
    }

    /**
     * Mendapatkan riwayat semua transaksi (Untuk Panitia & Admin)
     */
    public function index(Request $request)
    {
        $query = Order::with('artwork')->orderBy('created_at', 'desc');

        if ($request->filled('status') && $request->status !== 'Semua') {
            if ($request->status === 'settlement' || $request->status === 'verified') {
                $query->whereIn('transaction_status', ['settlement', 'verified', 'success']);
            } elseif ($request->status === 'pending_review' || $request->status === 'pending') {
                $query->whereIn('transaction_status', ['pending_review', 'pending']);
            } elseif ($request->status === 'rejected') {
                $query->whereIn('transaction_status', ['rejected', 'cancel', 'expire', 'deny']);
            } elseif ($request->status === 'not_picked_up') {
                $query->whereIn('transaction_status', ['settlement', 'verified', 'success'])
                      ->where('is_picked_up', false);
            } elseif ($request->status === 'picked_up') {
                $query->where('is_picked_up', true);
            }
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('id', 'like', "%{$s}%")
                    ->orWhere('artwork_title', 'like', "%{$s}%")
                    ->orWhere('buyer_name', 'like', "%{$s}%")
                    ->orWhere('buyer_email', 'like', "%{$s}%")
                    ->orWhere('buyer_phone', 'like', "%{$s}%");
            });
        }

        $orders = $query->paginate($request->per_page ?? 50);

        // Statistik Penjualan Real-time
        $stats = [
            'total_sales_amount' => Order::whereIn('transaction_status', ['settlement', 'verified', 'success'])->sum('gross_amount'),
            'total_sold_artworks' => Order::whereIn('transaction_status', ['settlement', 'verified', 'success'])->count(),
            'pending_orders' => Order::whereIn('transaction_status', ['pending_review', 'pending'])->count(),
            'rejected_orders' => Order::whereIn('transaction_status', ['rejected', 'cancel', 'expire', 'deny'])->count(),
            'picked_up_count' => Order::where('is_picked_up', true)->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $orders,
            'stats' => $stats,
        ]);
    }

    /**
     * Mengambil detail satu pesanan
     */
    public function show($id)
    {
        $order = Order::with('artwork')->find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Pesanan tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $order,
        ]);
    }

    /**
     * VERIFIKASI PESANAN OLEH PANITIA (Tandai Lunas & Karya Resmi Terjual)
     */
    public function verify(Request $request, $id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Pesanan tidak ditemukan.',
            ], 404);
        }

        return DB::transaction(function () use ($order, $request) {
            $adminName = $request->input('admin_name', 'Panitia Lapangan');

            // 1. Update status order menjadi verified / settlement
            $order->update([
                'transaction_status' => 'settlement',
                'settled_at' => now(),
                'verified_by_admin' => $adminName,
                'verified_at' => now(),
                'admin_notes' => $request->input('admin_notes', 'Bukti transfer valid dan terverifikasi.'),
            ]);

            // 2. Update status karya menjadi sold (Terjual)
            if ($order->artwork_id) {
                Artwork::where('id', $order->artwork_id)->update([
                    'sale_status' => 'sold',
                    'buyer_name' => $order->buyer_name,
                    'buyer_email' => $order->buyer_email,
                    'buyer_phone' => $order->buyer_phone,
                    'current_order_id' => $order->id,
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Pembayaran berhasil diverifikasi! Karya resmi ditandai TERJUAL.',
                'data' => $order->fresh()->load('artwork'),
            ]);
        });
    }

    /**
     * TOLAK PESANAN OLEH PANITIA (Bukti Transfer Palsu / Tidak Masuk)
     * Mengembalikan status karya seni menjadi TERSEDIA (AVAILABLE)
     */
    public function reject(Request $request, $id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Pesanan tidak ditemukan.',
            ], 404);
        }

        return DB::transaction(function () use ($order, $request) {
            $adminName = $request->input('admin_name', 'Panitia Lapangan');
            $reason = $request->input('reason', 'Bukti transfer tidak valid atau dana belum masuk rekening.');

            // 1. Update status order menjadi rejected
            $order->update([
                'transaction_status' => 'rejected',
                'verified_by_admin' => $adminName,
                'verified_at' => now(),
                'rejection_reason' => $reason,
                'admin_notes' => 'Pesanan ditolak oleh ' . $adminName . ': ' . $reason,
            ]);

            // 2. Kembalikan status karya menjadi available (Tersedia kembali)
            if ($order->artwork_id) {
                Artwork::where('id', $order->artwork_id)->update([
                    'sale_status' => 'available',
                    'buyer_name' => null,
                    'buyer_email' => null,
                    'buyer_phone' => null,
                    'current_order_id' => null,
                    'booked_until' => null,
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Pesanan telah ditolak. Karya seni dikembalikan menjadi TERSEDIA di katalog.',
                'data' => $order->fresh()->load('artwork'),
            ]);
        });
    }

    /**
     * Konfirmasi Serah Terima Karya Fisik di Booth Pameran
     */
    public function togglePickup(Request $request, $id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Pesanan tidak ditemukan.',
            ], 404);
        }

        $nextStatus = !$order->is_picked_up;

        $order->update([
            'is_picked_up' => $nextStatus,
            'picked_up_at' => $nextStatus ? now() : null,
            'picked_up_by_admin' => $nextStatus ? ($request->admin_name ?? 'Panitia') : null,
        ]);

        return response()->json([
            'success' => true,
            'message' => $nextStatus 
                ? 'Karya fisik berhasil diserahkan kepada kolektor!' 
                : 'Status serah terima dibatalkan.',
            'data' => $order,
        ]);
    }

    /**
     * Mengambil Pengaturan QRIS Pameran
     */
    public function getQrisSettings()
    {
        $customQrisPath = storage_path('app/public/qris/qris-active.png');
        $timestamp = file_exists($customQrisPath) ? filemtime($customQrisPath) : time();
        
        $qrisImageUrl = file_exists($customQrisPath) 
            ? asset('storage/qris/qris-active.png') . '?v=' . $timestamp 
            : asset('qris-dana.png') . '?v=' . $timestamp;

        return response()->json([
            'success' => true,
            'data' => [
                'merchant_name' => 'CHARMY LUCK ART OFFICIAL',
                'qris_image_url' => $qrisImageUrl,
                'dana_number' => 'NMID: ID1025452455724 (A01)',
                'bank_name' => 'QRIS Standar Pembayaran Nasional (GPN)',
                'instructions' => 'Scan QRIS di atas melalui DANA, GoPay, OVO, ShopeePay, BCA Mobile, atau Livin Mandiri sesuai nominal karya. Upload screenshot bukti pembayaran Anda di bawah.',
            ],
        ]);
    }

    /**
     * Mengunggah Gambar QRIS Baru oleh Panitia / Admin
     */
    public function saveQrisSettings(Request $request)
    {
        $request->validate([
            'qris_image' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $path = $request->file('qris_image')->storeAs('qris', 'qris-active.png', 'public');
        $qrisImageUrl = asset('storage/' . $path) . '?v=' . time();

        return response()->json([
            'success' => true,
            'message' => 'Foto QRIS pameran berhasil diperbarui!',
            'data' => [
                'qris_image_url' => $qrisImageUrl,
            ],
        ]);
    }
}
