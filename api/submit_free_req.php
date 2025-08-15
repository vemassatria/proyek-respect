<?php
require 'init.php'; // Mengambil session, koneksi, dan cek login

$user_id = $_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (!isset($_POST['competition_id']) || empty($_POST['competition_id']) || empty($_FILES)) {
        echo json_encode(['status' => 'error', 'message' => 'Data tidak lengkap.']);
        exit;
    }

    $competition_id = $_POST['competition_id'];

    // Pertama, buat catatan pendaftaran utama untuk mendapatkan ID-nya
    $transaction_code = "FREE-" . strtoupper(uniqid());
    $amount = 0.00;
    $payment_status = "Menunggu Validasi";

    $stmt_reg = $conn->prepare("INSERT INTO registrations (user_id, competition_id, amount, transaction_code, payment_status) VALUES (?, ?, ?, ?, ?)");
    $stmt_reg->bind_param("iidss", $user_id, $competition_id, $amount, $transaction_code, $payment_status);
    
    if ($stmt_reg->execute()) {
        // Jika berhasil, dapatkan ID pendaftaran yang baru saja dibuat
        $registration_id = $stmt_reg->insert_id;
        $stmt_reg->close();

        // Kedua, proses dan simpan setiap file yang diunggah
        $uploaded_files = $_FILES;
        $target_dir = "../uploads/documents/";

        foreach ($uploaded_files as $file_key => $file) {
            $file_extension = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));
            $new_file_name = "free_req_" . $user_id . "_" . $file_key . "_" . time() . "." . $file_extension;
            $target_file = $target_dir . $new_file_name;

            if (move_uploaded_file($file["tmp_name"], $target_file)) {
                // Jika upload file berhasil, simpan path-nya ke tabel proofs
                $stmt_proof = $conn->prepare("INSERT INTO free_registration_proofs (registration_id, requirement_type, proof_path) VALUES (?, ?, ?)");
                $stmt_proof->bind_param("iss", $registration_id, $file_key, $new_file_name);
                $stmt_proof->execute();
                $stmt_proof->close();
            }
        }
        
        echo json_encode(['status' => 'success', 'message' => 'Pendaftaran gratis berhasil! Tim kami akan segera memvalidasi persyaratan Anda.']);

    } else {
        echo json_encode(['status' => 'error', 'message' => 'Gagal menyimpan data pendaftaran.']);
    }

    $conn->close();
}
?>