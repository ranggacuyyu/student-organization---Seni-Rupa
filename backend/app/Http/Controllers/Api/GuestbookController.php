<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Guestbook;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class GuestbookController extends Controller
{
    private function formatMessage(Guestbook $g): array
    {
        return [
            'id' => $g->id,
            'name' => $g->nama_pengirim,
            'role' => $g->status_pengirim,
            'message' => $g->pesan,
            'sticker' => $g->stiker_ikon,
            'color' => $g->warna_kartu,
            'textColor' => $g->warna_kartu === 'bg-[#FF3388]' ? 'text-white' : 'text-black',
            'createdAt' => $g->created_at ? $g->created_at->format('H:i') . ' WIB' : 'Baru saja',
        ];
    }

    public function index()
    {
        $messages = Guestbook::where('is_moderated', true)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($g) => $this->formatMessage($g));

        return response()->json([
            'success' => true,
            'data' => $messages,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:150',
            'message' => 'required|string|max:500',
        ]);

        $colors = ['bg-[#FFE600]', 'bg-[#FF3388]', 'bg-[#00F0FF]', 'bg-[#CCFF00]', 'bg-[#FF6B35]'];
        $stickers = ['retro-star', 'retro-heart', 'retro-brush', 'retro-smile'];

        $chosenColor = $request->color ?? $colors[array_rand($colors)];
        $chosenSticker = $request->sticker ?? $stickers[array_rand($stickers)];

        $ip = $request->ip_address ?? $request->header('X-Forwarded-For') ?? $request->ip();
        if ($ip === '127.0.0.1' || $ip === '::1') {
            $ip = '180.254.88.99';
        }

        $entry = Guestbook::create([
            'id' => 'gb-' . time() . '-' . Str::random(3),
            'nama_pengirim' => trim($request->name),
            'status_pengirim' => $request->role ?? 'Pengunjung Pameran',
            'pesan' => trim($request->message),
            'stiker_ikon' => $chosenSticker,
            'warna_kartu' => $chosenColor,
            'ip_address' => $ip,
            'is_moderated' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pesan kesan berhasil dikirim!',
            'data' => $this->formatMessage($entry),
        ], 201);
    }

    public function destroy($id)
    {
        $msg = Guestbook::find($id);
        if (!$msg) {
            return response()->json(['success' => false, 'message' => 'Pesan tidak ditemukan.'], 404);
        }

        $msg->delete();

        return response()->json([
            'success' => true,
            'message' => 'Pesan berhasil dihapus.',
        ]);
    }
}
