<?php
session_start();
header('Content-Type: application/json');
require '../config/database.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Akses ditolak. Anda harus login untuk mengakses sumber daya ini.']);
    exit;
}
?>