<?php

namespace App\Helpers;

class DeviceDetector
{
    public static function detect(?string $userAgent): string
    {
        if (empty($userAgent)) {
            return 'Desktop';
        }

        if (preg_match('/Android/i', $userAgent)) {
            return 'Mobile (Android)';
        }

        if (preg_match('/iPhone|iPad|iPod/i', $userAgent)) {
            return 'Mobile (iOS)';
        }

        if (preg_match('/Macintosh|Mac OS X/i', $userAgent)) {
            return 'Desktop (macOS)';
        }

        if (preg_match('/Windows/i', $userAgent)) {
            return 'Desktop (Windows)';
        }

        if (preg_match('/Linux/i', $userAgent)) {
            return 'Desktop (Linux)';
        }

        return 'Desktop (Other)';
    }
}
