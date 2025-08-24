<?php
require 'init.php';
$user_id = $_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['profile_picture'])) {
    $file = $_FILES['profile_picture'];
    
    // Validasi file (ukuran maks 2MB, tipe gambar)
    $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
    if ($file['error'] !== UPLOAD_ERR_OK || $file['size'] > 2000000 || !in_array($file['type'], $allowed_types)) {
        echo json_encode(['status' => 'error', 'message' => 'File tidak valid, terlalu besar (maks 2MB), atau bukan gambar.']);
        exit;
    }

    // Ambil nama foto lama untuk dihapus nanti
    $stmt = $conn->prepare("SELECT profile_picture_path FROM users WHERE id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $old_picture = $stmt->get_result()->fetch_assoc()['profile_picture_path'];
    $stmt->close();

    // Proses upload file baru
    $target_dir = "../uploads/profiles/";
    if (!is_dir($target_dir)) mkdir($target_dir, 0777, true);
    
    $file_extension = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));
    $new_file_name = "profile_" . $user_id . "_" . time() . "." . $file_extension;
    $target_file = $target_dir . $new_file_name;

    if (move_uploaded_file($file["tmp_name"], $target_file)) {
        // Update path di database
        $stmt_update = $conn->prepare("UPDATE users SET profile_picture_path = ? WHERE id = ?");
        $stmt_update->bind_param("si", $new_file_name, $user_id);
        
        if ($stmt_update->execute()) {
            // Hapus file lama jika ada
            if ($old_picture && file_exists($target_dir . $old_picture)) {
                unlink($target_dir . $old_picture);
            }
            echo json_encode(['status' => 'success', 'message' => 'Foto profil berhasil diperbarui.']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Gagal menyimpan path ke database.']);
        }
        $stmt_update->close();
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Gagal mengupload file.']);
    }
    $conn->close();
} else {
     echo json_encode(['status' => 'error', 'message' => 'Request tidak valid.']);
}
?>
