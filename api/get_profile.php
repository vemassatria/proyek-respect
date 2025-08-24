<?php
// Memanggil init.php untuk memulai session & koneksi
require_once 'init.php';

// Atur header JSON, spesifik untuk file ini
header('Content-Type: application/json');

// Gunakan try...catch untuk menangani SEMUA kemungkinan error
try {
    // 1. Cek Koneksi Database
    if (!isset($conn) || $conn->connect_error) {
        throw new Exception('Koneksi database gagal: ' . ($conn->connect_error ?? 'Objek koneksi tidak tersedia.'));
    }

    // 2. Cek Session Pengguna
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401); // Unauthorized
        throw new Exception('Sesi pengguna tidak ditemukan. Silakan login kembali.');
    }
    $user_id = $_SESSION['user_id'];

    // 3. Eksekusi Query dengan NAMA KOLOM YANG SUDAH DIPERBAIKI
    $stmt = $conn->prepare("SELECT nama, email, tingkatan, institusi, cv_path, portofolio_path, ktm_path, profile_picture_path FROM users WHERE id = ?");
    
    if ($stmt === false) {
        throw new Exception('Gagal menyiapkan query: ' . $conn->error);
    }

    $stmt->bind_param("i", $user_id);
    
    if (!$stmt->execute()) {
        throw new Exception('Gagal mengesekusi query: ' . $stmt->error);
    }
    
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user_data = $result->fetch_assoc();
        echo json_encode(['status' => 'success', 'data' => $user_data]);
    } else {
        http_response_code(404); // Not Found
        echo json_encode(['status' => 'error', 'message' => 'Data profil untuk pengguna ini tidak ditemukan.']);
    }

    $stmt->close();
    $conn->close();

} catch (Throwable $e) {
    if (http_response_code() < 400) {
        http_response_code(500); // Internal Server Error
    }
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>