<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booth;
use Illuminate\Http\Request;

class BoothController extends Controller
{
    private function formatBooth(Booth $b): array
    {
        return [
            'id' => $b->id,
            'name' => $b->nama_zona,
            'code' => $b->kode_booth,
            'x' => $b->koordinat_x,
            'y' => $b->koordinat_y,
            'description' => $b->deskripsi_zona,
            'featuredCount' => $b->kapasitas_display,
            'color' => $b->color,
            'accent' => $b->accent,
            'icon' => $b->icon,
            'location' => $b->location,
            'activities' => $b->activities ?? [],
        ];
    }

    public function index()
    {
        $booths = Booth::all()->map(fn($b) => $this->formatBooth($b));

        return response()->json([
            'success' => true,
            'data' => $booths,
        ]);
    }

    public function show($id)
    {
        $booth = Booth::where('id', $id)->orWhere('kode_booth', $id)->first();
        if (!$booth) {
            return response()->json(['success' => false, 'message' => 'Booth tidak ditemukan.'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $this->formatBooth($booth),
        ]);
    }
}
