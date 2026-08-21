<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Rundown;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class RundownController extends Controller
{
    private function formatRundown(Rundown $r): array
    {
        return [
            'id' => $r->id,
            'urutan' => $r->urutan,
            'time' => $r->time ?? ($r->waktu_mulai ? "{$r->waktu_mulai} - {$r->waktu_selesai}" : ''),
            'waktu_mulai' => $r->waktu_mulai,
            'waktu_selesai' => $r->waktu_selesai,
            'title' => $r->sesi_kegiatan,
            'sesi_kegiatan' => $r->sesi_kegiatan,
            'speaker' => $r->pengisi_acara,
            'pengisi_acara' => $r->pengisi_acara,
            'location' => $r->lokasi_sesi,
            'lokasi_sesi' => $r->lokasi_sesi,
            'category' => $r->category ?? 'Acara',
            'status' => $r->status,
            'description' => $r->deskripsi,
            'deskripsi' => $r->deskripsi,
            'boothId' => $r->booth_id ?? 'booth-d',
        ];
    }

    public function index()
    {
        $rundowns = Rundown::orderBy('urutan', 'asc')
            ->get()
            ->map(fn($r) => $this->formatRundown($r));

        return response()->json([
            'success' => true,
            'data' => $rundowns,
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:upcoming,ongoing,completed',
        ]);

        $rundown = Rundown::find($id);
        if (!$rundown) {
            return response()->json(['success' => false, 'message' => 'Rundown tidak ditemukan.'], 404);
        }

        $rundown->status = $request->status;
        $rundown->save();

        $all = Rundown::orderBy('urutan', 'asc')
            ->get()
            ->map(fn($r) => $this->formatRundown($r));

        return response()->json([
            'success' => true,
            'message' => 'Status rundown berhasil diperbarui!',
            'data' => $all,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:150',
            'time' => 'nullable|string|max:50',
            'speaker' => 'nullable|string|max:150',
            'location' => 'nullable|string|max:150',
            'status' => 'nullable|in:upcoming,ongoing,completed',
        ]);

        $maxUrutan = Rundown::max('urutan') ?? 0;

        $rundown = Rundown::create([
            'id' => 'run-' . time() . '-' . Str::random(3),
            'urutan' => $maxUrutan + 1,
            'sesi_kegiatan' => $request->title,
            'time' => $request->time ?? '10:00 - 11:00',
            'pengisi_acara' => $request->speaker ?? 'Panitia Divisi Seni Rupa',
            'lokasi_sesi' => $request->location ?? 'Panggung Utama Student Centre Lt 3',
            'category' => $request->category ?? 'Acara',
            'status' => $request->status ?? 'upcoming',
            'deskripsi' => $request->description ?? '',
            'booth_id' => $request->boothId ?? 'booth-d',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Jadwal rundown berhasil ditambahkan!',
            'data' => $this->formatRundown($rundown),
        ], 201);
    }

    public function destroy($id)
    {
        $rundown = Rundown::find($id);
        if (!$rundown) {
            return response()->json(['success' => false, 'message' => 'Rundown tidak ditemukan.'], 404);
        }

        $rundown->delete();

        return response()->json([
            'success' => true,
            'message' => 'Jadwal rundown berhasil dihapus.',
        ]);
    }
}
