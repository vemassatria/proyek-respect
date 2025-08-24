<?php
require '../admin/auth.php';
require '../config/database.php';
header('Content-Type: application/json');

// (Pola yang sama seperti delete competition, hapus data dari DB dan hapus file gambar)
$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? null;
if (!$id) {
    http_response_code(400);
    exit;
}

$conn->begin_transaction();
try {
    $stmt = $conn->prepare("SELECT image_url FROM news_articles WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $image_name = $stmt->get_result()->fetch_assoc()['image_url'];
    $stmt->close();

    $stmt = $conn->prepare("DELETE FROM news_articles WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();

    if ($stmt->affected_rows > 0 && $image_name && file_exists('../assets/images/' . $image_name)) {
        unlink('../assets/images/' . $image_name);
    }
    $conn->commit();
    echo json_encode(['status' => 'success', 'message' => 'Berita berhasil dihapus.']);
} catch (Exception $e) {
    $conn->rollback();
    http_response_code(500);
}
$conn->close();
?>