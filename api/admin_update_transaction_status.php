<?php
require '../admin/auth.php';
require '../config/database.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? null;
$status = $data['status'] ?? null;

if (empty($id) || !in_array($status, ['paid', 'rejected'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Data tidak valid.']);
    exit;
}

$sql = "UPDATE registrations SET payment_status = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $status, $id);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Status transaksi berhasil diperbarui.']);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Gagal memperbarui status.']);
}

$stmt->close();
$conn->close();
?>