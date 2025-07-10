<?php
header('Content-Type: application/json');
require '../config/database.php';

// Validasi input untuk memastikan ID kompetisi utama dikirim.
if (!isset($_GET['id']) || empty($_GET['id'])) {
    echo json_encode(['status' => 'error', 'message' => 'ID kompetisi tidak ditemukan.']);
    exit;
}

$competition_id = intval($_GET['id']);
$response_data = null; // Variabel untuk menampung hasil akhir

// --- 1. Mengambil Data Utama Kompetisi ---
$stmt_main = $conn->prepare("SELECT id, nama_lomba, deskripsi, tanggal_mulai_daftar, tanggal_akhir_daftar, biaya, banner_img FROM competitions WHERE id = ?");
$stmt_main->bind_param("i", $competition_id);
$stmt_main->execute();
$result_main = $stmt_main->get_result();

if ($result_main->num_rows === 1) {
    // Jika data utama ditemukan, simpan ke variabel.
    $response_data = $result_main->fetch_assoc();
    
    // --- 2. Mengambil Detail-Detail Lomba ---
    // Siapkan array kosong untuk menampung detailnya.
    $response_data['details'] = []; 
    
    $stmt_details = $conn->prepare("SELECT detail_title, detail_content FROM competition_details WHERE competition_id = ? ORDER BY id ASC");
    $stmt_details->bind_param("i", $competition_id);
    $stmt_details->execute();
    $result_details = $stmt_details->get_result();
    
    if ($result_details->num_rows > 0) {
        // Jika ada detail, masukkan semuanya ke dalam array 'details'.
        while($row = $result_details->fetch_assoc()) {
            $response_data['details'][] = $row;
        }
    }
    $stmt_details->close();
    
    // Kirim respon sukses dengan data yang sudah digabung.
    echo json_encode(['status' => 'success', 'data' => $response_data]);

} else {
    // Jika data utama dengan ID tersebut tidak ditemukan.
    echo json_encode(['status' => 'error', 'message' => 'Kompetisi tidak ditemukan.']);
}

$stmt_main->close();
$conn->close();
?>