<?php

use App\Http\Controllers\Api\ArtworkController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BoothController;
use App\Http\Controllers\Api\GuestbookController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PanitiaController;
use App\Http\Controllers\Api\PaymentCallbackController;
use App\Http\Controllers\Api\RundownController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - ART SHOW CASE "HISTORY" (Divisi Seni Rupa Polibatam)
|--------------------------------------------------------------------------
*/

// === 1. Client IP & Device Info ===
Route::get('/client-info', [AttendanceController::class, 'clientInfo']);

// === 2. Authentication ===
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});

// === 3. Presensi & Kehadiran Pengunjung ===
Route::prefix('attendance')->group(function () {
    Route::post('/', [AttendanceController::class, 'store']);
    Route::put('/{id}', [AttendanceController::class, 'update']);
    Route::get('/', [AttendanceController::class, 'index']);
    Route::get('/stats', [AttendanceController::class, 'stats']);
    Route::get('/export', [AttendanceController::class, 'export']);
    Route::get('/verify', [AttendanceController::class, 'verifyTicket']);
    Route::patch('/{id}/check-in', [AttendanceController::class, 'toggleCheckIn']);
    Route::patch('/{id}/souvenir', [AttendanceController::class, 'toggleSouvenir']);
});
// Alias for /api/attendances
Route::get('/attendances', [AttendanceController::class, 'index']);
Route::get('/attendances/stats', [AttendanceController::class, 'stats']);
Route::get('/attendances/export', [AttendanceController::class, 'export']);

// === 4. Katalog Karya Seni ===
Route::prefix('artworks')->group(function () {
    Route::get('/', [ArtworkController::class, 'index']);
    Route::get('/{idOrSlug}', [ArtworkController::class, 'show']);
    Route::post('/', [ArtworkController::class, 'store']);
    Route::post('/{id}', [ArtworkController::class, 'update']);
    Route::put('/{id}', [ArtworkController::class, 'update']);
    Route::delete('/{id}', [ArtworkController::class, 'destroy']);
    Route::post('/{id}/like', [ArtworkController::class, 'toggleLike']);
});

// === 5. Layout & Peta Booth Lt. 3 ===
Route::prefix('layout')->group(function () {
    Route::get('/booths', [BoothController::class, 'index']);
    Route::get('/booths/{id}', [BoothController::class, 'show']);
});

// === 6. Rundown & Jadwal Acara ===
Route::prefix('rundown')->group(function () {
    Route::get('/', [RundownController::class, 'index']);
    Route::post('/', [RundownController::class, 'store']);
    Route::patch('/{id}/status', [RundownController::class, 'updateStatus']);
    Route::delete('/{id}', [RundownController::class, 'destroy']);
});

// === 7. Buku Tamu (Guestbook) ===
Route::prefix('guestbook')->group(function () {
    Route::get('/', [GuestbookController::class, 'index']);
    Route::post('/', [GuestbookController::class, 'store']);
    Route::delete('/{id}', [GuestbookController::class, 'destroy']);
});

// === 8. Operasional Panitia & Admin ===
Route::prefix('panitia')->group(function () {
    // Akun
    Route::get('/accounts', [PanitiaController::class, 'getAccounts']);
    Route::post('/accounts', [PanitiaController::class, 'storeAccount']);
    Route::put('/accounts/{id}', [PanitiaController::class, 'updateAccount']);
    Route::delete('/accounts/{id}', [PanitiaController::class, 'deleteAccount']);

    // Tugas
    Route::get('/tasks', [PanitiaController::class, 'getTasks']);
    Route::post('/tasks', [PanitiaController::class, 'storeTask']);
    Route::patch('/tasks/{id}/toggle', [PanitiaController::class, 'toggleTask']);
    Route::delete('/tasks/{id}', [PanitiaController::class, 'deleteTask']);

    // Pengumuman
    Route::get('/announcements', [PanitiaController::class, 'getAnnouncements']);
    Route::post('/announcements', [PanitiaController::class, 'storeAnnouncement']);
    Route::delete('/announcements/{id}', [PanitiaController::class, 'deleteAnnouncement']);

    // Kebutuhan Peserta
    Route::get('/participant-needs', [PanitiaController::class, 'getParticipantNeeds']);
});

// === 9. Transaksi Pembelian Karya Seni (QRIS Transfer & Verifikasi Bukti) ===
Route::prefix('orders')->group(function () {
    Route::get('/', [OrderController::class, 'index']);
    Route::post('/', [OrderController::class, 'store']);
    Route::post('/create-snap-token', [OrderController::class, 'createSnapToken']);
    Route::get('/{id}', [OrderController::class, 'show']);
    Route::patch('/{id}/verify', [OrderController::class, 'verify']);
    Route::patch('/{id}/reject', [OrderController::class, 'reject']);
    Route::patch('/{id}/pickup', [OrderController::class, 'togglePickup']);
});

// === 10. Pengaturan QRIS Pameran ===
Route::prefix('settings')->group(function () {
    Route::get('/qris', [OrderController::class, 'getQrisSettings']);
    Route::post('/qris', [OrderController::class, 'saveQrisSettings']);
});

// === 11. Webhook Notifikasi Pembayaran (Opsional Fallback) ===
Route::post('/payment/notification', [PaymentCallbackController::class, 'handle']);


