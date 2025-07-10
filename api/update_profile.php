<?php
// Memanggil file init.php untuk memulai session, koneksi DB, dan cek login.
require 'init.php';

// Ambil user_id dari session yang sudah terverifikasi.
$user_id = $_SESSION['user_id'];

// Pastikan metode request adalah POST.
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Ambil data yang dikirim dari frontend.
    $tingkatan = $_POST['tingkatan'];
    $institusi = $_POST['institusi'];

    // Validasi dasar: Pastikan data tidak kosong.
    if (empty($tingkatan) || empty($institusi)) {
        echo json_encode(['status' => 'error', 'message' => 'Tingkatan dan Institusi harus diisi.']);
        exit;
    }

    // Validasi tambahan: Pastikan tingkatan adalah 'Siswa' atau 'Mahasiswa'.
    if (!in_array($tingkatan, ['Siswa', 'Mahasiswa'])) {
        echo json_encode(['status' => 'error', 'message' => 'Tingkatan tidak valid.']);
        exit;
    }

    // --- MENYIAPKAN STATEMENT SQL UPDATE (Aman dari SQL Injection) ---
    // Buat template query untuk mengupdate data di tabel users.
    $stmt = $conn->prepare("UPDATE users SET tingkatan = ?, institusi = ? WHERE id = ?");

    // Ikat variabel ke template query. 'ssi' berarti string, string, integer.
    $stmt->bind_param("ssi", $tingkatan, $institusi, $user_id);

    // Eksekusi query.
    if ($stmt->execute()) {
        // Jika berhasil, kirim respon sukses.
        echo json_encode(['status' => 'success', 'message' => 'Profil berhasil diperbarui!']);
    } else {
        // Jika gagal, kirim respon error.
        echo json_encode(['status' => 'error', 'message' => 'Gagal memperbarui profil: ' . $stmt->error]);
    }

    // Tutup statement dan koneksi.
    $stmt->close();
    $conn->close();

} else {
    // Jika metode request bukan POST.
    echo json_encode(['status' => 'error', 'message' => 'Metode request tidak valid.']);
}
?>