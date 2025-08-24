<?php
// API ini tidak perlu proteksi admin karena hanya membaca data.
require '../config/database.php';

header('Content-Type: application/json');

$id = $_GET['id'] ?? null;

if (empty($id)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'ID Lomba tidak disertakan.']);
    exit;
}

$stmt = $conn->prepare("SELECT id, nama_lomba, deskripsi, tanggal_mulai_daftar, tanggal_akhir_daftar, biaya, banner_img FROM competitions WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
$competition = $result->fetch_assoc();

if ($competition) {
    echo json_encode(['status' => 'success', 'data' => $competition]);
} else {
    http_response_code(404); // Not Found
    echo json_encode(['status' => 'error', 'message' => 'Lomba tidak ditemukan.']);
}

$stmt->close();
$conn->close();
?>