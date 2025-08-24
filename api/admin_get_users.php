<?php
require '../admin/auth.php'; // Proteksi admin adalah WAJIB untuk data pengguna
require '../config/database.php';
header('Content-Type: application/json');

$sql = "SELECT id, nama, email, tingkatan, institusi, role FROM users ORDER BY id DESC";
$result = $conn->query($sql);
$users = [];

if ($result) {
    while($row = $result->fetch_assoc()) {
        // Sanitasi output untuk keamanan dasar
        foreach ($row as $key => $value) {
            $row[$key] = htmlspecialchars($value ?? '');
        }
        $users[] = $row;
    }
    echo json_encode(['status' => 'success', 'data' => $users]);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Gagal mengambil data pengguna.']);
}

$conn->close();
?>