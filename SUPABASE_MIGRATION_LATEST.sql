-- ==============================================================================
-- 🎨 ART SHOW CASE "HISTORY" - HOSTING / SUPABASE DATABASE UPDATE SCRIPT
-- Jalankan script SQL ini di Supabase SQL Editor atau phpMyAdmin hosting Anda
-- ==============================================================================

-- 1. Pastikan kolom-kolom penjualan & booking karya tersedia di tabel 'artworks'
ALTER TABLE artworks 
ADD COLUMN IF NOT EXISTS price BIGINT DEFAULT 150000,
ADD COLUMN IF NOT EXISTS is_for_sale BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS sale_status VARCHAR(50) DEFAULT 'available',
ADD COLUMN IF NOT EXISTS buyer_name VARCHAR(150) NULL,
ADD COLUMN IF NOT EXISTS buyer_email VARCHAR(150) NULL,
ADD COLUMN IF NOT EXISTS buyer_phone VARCHAR(50) NULL,
ADD COLUMN IF NOT EXISTS current_order_id VARCHAR(100) NULL,
ADD COLUMN IF NOT EXISTS booked_until TIMESTAMP NULL;

-- 2. Buat tabel 'orders' untuk pencatatan transaksi & bukti transfer
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(100) PRIMARY KEY,
    artwork_id VARCHAR(100) NOT NULL,
    artwork_title VARCHAR(255) NOT NULL,
    buyer_name VARCHAR(150) NOT NULL,
    buyer_email VARCHAR(150) NOT NULL,
    buyer_phone VARCHAR(50) NOT NULL,
    pickup_notes TEXT NULL,
    gross_amount BIGINT NOT NULL,
    payment_type VARCHAR(100) DEFAULT 'QRIS DANA / Transfer Bank',
    payment_proof_url TEXT NULL,
    admin_notes TEXT NULL,
    verified_by_admin VARCHAR(150) NULL,
    verified_at TIMESTAMP NULL,
    rejection_reason TEXT NULL,
    transaction_status VARCHAR(50) DEFAULT 'pending_review',
    snap_token TEXT NULL,
    snap_redirect_url TEXT NULL,
    midtrans_transaction_id VARCHAR(100) NULL,
    settled_at TIMESTAMP NULL,
    expired_at TIMESTAMP NULL,
    is_picked_up BOOLEAN DEFAULT false,
    picked_up_at TIMESTAMP NULL,
    picked_up_by_admin VARCHAR(150) NULL,
    raw_response JSONB NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tambahkan Index untuk mempercepat pencarian & filter data
CREATE INDEX IF NOT EXISTS idx_orders_artwork_id ON orders(artwork_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(transaction_status);
CREATE INDEX IF NOT EXISTS idx_artworks_sale_status ON artworks(sale_status);

-- ==============================================================================
-- SELESAI! Database hosting / Supabase Anda kini 100% siap untuk transaksi pameran.
-- ==============================================================================
