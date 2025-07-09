<?php
// Selalu mulai session di baris paling pertama.
session_start();

// Mengatur header agar output berupa JSON.
header('Content-Type: application/json');

// Memanggil file koneksi database.
require '../config/database.php';

// Cek apakah pengguna sudah login dengan memeriksa session.
if (!isset($_SESSION['user_id'])) {
    // Jika tidak ada user_id di session, kirim pesan error dan hentikan eksekusi.
    echo json_encode(['status' => 'error', 'message' => 'Akses ditolak. Anda harus login untuk mengakses sumber daya ini.']);
    exit; // Wajib ada untuk menghentikan skrip.
}
?>