<?php
// Mengatur header agar output berupa JSON dan bisa diakses dari mana saja.
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Diperlukan untuk pengujian dari file HTML lokal

// Memanggil file koneksi database.
require '../config/database.php';

// Menyiapkan array untuk menampung data kompetisi.
$competitions = [];

// Membuat query SQL untuk mengambil semua data dari tabel competitions.
$sql = "SELECT id, nama_lomba, deskripsi, tanggal_mulai_daftar, tanggal_akhir_daftar, biaya, banner_img FROM competitions";

// Menjalankan query.
$result = $conn->query($sql);

// Memeriksa apakah query berhasil dan mengembalikan data.
if ($result && $result->num_rows > 0) {
    // Jika ada data, lakukan perulangan untuk setiap baris.
    while($row = $result->fetch_assoc()) {
        // Masukkan setiap baris data (sebagai array) ke dalam array $competitions.
        $competitions[] = $row;
    }
    // Kirim data kompetisi sebagai respon sukses.
    echo json_encode(['status' => 'success', 'data' => $competitions]);
} else {
    // Jika tidak ada data atau query gagal, kirim respon 'not_found'.
    echo json_encode(['status' => 'not_found', 'message' => 'Tidak ada kompetisi yang ditemukan.']);
}

// Tutup koneksi ke database.
$conn->close();
?>