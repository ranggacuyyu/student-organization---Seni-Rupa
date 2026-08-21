<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Artwork;
use App\Models\ArtworkLike;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ArtworkController extends Controller
{
    private function formatArtwork(Artwork $art): array
    {
        return [
            'id' => $art->id,
            'slug' => $art->slug,
            'title' => $art->judul,
            'artist' => $art->seniman_nama,
            'artistNim' => $art->seniman_nim,
            'artistBatch' => $art->seniman_angkatan,
            'category' => $art->kategori,
            'medium' => $art->medium_bahan,
            'dimensions' => $art->dimensi,
            'year' => $art->tahun_pembuatan,
            'imageUrl' => $art->foto_utama_url,
            'description' => $art->deskripsi_filosofi,
            'boothId' => $art->booth_id,
            'boothName' => $art->booth_name,
            'likesCount' => $art->likes_count,
            'isHighlighted' => (bool)$art->is_highlighted,
            'tags' => $art->tags ?? ['Retro Pop', 'History'],
        ];
    }

    public function index(Request $request)
    {
        $query = Artwork::query()->orderBy('likes_count', 'desc');

        if ($request->filled('category') && $request->category !== 'Semua Kategori') {
            $query->where('kategori', $request->category);
        }

        if ($request->filled('booth_id')) {
            $query->where('booth_id', $request->booth_id);
        }

        if ($request->filled('search')) {
            $search = '%' . $request->search . '%';
            $query->where(function ($q) use ($search) {
                $q->where('judul', 'like', $search)
                  ->orWhere('seniman_nama', 'like', $search)
                  ->orWhere('deskripsi_filosofi', 'like', $search);
            });
        }

        $artworks = $query->get()->map(fn($art) => $this->formatArtwork($art));

        return response()->json([
            'success' => true,
            'data' => $artworks,
            'total' => $artworks->count(),
        ]);
    }

    public function show($idOrSlug)
    {
        $art = Artwork::where('id', $idOrSlug)->orWhere('slug', $idOrSlug)->first();

        if (!$art) {
            return response()->json(['success' => false, 'message' => 'Karya tidak ditemukan.'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $this->formatArtwork($art),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:200',
            'artist' => 'required|string|max:150',
            'category' => 'required|string',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp,svg|max:10240',
            'imageUrl' => 'nullable|string',
        ]);

        $imageUrl = $request->imageUrl;

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('artworks', 'public');
            $imageUrl = asset('storage/' . $path);
        }

        if (empty($imageUrl)) {
            $imageUrl = 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80';
        }

        $title = trim($request->title);
        $baseSlug = Str::slug($title);
        $slug = $baseSlug;
        $counter = 1;
        while (Artwork::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter++;
        }

        $art = Artwork::create([
            'id' => 'art-' . time() . '-' . Str::random(3),
            'judul' => $title,
            'slug' => $slug,
            'seniman_nama' => trim($request->artist),
            'seniman_nim' => $request->artistNim ?? '-',
            'seniman_angkatan' => $request->artistBatch ?? '2024',
            'kategori' => $request->category,
            'deskripsi_filosofi' => $request->description,
            'medium_bahan' => $request->medium ?? 'Mixed Media',
            'dimensi' => $request->dimensions ?? 'Ukuran Standar',
            'tahun_pembuatan' => $request->year ?? '2024',
            'foto_utama_url' => $imageUrl,
            'booth_id' => $request->boothId ?? 'booth-a',
            'booth_name' => $request->boothName ?? 'Zona A - Galeri Lukis Sejarah',
            'likes_count' => 0,
            'is_highlighted' => filter_var($request->isHighlighted, FILTER_VALIDATE_BOOLEAN),
            'tags' => $request->tags ?? ['Retro Pop', 'History'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Karya berhasil ditambahkan ke katalog!',
            'data' => $this->formatArtwork($art),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $art = Artwork::find($id);
        if (!$art) {
            return response()->json(['success' => false, 'message' => 'Karya tidak ditemukan.'], 404);
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('artworks', 'public');
            $art->foto_utama_url = asset('storage/' . $path);
        } elseif ($request->filled('imageUrl')) {
            $art->foto_utama_url = $request->imageUrl;
        }

        if ($request->filled('title')) $art->judul = $request->title;
        if ($request->filled('artist')) $art->seniman_nama = $request->artist;
        if ($request->filled('artistNim')) $art->seniman_nim = $request->artistNim;
        if ($request->filled('artistBatch')) $art->seniman_angkatan = $request->artistBatch;
        if ($request->filled('category')) $art->kategori = $request->category;
        if ($request->filled('description')) $art->deskripsi_filosofi = $request->description;
        if ($request->filled('medium')) $art->medium_bahan = $request->medium;
        if ($request->filled('dimensions')) $art->dimensi = $request->dimensions;
        if ($request->filled('year')) $art->tahun_pembuatan = $request->year;
        if ($request->filled('boothId')) $art->booth_id = $request->boothId;
        if ($request->filled('boothName')) $art->booth_name = $request->boothName;
        if ($request->has('isHighlighted')) $art->is_highlighted = filter_var($request->isHighlighted, FILTER_VALIDATE_BOOLEAN);

        $art->save();

        return response()->json([
            'success' => true,
            'message' => 'Karya berhasil diperbarui!',
            'data' => $this->formatArtwork($art),
        ]);
    }

    public function destroy($id)
    {
        $art = Artwork::find($id);
        if (!$art) {
            return response()->json(['success' => false, 'message' => 'Karya tidak ditemukan.'], 404);
        }

        $art->delete();

        return response()->json([
            'success' => true,
            'message' => 'Karya berhasil dihapus.',
        ]);
    }

    public function toggleLike(Request $request, $id)
    {
        $art = Artwork::find($id);
        if (!$art) {
            return response()->json(['success' => false, 'message' => 'Karya tidak ditemukan.'], 404);
        }

        $ip = $request->ip_address ?? $request->header('X-Forwarded-For') ?? $request->ip();
        if ($ip === '127.0.0.1' || $ip === '::1') {
            $ip = '180.254.88.99';
        }

        $existing = ArtworkLike::where('artwork_id', $id)
            ->where('ip_address', $ip)
            ->first();

        if ($existing) {
            $existing->delete();
            $art->decrement('likes_count');
            $isLiked = false;
        } else {
            ArtworkLike::create([
                'artwork_id' => $id,
                'ip_address' => $ip,
                'identifier' => $request->identifier,
            ]);
            $art->increment('likes_count');
            $isLiked = true;
        }

        $art->refresh();

        return response()->json([
            'success' => true,
            'isLiked' => $isLiked,
            'likesCount' => $art->likes_count,
            'data' => $this->formatArtwork($art),
        ]);
    }
}
