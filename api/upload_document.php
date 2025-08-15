<?php
require 'init.php'; // Mengambil session, koneksi, dan cek login

$user_id = $_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (!isset($_POST['document_type']) || !isset($_FILES['document_file'])) {
        echo json_encode(['status' => 'error', 'message' => 'Data tidak lengkap.']);
        exit;
    }

    $document_type = $_POST['document_type']; // cv, portfolio, ktm
    $file = $_FILES['document_file'];
    
    // Tentukan kolom database berdasarkan tipe dokumen
    $column_name = $document_type . '_path';
    $allowed_columns = ['cv_path', 'portfolio_path', 'ktm_path'];
    if (!in_array($column_name, $allowed_columns)) {
        echo json_encode(['status' => 'error', 'message' => 'Tipe dokumen tidak valid.']);
        exit;
    }

    // Pengaturan dan Validasi Upload (tidak berubah)
    $target_dir = "../uploads/documents/";
    $file_extension = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));
    $new_file_name = $document_type . "_" . $user_id . "_" . time() . "." . $file_extension;
    $target_file = $target_dir . $new_file_name;

    if ($file["size"] > 5000000) { /* ... validasi ukuran ... */ exit; }
    $allowed_extensions = array("jpg", "png", "jpeg", "pdf");
    if (!in_array($file_extension, $allowed_extensions)) { /* ... validasi ekstensi ... */ exit; }

    // Proses Upload
    if (move_uploaded_file($file["tmp_name"], $target_file)) {
        // --- PERUBAHAN KUNCI DI SINI ---
        // Jika upload file berhasil, simpan nama file ke database
        $stmt = $conn->prepare("UPDATE users SET $column_name = ? WHERE id = ?");
        $stmt->bind_param("si", $new_file_name, $user_id);
        
        if ($stmt->execute()) {
           echo json_encode([
                'status' => 'success', 
                'message' => 'Dokumen berhasil diunggah!',
                'fileName' => $new_file_name // Tambahkan ini
            ]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Gagal menyimpan path file ke database.']);
        }
        $stmt->close();
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Gagal mengunggah file.']);
    }
    
    $conn->close();
}
?>