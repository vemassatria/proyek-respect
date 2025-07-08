<?php
// Mengatur header agar output berupa JSON.
header('Content-Type: application/json');

// Memanggil file koneksi database.
require '../config/database.php';

// Cek jika metode request adalah POST.
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Mengambil data dari body request.
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Validasi dasar: Cek jika ada field yang kosong.
    if (empty($email) || empty($password)) {
        echo json_encode(['status' => 'error', 'message' => 'Email dan password harus diisi.']);
        exit;
    }

    // --- MENYIAPKAN STATEMENT SQL UNTUK MENCARI PENGGUNA ---
    // Buat template query untuk mengambil data user berdasarkan email.
    $stmt = $conn->prepare("SELECT id, nama, password FROM users WHERE email = ?");
    $stmt->bind_param("s", $email); // Ikat variabel email ke template.
    $stmt->execute();
    $result = $stmt->get_result(); // Ambil hasil query.

    // Cek apakah pengguna dengan email tersebut ditemukan.
    if ($result->num_rows === 1) {
        // Jika pengguna ditemukan, ambil datanya.
        $user = $result->fetch_assoc();
        
        // --- KEAMANAN: Verifikasi Password ---
        // Bandingkan password yang diinput pengguna dengan hash password di database.
        // Gunakan password_verify() untuk melakukan ini.
        if (password_verify($password, $user['password'])) {
            // Jika password cocok, kirim respon sukses beserta data pengguna.
            echo json_encode([
                'status' => 'success', 
                'message' => 'Login berhasil!',
                'data' => [
                    'id' => $user['id'],
                    'nama' => $user['nama']
                ]
            ]);
        } else {
            // Jika password tidak cocok, kirim respon error.
            echo json_encode(['status' => 'error', 'message' => 'Password salah.']);
        }
    } else {
        // Jika pengguna dengan email tersebut tidak ditemukan.
        echo json_encode(['status' => 'error', 'message' => 'Email tidak terdaftar.']);
    }

    // Tutup statement dan koneksi.
    $stmt->close();
    $conn->close();

} else {
    // Jika metode request bukan POST.
    echo json_encode(['status' => 'error', 'message' => 'Metode request tidak valid.']);
}
?>