<?php
// Panggil file init.php. File ini sudah otomatis memulai session,
// menghubungkan database, dan memeriksa apakah user sudah login.
require 'init.php';


$user_id = $_SESSION['user_id'];

// Menyiapkan array untuk menampung data transaksi.
$transactions = [];

// Membuat query SQL untuk mengambil data dari tabel registrations
// dan menggabungkannya (JOIN) dengan data dari tabel competitions
// untuk mendapatkan nama lomba.
$sql = "SELECT 
            r.id, 
            r.transaction_code, 
            c.nama_lomba, 
            r.amount, 
            r.payment_status, 
            r.registration_date 
        FROM 
            registrations r 
        JOIN 
            competitions c ON r.competition_id = c.id 
        WHERE 
            r.user_id = ? 
        ORDER BY 
            r.registration_date DESC";

// Menyiapkan statement untuk keamanan
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $transactions[] = $row;
    }
    echo json_encode(['status' => 'success', 'data' => $transactions]);
} else {
    echo json_encode(['status' => 'not_found', 'message' => 'Anda belum memiliki transaksi.']);
}

$stmt->close();
$conn->close();
?>