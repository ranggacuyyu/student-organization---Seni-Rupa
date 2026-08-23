<?php

namespace App\Http\Controllers\Api;

use App\Helpers\DeviceDetector;
use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AttendanceController extends Controller
{
    public function clientInfo(Request $request)
    {
        $ip = $request->header('X-Forwarded-For') 
            ? explode(',', $request->header('X-Forwarded-For'))[0] 
            : $request->ip();

        if ($ip === '127.0.0.1' || $ip === '::1') {
            $ip = '180.254.88.99'; // Default Batam network IP for local development
        }

        $userAgent = $request->header('User-Agent') ?? '';
        $deviceType = DeviceDetector::detect($userAgent);

        return response()->json([
            'ipAddress' => trim($ip),
            'userAgent' => $userAgent,
            'deviceType' => $deviceType,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_lengkap' => 'required|string|max:150',
            'kategori' => 'nullable|string|max:50',
            'identifier' => 'nullable|string|max:50',
            'jurusan_prodi' => 'nullable|string|max:100',
            'catatan' => 'nullable|string',
        ]);

        $ip = $request->ip_address;
        if (empty($ip)) {
            $ip = $request->header('X-Forwarded-For') 
                ? explode(',', $request->header('X-Forwarded-For'))[0] 
                : $request->ip();
            if ($ip === '127.0.0.1' || $ip === '::1') {
                $ip = '180.254.88.99';
            }
        }

        $userAgent = $request->user_agent ?? $request->header('User-Agent') ?? '';
        $deviceType = $request->device_type ?? DeviceDetector::detect($userAgent);

        $attendance = Attendance::create([
            'id' => 'att-' . time() . '-' . Str::random(4),
            'nama_lengkap' => trim($request->nama_lengkap),
            'identifier' => $request->identifier ? trim($request->identifier) : '-',
            'kategori' => $request->kategori ?? 'Mahasiswa Baru',
            'jurusan_prodi' => $request->jurusan_prodi ?? 'Politeknik Negeri Batam',
            'ip_address' => trim($ip),
            'user_agent' => $userAgent,
            'device_type' => $deviceType,
            'waktu_kehadiran' => now(),
            'catatan' => $request->catatan ?? '',
            'is_checked_in' => false,
            'is_souvenir_claimed' => false,
        ]);

        $totalCount = Attendance::count();

        return response()->json([
            'success' => true,
            'message' => 'Presensi berhasil dicatat!',
            'ticket' => $attendance,
            'data' => $attendance,
            'totalCount' => $totalCount,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $attendance = Attendance::find($id);
        if (!$attendance) {
            return response()->json(['success' => false, 'message' => 'Data presensi tidak ditemukan.'], 404);
        }

        if ($attendance->is_checked_in) {
            return response()->json(['success' => false, 'message' => 'Data presensi yang telah diverifikasi panitia tidak dapat diubah lagi.'], 400);
        }

        $request->validate([
            'nama_lengkap' => 'sometimes|required|string|max:150',
            'kategori' => 'nullable|string|max:50',
            'identifier' => 'nullable|string|max:50',
            'jurusan_prodi' => 'nullable|string|max:100',
            'catatan' => 'nullable|string',
        ]);

        if ($request->has('nama_lengkap')) $attendance->nama_lengkap = trim($request->nama_lengkap);
        if ($request->has('identifier')) $attendance->identifier = trim($request->identifier);
        if ($request->has('kategori')) $attendance->kategori = $request->kategori;
        if ($request->has('jurusan_prodi')) $attendance->jurusan_prodi = $request->jurusan_prodi;
        if ($request->has('catatan')) $attendance->catatan = $request->catatan;

        $attendance->save();

        return response()->json([
            'success' => true,
            'message' => 'Data presensi berhasil diperbarui!',
            'ticket' => $attendance,
            'data' => $attendance,
        ]);
    }

    public function index(Request $request)
    {
        $query = Attendance::query()->orderBy('waktu_kehadiran', 'desc');

        if ($request->filled('search')) {
            $search = '%' . $request->search . '%';
            $query->where(function ($q) use ($search) {
                $q->where('nama_lengkap', 'like', $search)
                  ->orWhere('identifier', 'like', $search)
                  ->orWhere('ip_address', 'like', $search)
                  ->orWhere('jurusan_prodi', 'like', $search);
            });
        }

        if ($request->filled('kategori') && $request->kategori !== 'Semua Kategori') {
            $query->where('kategori', $request->kategori);
        }

        $attendances = $query->get();

        return response()->json([
            'success' => true,
            'data' => $attendances,
            'total' => $attendances->count(),
        ]);
    }

    public function stats()
    {
        $total = Attendance::count();
        $mabaCount = Attendance::where('kategori', 'Mahasiswa Baru')->count();
        $polibatamCount = Attendance::where('kategori', 'Mahasiswa Polibatam')->count();
        $dosenCount = Attendance::where('kategori', 'Dosen/Staff')->count();
        $umumCount = Attendance::where('kategori', 'Tamu Umum')->count();
        $checkedInCount = Attendance::where('is_checked_in', true)->count();
        $souvenirCount = Attendance::where('is_souvenir_claimed', true)->count();

        return response()->json([
            'success' => true,
            'stats' => [
                'total' => $total,
                'checkedIn' => $checkedInCount,
                'souvenirClaimed' => $souvenirCount,
                'breakdown' => [
                    'maba' => $mabaCount,
                    'polibatam' => $polibatamCount,
                    'dosen' => $dosenCount,
                    'umum' => $umumCount,
                ],
            ],
        ]);
    }

    public function export()
    {
        $attendances = Attendance::orderBy('waktu_kehadiran', 'asc')->get();

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="Presensi_ArtShowcase_Senrup_' . date('Y-m-d_His') . '.csv"',
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        $callback = function () use ($attendances) {
            $handle = fopen('php://output', 'w');
            // Add BOM for UTF-8 in Excel
            fputs($handle, "\xEF\xBB\xBF");

            fputcsv($handle, [
                'ID Tiket',
                'Waktu Kehadiran',
                'Nama Lengkap',
                'NIM / Identitas',
                'Kategori',
                'Jurusan / Prodi',
                'IP Address',
                'Tipe Perangkat',
                'Status Check-in',
                'Klaim Souvenir',
                'Catatan / Pesan',
            ]);

            foreach ($attendances as $att) {
                fputcsv($handle, [
                    $att->id,
                    $att->waktu_kehadiran,
                    $att->nama_lengkap,
                    $att->identifier,
                    $att->kategori,
                    $att->jurusan_prodi,
                    $att->ip_address,
                    $att->device_type,
                    $att->is_checked_in ? 'Sudah Check-in' : 'Belum',
                    $att->is_souvenir_claimed ? 'Sudah Ambil' : 'Belum',
                    $att->catatan,
                ]);
            }

            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function verifyTicket(Request $request)
    {
        $query = $request->query('q', $request->input('query'));
        if (empty($query)) {
            return response()->json(['success' => false, 'message' => 'Kode tiket kosong.'], 400);
        }

        $cleanQ = trim((string)$query);

        // Check if query is JSON string from QR Code
        if (str_starts_with($cleanQ, '{') && str_ends_with($cleanQ, '}')) {
            $parsed = json_decode($cleanQ, true);
            if (isset($parsed['id'])) $cleanQ = $parsed['id'];
            elseif (isset($parsed['identifier'])) $cleanQ = $parsed['identifier'];
            elseif (isset($parsed['nim'])) $cleanQ = $parsed['nim'];
        }

        // Check if query has prefix ART-PASS:id:nim:nama
        if (str_starts_with(strtolower($cleanQ), 'art-pass:')) {
            $parts = explode(':', $cleanQ);
            if (isset($parts[1])) $cleanQ = trim($parts[1]);
        }

        $match = Attendance::where('id', $cleanQ)
            ->orWhere('identifier', $cleanQ)
            ->orWhere('ip_address', $cleanQ)
            ->orWhere('nama_lengkap', 'like', '%' . $cleanQ . '%')
            ->first();

        if (!$match) {
            return response()->json([
                'success' => false,
                'message' => 'Tiket tidak ditemukan dalam basis data presensi.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'ticket' => [
                'id' => $match->id,
                'nama_lengkap' => $match->nama_lengkap,
                'identifier' => $match->identifier,
                'kategori' => $match->kategori,
                'jurusan_prodi' => $match->jurusan_prodi,
                'ip_address' => $match->ip_address,
                'waktu_kehadiran' => $match->waktu_kehadiran,
                'catatan' => $match->catatan,
                'isCheckedIn' => (bool)$match->is_checked_in,
                'isSouvenirClaimed' => (bool)$match->is_souvenir_claimed,
            ],
        ]);
    }

    public function toggleCheckIn($id)
    {
        $attendance = Attendance::find($id);
        if (!$attendance) {
            return response()->json(['success' => false, 'message' => 'Data presensi tidak ditemukan.'], 404);
        }

        $attendance->is_checked_in = !$attendance->is_checked_in;
        $attendance->save();

        return response()->json([
            'success' => true,
            'isCheckedIn' => (bool)$attendance->is_checked_in,
            'message' => $attendance->is_checked_in ? 'Check-in berhasil!' : 'Status check-in dibatalkan.',
        ]);
    }

    public function toggleSouvenir($id)
    {
        $attendance = Attendance::find($id);
        if (!$attendance) {
            return response()->json(['success' => false, 'message' => 'Data presensi tidak ditemukan.'], 404);
        }

        $attendance->is_souvenir_claimed = !$attendance->is_souvenir_claimed;
        $attendance->save();

        return response()->json([
            'success' => true,
            'isSouvenirClaimed' => (bool)$attendance->is_souvenir_claimed,
            'message' => $attendance->is_souvenir_claimed ? 'Klaim souvenir berhasil dicatat!' : 'Status souvenir dibatalkan.',
        ]);
    }
}
