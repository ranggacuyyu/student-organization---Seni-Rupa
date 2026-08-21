<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\PanitiaAnnouncement;
use App\Models\PanitiaTask;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class PanitiaController extends Controller
{
    // ================= 1. AKUN PANITIA =================
    private function formatAccount(User $u): array
    {
        return [
            'id' => $u->id,
            'username' => $u->username,
            'nama' => $u->name,
            'name' => $u->name,
            'email' => $u->email,
            'role' => $u->role,
            'divisi' => $u->divisi,
            'assignedBooth' => $u->assigned_booth,
            'kontak' => $u->kontak,
            'status' => $u->status,
            'avatarBg' => $u->avatar_bg,
        ];
    }

    public function getAccounts()
    {
        $users = User::all()->map(fn($u) => $this->formatAccount($u));
        return response()->json(['success' => true, 'data' => $users]);
    }

    public function storeAccount(Request $request)
    {
        $request->validate([
            'username' => 'required|string|unique:users,username',
            'nama' => 'required|string',
            'password' => 'required|string|min:4',
        ]);

        $colors = ['bg-[#FF3388]', 'bg-[#FFE600]', 'bg-[#00F0FF]', 'bg-[#7B2CBF]', 'bg-[#22C55E]'];

        $user = User::create([
            'id' => 'user-panitia-' . time() . '-' . Str::random(3),
            'name' => $request->nama,
            'username' => trim(strtolower($request->username)),
            'email' => $request->email ?? ($request->username . '@senrup.polibatam.ac.id'),
            'password' => Hash::make($request->password),
            'role' => $request->role ?? 'panitia',
            'divisi' => $request->divisi ?? 'Divisi Pelaksana',
            'assigned_booth' => $request->assignedBooth ?? 'Semua Zona (Lt. 3)',
            'kontak' => $request->kontak ?? '-',
            'status' => 'active',
            'avatar_bg' => $request->avatarBg ?? $colors[array_rand($colors)],
        ]);

        $all = User::all()->map(fn($u) => $this->formatAccount($u));

        return response()->json([
            'success' => true,
            'message' => 'Akun panitia berhasil dibuat!',
            'data' => $all,
        ], 201);
    }

    public function updateAccount(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Akun tidak ditemukan.'], 404);
        }

        if ($request->filled('nama')) $user->name = $request->nama;
        if ($request->filled('username')) $user->username = trim(strtolower($request->username));
        if ($request->filled('password')) $user->password = Hash::make($request->password);
        if ($request->filled('role')) $user->role = $request->role;
        if ($request->filled('divisi')) $user->divisi = $request->divisi;
        if ($request->filled('assignedBooth')) $user->assigned_booth = $request->assignedBooth;
        if ($request->filled('kontak')) $user->kontak = $request->kontak;
        if ($request->filled('status')) $user->status = $request->status;
        if ($request->filled('avatarBg')) $user->avatar_bg = $request->avatarBg;

        $user->save();

        $all = User::all()->map(fn($u) => $this->formatAccount($u));

        return response()->json([
            'success' => true,
            'message' => 'Akun panitia berhasil diperbarui!',
            'data' => $all,
        ]);
    }

    public function deleteAccount($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Akun tidak ditemukan.'], 404);
        }

        $user->delete();

        $all = User::all()->map(fn($u) => $this->formatAccount($u));

        return response()->json([
            'success' => true,
            'message' => 'Akun berhasil dihapus.',
            'data' => $all,
        ]);
    }

    // ================= 2. TUGAS LOGISTIK PANITIA =================
    private function formatTask(PanitiaTask $t): array
    {
        return [
            'id' => $t->id,
            'title' => $t->title,
            'location' => $t->location,
            'assignedTo' => $t->assigned_to,
            'priority' => $t->priority,
            'isCompleted' => (bool)$t->is_completed,
            'category' => $t->category,
        ];
    }

    public function getTasks()
    {
        $tasks = PanitiaTask::orderBy('created_at', 'desc')->get()->map(fn($t) => $this->formatTask($t));
        return response()->json(['success' => true, 'data' => $tasks]);
    }

    public function storeTask(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:200',
        ]);

        $task = PanitiaTask::create([
            'id' => 'task-' . time() . '-' . Str::random(3),
            'title' => $request->title,
            'location' => $request->location ?? 'Student Centre Lt. 3',
            'assigned_to' => $request->assignedTo ?? 'Semua Panitia',
            'priority' => $request->priority ?? 'Sedang',
            'is_completed' => false,
            'category' => $request->category ?? 'Operasional',
        ]);

        $all = PanitiaTask::orderBy('created_at', 'desc')->get()->map(fn($t) => $this->formatTask($t));

        return response()->json([
            'success' => true,
            'message' => 'Tugas baru berhasil ditambahkan!',
            'data' => $all,
        ], 201);
    }

    public function toggleTask($id)
    {
        $task = PanitiaTask::find($id);
        if (!$task) {
            return response()->json(['success' => false, 'message' => 'Tugas tidak ditemukan.'], 404);
        }

        $task->is_completed = !$task->is_completed;
        $task->save();

        $all = PanitiaTask::orderBy('created_at', 'desc')->get()->map(fn($t) => $this->formatTask($t));

        return response()->json([
            'success' => true,
            'data' => $all,
        ]);
    }

    public function deleteTask($id)
    {
        $task = PanitiaTask::find($id);
        if (!$task) {
            return response()->json(['success' => false, 'message' => 'Tugas tidak ditemukan.'], 404);
        }

        $task->delete();

        $all = PanitiaTask::orderBy('created_at', 'desc')->get()->map(fn($t) => $this->formatTask($t));

        return response()->json([
            'success' => true,
            'message' => 'Tugas berhasil dihapus.',
            'data' => $all,
        ]);
    }

    // ================= 3. PENGUMUMAN INTERNAL =================
    private function formatAnnouncement(PanitiaAnnouncement $a): array
    {
        return [
            'id' => $a->id,
            'title' => $a->title,
            'content' => $a->content,
            'author' => $a->author,
            'waktu' => $a->waktu ?? ($a->created_at ? $a->created_at->format('H:i') . ' WIB' : 'Baru saja'),
            'isPinned' => (bool)$a->is_pinned,
        ];
    }

    public function getAnnouncements()
    {
        $ann = PanitiaAnnouncement::orderBy('is_pinned', 'desc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($a) => $this->formatAnnouncement($a));

        return response()->json(['success' => true, 'data' => $ann]);
    }

    public function storeAnnouncement(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:200',
            'content' => 'required|string',
        ]);

        $ann = PanitiaAnnouncement::create([
            'id' => 'ann-' . time() . '-' . Str::random(3),
            'title' => $request->title,
            'content' => $request->content,
            'author' => $request->author ?? 'Koordinator',
            'waktu' => date('H:i') . ' WIB',
            'is_pinned' => filter_var($request->isPinned, FILTER_VALIDATE_BOOLEAN),
        ]);

        $all = PanitiaAnnouncement::orderBy('is_pinned', 'desc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($a) => $this->formatAnnouncement($a));

        return response()->json([
            'success' => true,
            'message' => 'Pengumuman berhasil disebarkan!',
            'data' => $all,
        ], 201);
    }

    public function deleteAnnouncement($id)
    {
        $ann = PanitiaAnnouncement::find($id);
        if (!$ann) {
            return response()->json(['success' => false, 'message' => 'Pengumuman tidak ditemukan.'], 404);
        }

        $ann->delete();

        $all = PanitiaAnnouncement::orderBy('is_pinned', 'desc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($a) => $this->formatAnnouncement($a));

        return response()->json([
            'success' => true,
            'message' => 'Pengumuman berhasil dihapus.',
            'data' => $all,
        ]);
    }

    // ================= 4. KEBUTUHAN PESERTA & REGISTRASI =================
    public function getParticipantNeeds()
    {
        $attendances = Attendance::orderBy('waktu_kehadiran', 'desc')->get();

        $formatted = $attendances->map(function ($att) {
            return [
                'id' => $att->id,
                'nama_lengkap' => $att->nama_lengkap,
                'identifier' => $att->identifier,
                'kategori' => $att->kategori,
                'jurusan_prodi' => $att->jurusan_prodi,
                'ip_address' => $att->ip_address,
                'waktu_kehadiran' => $att->waktu_kehadiran,
                'catatan' => $att->catatan,
                'isCheckedIn' => (bool)$att->is_checked_in,
                'isSouvenirClaimed' => (bool)$att->is_souvenir_claimed,
                'hasPassCard' => true,
                'hasBooklet' => (bool)$att->is_checked_in,
                'hasPhotoboothAccess' => $att->kategori === 'Mahasiswa Baru' || (bool)$att->is_souvenir_claimed,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $formatted,
        ]);
    }
}
