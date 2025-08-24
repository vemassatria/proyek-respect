<?php
require '../admin/auth.php'; // Proteksi admin
require '../config/database.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$userIdToUpdate = $data['user_id'] ?? null;
$newRole = $data['new_role'] ?? null;
$currentAdminId = $_SESSION['user_id'];

// Validasi input
if (empty($userIdToUpdate) || !in_array($newRole, ['user', 'admin'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Data tidak valid.']);
    exit;
}

// --- Lapisan Keamanan Kritis ---
// Cek apakah admin mencoba mengubah rolenya sendiri menjadi 'user'
if ($userIdToUpdate == $currentAdminId && $newRole === 'user') {
    // Hitung jumlah total admin
    $stmt = $conn->prepare("SELECT COUNT(*) as admin_count FROM users WHERE role = 'admin'");
    $stmt->execute();
    $result = $stmt->get_result();
    $adminCount = $result->fetch_assoc()['admin_count'];
    $stmt->close();

    // Jika hanya ada satu admin, tolak perubahan
    if ($adminCount <= 1) {
        http_response_code(403); // Forbidden
        echo json_encode(['status' => 'error', 'message' => 'Tidak dapat mengubah role. Anda adalah satu-satunya admin yang tersisa.']);
        exit;
    }
}

// Lanjutkan dengan pembaruan
$sql = "UPDATE users SET role = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $newRole, $userIdToUpdate);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Role pengguna berhasil diperbarui.']);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Gagal memperbarui role di database.']);
}

$stmt->close();
$conn->close();
?>