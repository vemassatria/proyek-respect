<?php
require '../admin/auth.php'; // Proteksi admin
require '../config/database.php';
header('Content-Type: application/json');

$stats = [
    'total_users' => 0,
    'total_competitions' => 0,
    'pending_transactions' => 0,
    'total_revenue' => 0
];

// 1. Hitung Total Pengguna
$result = $conn->query("SELECT COUNT(id) as total FROM users WHERE role = 'user'");
if ($result) {
    $stats['total_users'] = $result->fetch_assoc()['total'];
}

// 2. Hitung Total Lomba
$result = $conn->query("SELECT COUNT(id) as total FROM competitions");
if ($result) {
    $stats['total_competitions'] = $result->fetch_assoc()['total'];
}

// 3. Hitung Transaksi Pending
$result = $conn->query("SELECT COUNT(id) as total FROM registrations WHERE payment_status = 'pending_payment' OR payment_status = 'Menunggu Validasi'");
if ($result) {
    $stats['pending_transactions'] = $result->fetch_assoc()['total'];
}

// 4. Hitung Total Pendapatan (hanya dari yang sudah 'paid')
$result = $conn->query("SELECT SUM(amount) as total FROM registrations WHERE payment_status = 'paid'");
if ($result) {
    // Pastikan tidak null jika belum ada pendapatan
    $stats['total_revenue'] = $result->fetch_assoc()['total'] ?? 0;
}

echo json_encode(['status' => 'success', 'data' => $stats]);

$conn->close();
?>