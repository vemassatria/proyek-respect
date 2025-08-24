<?php
require '../admin/auth.php';
require '../config/database.php';
header('Content-Type: application/json');

// (Sama seperti update competition, kode ini menangani pembaruan data dan file)
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

$id = $_POST['news_id'] ?? null;
$title = trim($_POST['title'] ?? '');
// ... (validasi input lainnya) ...

// Ambil nama gambar lama
$stmt = $conn->prepare("SELECT image_url FROM news_articles WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$image_name = $stmt->get_result()->fetch_assoc()['image_url'];
$stmt->close();

// Jika ada gambar baru diupload
if (isset($_FILES['image_url']) && $_FILES['image_url']['error'] === UPLOAD_ERR_OK) {
    $file = $_FILES['image_url'];
    $target_dir = "../assets/images/";
    $new_image_name = 'news_' . time() . '.' . strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (move_uploaded_file($file['tmp_name'], $target_dir . $new_image_name)) {
        // Hapus gambar lama jika berhasil upload yang baru
        if ($image_name && file_exists($target_dir . $image_name)) {
            unlink($target_dir . $image_name);
        }
        $image_name = $new_image_name;
    }
}

$sql = "UPDATE news_articles SET title = ?, article_link = ?, category = ?, is_featured = ?, image_url = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssisi", $title, $_POST['article_link'], $_POST['category'], $_POST['is_featured'], $image_name, $id);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Berita berhasil diperbarui!']);
} else {
    http_response_code(500);
}
$stmt->close();
$conn->close();
?>