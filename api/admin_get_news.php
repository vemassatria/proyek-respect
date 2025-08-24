<?php
require '../config/database.php';
header('Content-Type: application/json');

$news = [];
$sql = "SELECT id, title, category, created_at FROM news_articles ORDER BY id DESC";
$result = $conn->query($sql);

if ($result) {
    while($row = $result->fetch_assoc()) {
        $news[] = $row;
    }
    echo json_encode(['status' => 'success', 'data' => $news]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Gagal mengambil data berita.']);
}
$conn->close();
?>