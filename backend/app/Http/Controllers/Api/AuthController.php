<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $username = trim(strtolower($request->username));
        $user = User::whereRaw('LOWER(username) = ?', [$username])
            ->orWhereRaw('LOWER(email) = ?', [$username])
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            // Also allow plain match if legacy mock password during transition
            if (!$user || $user->password !== $request->password) {
                return response()->json([
                    'success' => false,
                    'message' => 'Username atau password tidak cocok!',
                ], 401);
            }
        }

        if ($user->status !== 'active') {
            return response()->json([
                'success' => false,
                'message' => 'Akun ini sedang dinonaktifkan oleh Koordinator.',
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        $userSession = [
            'id' => $user->id,
            'username' => $user->username,
            'nama' => $user->name,
            'role' => $user->role,
            'divisi' => $user->divisi,
            'assignedBooth' => $user->assigned_booth,
            'kontak' => $user->kontak,
            'status' => $user->status,
            'avatarBg' => $user->avatar_bg,
        ];

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil!',
            'token' => $token,
            'user' => $userSession,
        ]);
    }

    public function logout(Request $request)
    {
        if ($request->user()) {
            $request->user()->currentAccessToken()->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil!',
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthenticated'], 401);
        }

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'nama' => $user->name,
                'role' => $user->role,
                'divisi' => $user->divisi,
                'assignedBooth' => $user->assigned_booth,
                'kontak' => $user->kontak,
                'status' => $user->status,
                'avatarBg' => $user->avatar_bg,
            ],
        ]);
    }
}
