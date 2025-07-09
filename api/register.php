<?php
// Mengatur header agar output berupa JSON.
header('Content-Type: application/json');

// Memanggil file koneksi database.
require '../config/database.php';

// Cek jika metode request adalah POST.
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Mengambil data dari body request.
    $nama = $_POST['nama'];
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Validasi dasar: Cek jika ada field yang kosong.
    if (empty($nama) || empty($email) || empty($password)) {
        // Jika ada yang kosong, kirim respon error.
        echo json_encode(['status' => 'error', 'message' => 'Semua field harus diisi.']);
        exit; // Hentikan eksekusi skrip.
    }

    // --- KEAMANAN: Enkripsi Password ---
    // JANGAN PERNAH menyimpan password dalam bentuk teks biasa.
    // Gunakan password_hash() untuk membuat hash yang aman.
    $hashed_password = password_hash($password, PASSWORD_BCRYPT);

    // --- MENYIAPKAN STATEMENT SQL (Mencegah SQL Injection) ---
    // Buat template query untuk memasukkan data.
    $stmt = $conn->prepare("INSERT INTO users (nama, email, password) VALUES (?, ?, ?)");

    // Ikat variabel ke template query. 'sss' berarti ketiga variabel adalah string.
    $stmt->bind_param("sss", $nama, $email, $hashed_password);

    // Eksekusi query.
    if ($stmt->execute()) {
        // Jika berhasil, kirim respon sukses.
        echo json_encode(['status' => 'success', 'message' => 'Registrasi berhasil!']);
    } else {
        // Jika gagal, kirim respon error.
        echo json_encode(['status' => 'error', 'message' => 'Registrasi gagal: ' . $stmt->error]);
    }

    // Tutup statement dan koneksi.
    $stmt->close();
    $conn->close();

} else {
    // Jika metode request bukan POST, kirim pesan error.
    echo json_encode(['status' => 'error', 'message' => 'Metode request tidak valid.']);
}
?>