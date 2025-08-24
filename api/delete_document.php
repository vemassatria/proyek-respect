<?php
require 'init.php';
$user_id = $_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $docType = $data['doc_type'] ?? '';
    
    $allowed_columns = ['cv_path', 'portfolio_path', 'ktm_path'];
    $column_name = $docType . '_path';

    if (in_array($column_name, $allowed_columns)) {
        // Ambil nama file untuk dihapus dari server
        $stmt = $conn->prepare("SELECT $column_name FROM users WHERE id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $file_name = $stmt->get_result()->fetch_assoc()[$column_name];
        $stmt->close();

        // Update database menjadi NULL
        $stmt = $conn->prepare("UPDATE users SET $column_name = NULL WHERE id = ?");
        $stmt->bind_param("i", $user_id);
        if ($stmt->execute()) {
            // Hapus file dari server jika ada
            if ($file_name && file_exists("../uploads/documents/" . $file_name)) {
                unlink("../uploads/documents/" . $file_name);
            }
            echo json_encode(['status' => 'success', 'message' => 'Dokumen berhasil dihapus.']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Gagal menghapus dokumen.']);
        }
        $stmt->close();
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Tipe dokumen tidak valid.']);
    }
}
$conn->close();
?>
