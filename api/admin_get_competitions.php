<?php
require '../config/database.php';
// Kita tidak memerlukan session check di sini karena ini adalah API read-only,
// namun pada API CUD (Create, Update, Delete) nanti, session check akan sangat penting.

header('Content-Type: application/json');

$competitions = [];
$sql = "SELECT id, nama_lomba, tanggal_mulai_daftar, tanggal_akhir_daftar, biaya FROM competitions ORDER BY id DESC";
$result = $conn->query($sql);

if ($result) {
    while($row = $result->fetch_assoc()) {
        $competitions[] = $row;
    }
    echo json_encode(['status' => 'success', 'data' => $competitions]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Gagal mengambil data kompetisi.']);
}

$conn->close();
?>