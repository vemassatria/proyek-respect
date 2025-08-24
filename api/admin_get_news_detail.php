<?php
require '../config/database.php';
header('Content-Type: application/json');

$id = $_GET['id'] ?? null;
if (!$id) {
    http_response_code(400);
    exit;
}

$stmt = $conn->prepare("SELECT id, title, article_link, category, is_featured, image_url FROM news_articles WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
$news = $result->fetch_assoc();

if ($news) {
    echo json_encode(['status' => 'success', 'data' => $news]);
} else {
    http_response_code(404);
}
$stmt->close();
$conn->close();
?>