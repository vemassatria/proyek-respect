<?php
header('Content-Type: application/json');
require '../config/database.php';

$competitions = [];
$sql = "SELECT id, nama_lomba, deskripsi, tanggal_mulai_daftar, tanggal_akhir_daftar, biaya, banner_img FROM competitions";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $competitions[] = $row;
    }
    echo json_encode(['status' => 'success', 'data' => $competitions]);
} else {
    echo json_encode(['status' => 'not_found', 'message' => 'Tidak ada kompetisi yang ditemukan.']);
}
$conn->close();
?>