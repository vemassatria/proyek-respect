<?php
// Memanggil file init.php untuk session, koneksi, dan cek login.
require 'init.php';

// Ambil user_id dari session.
$user_id = $_SESSION['user_id'];

// Cek jika metode request adalah POST.
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Validasi input: pastikan jenis dokumen dan file dikirim.
    if (!isset($_POST['document_type']) || !isset($_FILES['document_file'])) {
        echo json_encode(['status' => 'error', 'message' => 'Jenis dokumen dan file harus disertakan.']);
        exit;
    }

    $document_type = $_POST['document_type']; // misal: 'cv', 'ktm'
    $file = $_FILES['document_file'];

    // Pengaturan Upload
    $target_dir = "../uploads/documents/";
    $file_extension = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));
    // Buat nama file unik: tipe_userid_waktu.ekstensi
    $new_file_name = $document_type . "_" . $user_id . "_" . time() . "." . $file_extension;
    $target_file = $target_dir . $new_file_name;

    // Validasi File (izinkan PDF juga)
    if ($file["size"] > 5000000) { // Maks 5MB
        echo json_encode(['status' => 'error', 'message' => 'Ukuran file terlalu besar. Maksimal 5MB.']);
        exit;
    }
    $allowed_extensions = array("jpg", "png", "jpeg", "pdf");
    if (!in_array($file_extension, $allowed_extensions)) {
        echo json_encode(['status' => 'error', 'message' => 'Format file tidak diizinkan. Hanya JPG, PNG, & PDF.']);
        exit;
    }

    // Proses Upload
    if (move_uploaded_file($file["tmp_name"], $target_file)) {
        // Jika berhasil, update path file di tabel users.
        // Kita butuh kolom baru untuk ini. Untuk sekarang, kita lewati dulu.
        // Contoh: UPDATE users SET cv_path = ? WHERE id = ?
        
        echo json_encode(['status' => 'success', 'message' => 'Dokumen berhasil diunggah!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Gagal mengunggah dokumen.']);
    }
    
    $conn->close();

} else {
    echo json_encode(['status' => 'error', 'message' => 'Metode request tidak valid.']);
}
?>