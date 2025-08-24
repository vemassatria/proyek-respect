<?php
require '../admin/auth.php';
require '../config/database.php';
header('Content-Type: application/json');

// Ambil semua pendaftaran gratis yang menunggu validasi
$sql = "SELECT r.id, r.registration_date, u.nama as user_name, c.nama_lomba 
        FROM registrations r
        JOIN users u ON r.user_id = u.id
        JOIN competitions c ON r.competition_id = c.id
        WHERE r.payment_status = 'Menunggu Validasi' AND r.transaction_code LIKE 'FREE-%'
        ORDER BY r.registration_date ASC";

$result = $conn->query($sql);
$registrations = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        // Untuk setiap pendaftaran, ambil bukti-buktinya
        $proofs = [];
        $stmt_proof = $conn->prepare("SELECT requirement_type, proof_path FROM free_registration_proofs WHERE registration_id = ?");
        $stmt_proof->bind_param("i", $row['id']);
        $stmt_proof->execute();
        $result_proof = $stmt_proof->get_result();
        while ($proof_row = $result_proof->fetch_assoc()) {
            $proofs[] = $proof_row;
        }
        $stmt_proof->close();
        
        $row['proofs'] = $proofs;
        $registrations[] = $row;
    }
}

echo json_encode(['status' => 'success', 'data' => $registrations]);
$conn->close();
?>