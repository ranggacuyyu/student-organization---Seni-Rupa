/**
 * 🖼️ Artwork Catalog & Likes Database Service
 * Sesuai Spesifikasi: BLUEPRINT_ART_SHOWCASE.md (Tabel: artworks, artwork_likes)
 */
import axios from 'axios';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import { INITIAL_ARTWORKS } from '../../data/mockData';

const LOCAL_STORAGE_KEY = 'senrup_artworks_v1';
const LIKED_KEY = 'senrup_liked_artworks_v1';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const getLocalArtworks = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      saveLocalArtworks(INITIAL_ARTWORKS);
      return INITIAL_ARTWORKS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Merge in any new default artworks from INITIAL_ARTWORKS (e.g. anonymous & generated works)
      const existingIds = new Set(parsed.map(a => a.id));
      const newDefaults = INITIAL_ARTWORKS.filter(a => !existingIds.has(a.id));
      const combined = [...parsed, ...newDefaults].map(art => ({
        ...art,
        isAnonymous: Boolean(
          art.isAnonymous || 
          art.is_anonymous || 
          (typeof art.artist === 'string' && /rahasia|dirahasiakan|anonim|anonymous|secret|misterius/i.test(art.artist))
        )
      }));
      if (newDefaults.length > 0) {
        saveLocalArtworks(combined);
      }
      return combined;
    }
    saveLocalArtworks(INITIAL_ARTWORKS);
    return INITIAL_ARTWORKS;
  } catch {
    return INITIAL_ARTWORKS;
  }
};

const saveLocalArtworks = (list) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save artworks to localStorage:', e);
  }
};

export const ArtworkDb = {
  /**
   * Ambil seluruh karya seni
   */
  async getAllArtworks() {
    // 1. Coba dari Laravel REST API
    try {
      const res = await axios.get(`${API_BASE_URL}/artworks`, { timeout: 4000 });
      if (res.data && res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        const formatted = res.data.data.map(art => ({
          ...art,
          isAnonymous: Boolean(
            art.isAnonymous || 
            art.is_anonymous || 
            (typeof art.artist === 'string' && /rahasia|dirahasiakan|anonim|anonymous|secret|misterius/i.test(art.artist))
          )
        }));
        saveLocalArtworks(formatted);
        return formatted;
      }
    } catch (apiErr) {
      console.warn('Laravel API fetch artworks failed, fallback to Supabase/Local:', apiErr.message);
    }

    // 2. Coba dari Supabase
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('artworks')
          .select('*')
          .order('likes_count', { ascending: false });

        if (!error && data && data.length > 0) {
          const formatted = data.map((art) => ({
            id: art.id,
            slug: art.slug,
            title: art.judul || art.title,
            artist: art.seniman_nama || art.artist,
            artistNim: art.seniman_nim || art.artistNim,
            artistBatch: art.seniman_angkatan || art.artistBatch,
            isAnonymous: Boolean(
              art.is_anonymous || 
              art.isAnonymous || 
              (typeof (art.seniman_nama || art.artist) === 'string' && /rahasia|dirahasiakan|anonim|anonymous|secret|misterius/i.test(art.seniman_nama || art.artist))
            ),
            category: art.kategori || art.category,
            medium: art.medium_bahan || art.medium,
            dimensions: art.dimensi || art.dimensions,
            year: art.tahun_pembuatan || art.year,
            imageUrl: art.foto_utama_url || art.imageUrl,
            description: art.deskripsi_filosofi || art.description,
            boothId: art.booth_id || art.boothId,
            boothName: art.booth_name || art.boothName,
            likesCount: art.likes_count ?? art.likesCount ?? 0,
            isHighlighted: art.is_highlighted ?? art.isHighlighted ?? false,
            tags: art.tags || ['Retro Pop', 'History'],
          }));
          saveLocalArtworks(formatted);
          return formatted;
        }
      } catch (err) {
        console.warn('Supabase fetch artworks failed, using fallback:', err);
      }
    }

    return getLocalArtworks();
  },

  /**
   * Tambah karya baru ke katalog
   */
  async addArtwork(newArt) {
    const list = getLocalArtworks();
    const created = {
      id: 'art-' + Date.now(),
      slug: (newArt.title || 'karya').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      likesCount: 0,
      tags: ['Retro Pop', 'History'],
      isAnonymous: Boolean(newArt.isAnonymous),
      ...newArt,
    };

    // 1. Coba kirim ke Laravel REST API
    try {
      const res = await axios.post(`${API_BASE_URL}/artworks`, newArt, { timeout: 5000 });
      if (res.data && res.data.success && res.data.data) {
        list.unshift(res.data.data);
        saveLocalArtworks(list);
        return res.data.data;
      }
    } catch (apiErr) {
      console.warn('Laravel API add artwork failed, fallback to Supabase/Local:', apiErr.message);
    }

    // 2. Coba kirim ke Supabase
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
            },
          ])
          .select()
          .single();

        if (!error && data) {
          created.id = data.id;
        }
      } catch (err) {
        console.warn('Supabase insert artwork failed:', err);
      }
    }

    list.unshift(created);
    saveLocalArtworks(list);
    return created;
  },

  /**
   * Hapus karya dari katalog
   */
  async deleteArtwork(id) {
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

    const list = getLocalArtworks();
    const filtered = list.filter((a) => a.id !== id);
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
};
