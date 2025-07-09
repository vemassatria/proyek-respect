<?php
header('Content-Type: application/json');
require '../config/database.php';

// Cek jika metode request adalah POST.
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // --- VALIDASI INPUT ---
    // Memastikan ID transaksi dan file telah dikirim.
    if (!isset($_POST['transaction_id']) || !isset($_FILES['proof_file'])) {
        echo json_encode(['status' => 'error', 'message' => 'ID Transaksi dan file bukti harus disertakan.']);
        exit;
    }

    $transaction_id = $_POST['transaction_id'];
    $file = $_FILES['proof_file'];

    // --- PENGATURAN UPLOAD ---
    $target_dir = "../uploads/proofs/"; // Direktori tujuan penyimpanan file.
    $file_extension = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));
    // Buat nama file baru yang unik untuk mencegah tumpang tindih file.
    $new_file_name = "proof_" . $transaction_id . "_" . time() . "." . $file_extension;
    $target_file = $target_dir . $new_file_name;

    // --- VALIDASI FILE ---
    // 1. Cek ukuran file (misal: maks 2MB)
    if ($file["size"] > 2000000) {
        echo json_encode(['status' => 'error', 'message' => 'Ukuran file terlalu besar. Maksimal 2MB.']);
        exit;
    }

    // 2. Izinkan hanya format file tertentu (JPG, PNG, JPEG)
    $allowed_extensions = array("jpg", "png", "jpeg");
    if (!in_array($file_extension, $allowed_extensions)) {
        echo json_encode(['status' => 'error', 'message' => 'Format file tidak diizinkan. Hanya JPG, JPEG, & PNG.']);
        exit;
    }

    // --- PROSES UPLOAD ---
    // Pindahkan file dari lokasi sementara ke direktori tujuan.
    if (move_uploaded_file($file["tmp_name"], $target_file)) {
        // Jika upload berhasil, kita bisa update nama file ke database.
        // (Untuk saat ini kita belum melakukannya, fokus pada upload dulu).
        // Contoh: $stmt = $conn->prepare("UPDATE transactions SET proof_path = ? WHERE id = ?");

        echo json_encode(['status' => 'success', 'message' => 'Upload bukti pembayaran berhasil!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Terjadi kesalahan saat mengupload file.']);
    }
    
    $conn->close();

} else {
    echo json_encode(['status' => 'error', 'message' => 'Metode request tidak valid.']);
}
?>