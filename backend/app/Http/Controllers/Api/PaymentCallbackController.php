<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Artwork;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentCallbackController extends Controller
{
    /**
     * Webhook HTTP Notification Handler dari Server Midtrans
     * Dilengkapi Verifikasi Tanda Tangan Kriptografi SHA-512 (Anti-Tampering)
     */
    public function handle(Request $request)
    {
        $payload = $request->all();

        // 1. Ekstrak parameter penting dari notifikasi Midtrans
        $orderId = $payload['order_id'] ?? null;
        $statusCode = $payload['status_code'] ?? null;
        $grossAmount = $payload['gross_amount'] ?? null;
        $signatureKey = $payload['signature_key'] ?? null;
        $transactionStatus = $payload['transaction_status'] ?? null;
        $fraudStatus = $payload['fraud_status'] ?? null;
        $paymentType = $payload['payment_type'] ?? 'unknown';
        $transactionId = $payload['transaction_id'] ?? null;

        if (!$orderId || !$statusCode || !$grossAmount || !$signatureKey) {
            Log::warning('Midtrans Webhook: Payload tidak lengkap.', $payload);
            return response()->json([
                'success' => false,
                'message' => 'Invalid webhook payload structure.',
            ], 400);
        }

        // 2. Verifikasi SHA-512 Signature Key (Mencegah Pemalsuan Webhook / Man-in-the-Middle)
        $serverKey = config('midtrans.server_key');
        $expectedSignature = hash('sha512', $orderId . $statusCode . $grossAmount . $serverKey);

        if (!hash_equals($expectedSignature, $signatureKey)) {
            Log::error('Midtrans Webhook: Signature TIDAK VALID! Potensi serangan manipulasi.', [
                'order_id' => $orderId,
                'received_signature' => $signatureKey,
                'expected_signature' => $expectedSignature,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Signature key mismatch / unauthorized.',
            ], 403);
        }

        // 3. Cari Order di database
        $order = Order::find($orderId);
        if (!$order) {
            Log::error("Midtrans Webhook: Order ID {$orderId} tidak ditemukan di database.");
            return response()->json([
                'success' => false,
                'message' => 'Order not found.',
            ], 404);
        }

        // 4. Proses perubahan status dalam Database Transaction
        try {
            DB::transaction(function () use ($order, $transactionStatus, $fraudStatus, $paymentType, $transactionId, $payload) {
                $artwork = Artwork::where('id', $order->artwork_id)->lockForUpdate()->first();

                // Logika Status Pembayaran Midtrans
                if ($transactionStatus === 'capture') {
                    if ($fraudStatus === 'challenge') {
                        $order->update([
                            'transaction_status' => 'challenge',
                            'payment_type' => $paymentType,
                            'midtrans_transaction_id' => $transactionId,
                            'raw_response' => $payload,
                        ]);
                    } elseif ($fraudStatus === 'accept') {
                        $order->update([
                            'transaction_status' => 'settlement',
                            'payment_type' => $paymentType,
                            'settled_at' => now(),
                            'midtrans_transaction_id' => $transactionId,
                            'raw_response' => $payload,
                        ]);

                        if ($artwork) {
                            $artwork->update([
                                'sale_status' => 'sold',
                                'buyer_name' => $order->buyer_name,
                                'buyer_email' => $order->buyer_email,
                                'buyer_phone' => $order->buyer_phone,
                                'current_order_id' => $order->id,
                                'booked_until' => null,
                            ]);
                        }
                    }
                } elseif ($transactionStatus === 'settlement') {
                    // Pembayaran Berhasil Lunas (QRIS, GoPay, ShopeePay, VA Transfer, dll.)
                    $order->update([
                        'transaction_status' => 'settlement',
                        'payment_type' => $paymentType,
                        'settled_at' => now(),
                        'midtrans_transaction_id' => $transactionId,
                        'raw_response' => $payload,
                    ]);

                    if ($artwork) {
                        $artwork->update([
                            'sale_status' => 'sold',
                            'buyer_name' => $order->buyer_name,
                            'buyer_email' => $order->buyer_email,
                            'buyer_phone' => $order->buyer_phone,
                            'current_order_id' => $order->id,
                            'booked_until' => null,
                        ]);
                    }
                } elseif ($transactionStatus === 'pending') {
                    // Menunggu Pembayaran dari Pembeli
                    $order->update([
                        'transaction_status' => 'pending',
                        'payment_type' => $paymentType,
                        'midtrans_transaction_id' => $transactionId,
                        'raw_response' => $payload,
                    ]);

                    if ($artwork && $artwork->sale_status !== 'sold') {
                        $artwork->update([
                            'sale_status' => 'booked',
                            'booked_until' => now()->addMinutes(20),
                        ]);
                    }
                } elseif (in_array($transactionStatus, ['deny', 'expire', 'cancel', 'failure'])) {
                    // Pembayaran Dibatalkan / Kedaluwarsa / Gagal
                    $order->update([
                        'transaction_status' => $transactionStatus,
                        'payment_type' => $paymentType,
                        'midtrans_transaction_id' => $transactionId,
                        'raw_response' => $payload,
                    ]);

                    // Lepaskan kunci karya seni agar dapat dibeli oleh pengunjung lain
                    if ($artwork && $artwork->current_order_id === $order->id && $artwork->sale_status !== 'sold') {
                        $artwork->update([
                            'sale_status' => 'available',
                            'current_order_id' => null,
                            'booked_until' => null,
                        ]);
                    }
                }
            });

            Log::info("Midtrans Webhook: Berhasil memproses Order {$orderId} -> {$transactionStatus}");

            return response()->json([
                'success' => true,
                'message' => 'Payment notification processed successfully.',
            ], 200);
        } catch (\Exception $e) {
            Log::error("Midtrans Webhook Processing Exception: {$e->getMessage()}", [
                'order_id' => $orderId,
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error processing webhook: ' . $e->getMessage(),
            ], 500);
        }
    }
}
