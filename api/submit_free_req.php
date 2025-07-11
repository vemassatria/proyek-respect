<?php
require 'init.php'; // Memanggil session, koneksi, dan cek login

$user_id = $_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Validasi data dasar
    if (!isset($_POST['competition_id']) || empty($_POST['competition_id']) || empty($_FILES)) {
        echo json_encode(['status' => 'error', 'message' => 'Data tidak lengkap. Pastikan semua file syarat telah diunggah.']);
        exit;
    }

    $competition_id = $_POST['competition_id'];
    $uploaded_files = $_FILES;
    $target_dir = "../uploads/documents/";

    // Proses setiap file yang diunggah
    foreach ($uploaded_files as $file_key => $file) {
        $file_extension = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));
        $new_file_name = "free_req_" . $user_id . "_" . $file_key . "_" . time() . "." . $file_extension;
        $target_file = $target_dir . $new_file_name;

        // Pindahkan file ke folder tujuan
        if (!move_uploaded_file($file["tmp_name"], $target_file)) {
            echo json_encode(['status' => 'error', 'message' => 'Gagal mengunggah salah satu file syarat.']);
            exit;
        }
    }

    // Jika semua file berhasil diunggah, catat transaksi
    $transaction_code = "FREE-" . strtoupper(uniqid());
    $amount = 0.00; // Biaya untuk pendaftaran gratis adalah 0
    $payment_status = "Menunggu Validasi"; // Status khusus untuk pendaftaran gratis
    $item_summary = "Pendaftaran Gratis";

    $stmt_insert = $conn->prepare("INSERT INTO registrations (user_id, competition_id, amount, transaction_code, payment_status) VALUES (?, ?, ?, ?, ?)");
    $stmt_insert->bind_param("iidsi", $user_id, $competition_id, $amount, $transaction_code, $payment_status);
    
    if ($stmt_insert->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Pendaftaran gratis berhasil! Tim kami akan segera memvalidasi persyaratan Anda.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Gagal menyimpan data pendaftaran.']);
    }

    $stmt_insert->close();
    $conn->close();

} else {
    echo json_encode(['status' => 'error', 'message' => 'Metode request tidak valid.']);
}
?>