<?php
require 'init.php'; // Memanggil session, koneksi, dan cek login

$user_id = $_SESSION['user_id'];
$history = [];

// Query untuk mengambil data pendaftaran yang statusnya sudah 'Paid' atau 'Valid'
// Ini dianggap sebagai history kejuaraan yang sudah diikuti.
$sql = "SELECT 
            r.id, 
            c.nama_lomba, 
            c.tanggal_mulai_daftar,
            r.registration_date
        FROM 
            registrations r 
        JOIN 
            competitions c ON r.competition_id = c.id 
        WHERE 
            r.user_id = ? AND (r.payment_status = 'paid' OR r.payment_status = 'Menunggu Validasi')
        ORDER BY 
            r.registration_date DESC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $history[] = $row;
    }
    echo json_encode(['status' => 'success', 'data' => $history]);
} else {
    // Kirim pesan 'not_found' jika tidak ada history
    echo json_encode(['status' => 'not_found', 'message' => 'Anda belum memiliki riwayat kejuaraan.']);
}

$stmt->close();
$conn->close();
?>