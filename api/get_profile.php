<?php
require 'init.php'; // Mengambil session, koneksi, dan cek login

$user_id = $_SESSION['user_id'];

// Ambil semua data pengguna yang relevan
$stmt = $conn->prepare("SELECT nama, email, tingkatan, institusi, cv_path, portfolio_path, ktm_path, profile_picture_path FROM users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user_data = $result->fetch_assoc();
    echo json_encode(['status' => 'success', 'data' => $user_data]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Gagal mengambil data profil.']);
}

$stmt->close();
$conn->close();
?>