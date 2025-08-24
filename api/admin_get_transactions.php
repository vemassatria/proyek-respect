<?php
require '../admin/auth.php'; // Proteksi admin
require '../config/database.php';
header('Content-Type: application/json');

$sql = "SELECT 
            r.id, 
            r.transaction_code, 
            r.amount, 
            r.payment_status, 
            r.proof_path,
            u.nama as user_name,
            c.nama_lomba as competition_name
        FROM 
            registrations r
        JOIN 
            users u ON r.user_id = u.id
        JOIN 
            competitions c ON r.competition_id = c.id
        ORDER BY 
            r.registration_date DESC";

$result = $conn->query($sql);
$transactions = [];
if ($result) {
    while($row = $result->fetch_assoc()) {
        $transactions[] = $row;
    }
}

echo json_encode(['status' => 'success', 'data' => $transactions]);
$conn->close();
?>