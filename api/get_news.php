<?php
header('Content-Type: application/json');
require '../config/database.php';

// Siapkan array hasil dengan dua kunci
$response = [
    'featured_news' => [],
    'organizational_articles' => []
];

// Query untuk mengambil semua berita, diurutkan berdasarkan tanggal terbaru
$sql = "SELECT id, title, image_url, article_link, category, is_featured FROM news_articles ORDER BY created_at DESC";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        // Pisahkan data berdasarkan nilai di kolom 'category'
        if ($row['category'] === 'Berita Terkini' && $row['is_featured'] == 1) {
            $response['featured_news'][] = $row;
        } else if ($row['category'] === 'Artikel Organisasi') {
            $response['organizational_articles'][] = $row;
        }
    }
}

echo json_encode(['status' => 'success', 'data' => $response]);
$conn->close();
?>