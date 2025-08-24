<?php
require '../admin/auth.php';
require '../config/database.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

$title = trim($_POST['title'] ?? '');
$article_link = filter_var(trim($_POST['article_link'] ?? ''), FILTER_VALIDATE_URL);
$category = $_POST['category'] ?? '';
$is_featured = $_POST['is_featured'] ?? 0;

if (empty($title) || !$article_link || empty($category)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Semua field wajib diisi dengan format yang benar.']);
    exit;
}

$image_name = '';
if (isset($_FILES['image_url']) && $_FILES['image_url']['error'] === UPLOAD_ERR_OK) {
    $file = $_FILES['image_url'];
    $target_dir = "../assets/images/";
    $image_name = 'news_' . time() . '.' . strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    move_uploaded_file($file['tmp_name'], $target_dir . $image_name);
} else {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Gambar berita wajib diupload.']);
    exit;
}

$sql = "INSERT INTO news_articles (title, article_link, category, is_featured, image_url) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssis", $title, $article_link, $category, $is_featured, $image_name);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Berita berhasil ditambahkan!']);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Gagal menyimpan ke database.']);
}
$stmt->close();
$conn->close();
?>