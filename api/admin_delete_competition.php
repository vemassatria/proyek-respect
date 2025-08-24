<?php
// Panggil auth.php untuk memastikan hanya admin yang bisa mengakses
require '../admin/auth.php';
require '../config/database.php';

header('Content-Type: application/json');

// Pastikan metode request adalah POST untuk keamanan
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Metode request tidak valid.']);
    exit;
}

// Ambil ID dari body request
$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? null;

if (empty($id)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'ID Lomba tidak disertakan.']);
    exit;
}

$conn->begin_transaction();

try {
    // 1. Ambil nama file banner sebelum menghapus data
    $stmt = $conn->prepare("SELECT banner_img FROM competitions WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $competition = $result->fetch_assoc();
    $banner_img_name = $competition['banner_img'] ?? null;
    $stmt->close();

    // 2. Hapus data lomba dari database
    $stmt = $conn->prepare("DELETE FROM competitions WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();

    // Periksa apakah ada baris yang terhapus
    if ($stmt->affected_rows === 0) {
        throw new Exception('Lomba dengan ID tersebut tidak ditemukan.');
    }
    $stmt->close();

    // 3. Jika data berhasil dihapus dari DB, hapus file banner dari server
    if ($banner_img_name) {
        $file_path = '../assets/images/' . $banner_img_name;
        if (file_exists($file_path)) {
            unlink($file_path);
        }
    }

    // Jika semua berhasil, commit transaksi
    $conn->commit();
    echo json_encode(['status' => 'success', 'message' => 'Lomba berhasil dihapus.']);

} catch (Exception $e) {
    // Jika ada kesalahan, rollback transaksi
    $conn->rollback();
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Gagal menghapus lomba: ' . $e->getMessage()]);
}

$conn->close();
?>