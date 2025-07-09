<?php
header('Content-Type: application/json');
require '../config/database.php';

// Cek jika metode request adalah POST.
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Ambil data yang dikirim dari frontend
    // Untuk saat ini, user_id kita anggap sudah didapat setelah user login
    $user_id = $_POST['user_id']; 
    $competition_id = $_POST['competition_id'];

    // Validasi dasar
    if (empty($user_id) || empty($competition_id)) {
        echo json_encode(['status' => 'error', 'message' => 'User ID dan Competition ID harus diisi.']);
        exit;
    }

    // Cek apakah user sudah pernah mendaftar di kompetisi yang sama
    $check_stmt = $conn->prepare("SELECT id FROM registrations WHERE user_id = ? AND competition_id = ?");
    $check_stmt->bind_param("ii", $user_id, $competition_id);
    $check_stmt->execute();
    $check_result = $check_stmt->get_result();

    if ($check_result->num_rows > 0) {
        // Jika sudah terdaftar, kirim pesan error
        echo json_encode(['status' => 'error', 'message' => 'Anda sudah terdaftar di kompetisi ini.']);
    } else {
        // Jika belum terdaftar, lanjutkan proses pendaftaran
        $stmt = $conn->prepare("INSERT INTO registrations (user_id, competition_id) VALUES (?, ?)");
        $stmt->bind_param("ii", $user_id, $competition_id);

        if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Pendaftaran kompetisi berhasil! Silakan lanjutkan ke pembayaran.']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Pendaftaran gagal: ' . $stmt->error]);
        }
        $stmt->close();
    }
    
    $check_stmt->close();
    $conn->close();

} else {
    echo json_encode(['status' => 'error', 'message' => 'Metode request tidak valid.']);
}
?>