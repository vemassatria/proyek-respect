<?php
// Mengatur header agar output berupa JSON dan bisa diakses dari mana saja.
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Memanggil file koneksi database.
require '../config/database.php';

// --- Validasi Input: Memastikan ID telah dikirim ---
// Kita akan mengambil ID dari URL (misal: ...?id=1)
if (!isset($_GET['id']) || empty($_GET['id'])) {
    // Jika tidak ada ID, kirim error dan hentikan skrip.
    echo json_encode(['status' => 'error', 'message' => 'ID kompetisi tidak ditemukan.']);
    exit;
}

// Ambil ID dari URL dan pastikan itu adalah angka.
$competition_id = intval($_GET['id']);

// --- MENYIAPKAN STATEMENT SQL (Mencegah SQL Injection) ---
// Buat template query untuk mengambil satu lomba berdasarkan ID-nya.
$stmt = $conn->prepare("SELECT id, nama_lomba, deskripsi, tanggal_mulai_daftar, tanggal_akhir_daftar, biaya, banner_img FROM competitions WHERE id = ?");

// Ikat variabel ID ke template query. 'i' berarti variabelnya adalah integer.
$stmt->bind_param("i", $competition_id);

// Eksekusi query.
$stmt->execute();
$result = $stmt->get_result(); // Ambil hasil query.

// Cek apakah data ditemukan.
if ($result->num_rows === 1) {
    // Jika data ditemukan, ambil data tersebut.
    $competition = $result->fetch_assoc();
    
    // Kirim data sebagai respon sukses.
    echo json_encode(['status' => 'success', 'data' => $competition]);
} else {
    // Jika tidak ada data dengan ID tersebut.
    echo json_encode(['status' => 'error', 'message' => 'Kompetisi dengan ID tersebut tidak ditemukan.']);
}

// Tutup statement dan koneksi.
$stmt->close();
$conn->close();

?>