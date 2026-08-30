<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Midtrans Configuration
    |--------------------------------------------------------------------------
    | Standar Keamanan: Kunci Server disimpan secara ketat di .env
    | Mode Sandbox: is_production = false (untuk pengujian transaksi)
    |--------------------------------------------------------------------------
    */
    'server_key' => env('MIDTRANS_SERVER_KEY', 'SB-Mid-server-YOUR-SERVER-KEY-HERE'),
    'client_key' => env('MIDTRANS_CLIENT_KEY', 'SB-Mid-client-YOUR-CLIENT-KEY-HERE'),
    'is_production' => env('MIDTRANS_IS_PRODUCTION', false),
    'is_sanitized' => env('MIDTRANS_IS_SANITIZED', true),
    'is_3ds' => env('MIDTRANS_IS_3DS', true),
];
