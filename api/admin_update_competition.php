<?php
require '../admin/auth.php'; // Proteksi Admin
require '../config/database.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Metode request tidak valid.']);
    exit;
}

// Ambil semua data dari form
$id = $_POST['competition_id'] ?? null;
$nama_lomba = trim($_POST['nama_lomba'] ?? '');
$deskripsi = trim($_POST['deskripsi'] ?? '');
$tanggal_mulai = $_POST['tanggal_mulai_daftar'] ?? '';
$tanggal_akhir = $_POST['tanggal_akhir_daftar'] ?? '';
$biaya = filter_var($_POST['biaya'] ?? 0, FILTER_VALIDATE_FLOAT);

if (empty($id) || empty($nama_lomba) || empty($deskripsi) || empty($tanggal_mulai) || empty($tanggal_akhir) || $biaya === false) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Semua field wajib diisi dengan benar.']);
    exit;
}

// Ambil nama banner lama dari DB
$stmt = $conn->prepare("SELECT banner_img FROM competitions WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
$existing_data = $result->fetch_assoc();
$old_banner_name = $existing_data['banner_img'] ?? null;
$stmt->close();

$banner_img_name = $old_banner_name; // Default ke nama lama

// Cek jika ada file banner baru yang diupload
if (isset($_FILES['banner_img']) && $_FILES['banner_img']['error'] === UPLOAD_ERR_OK) {
    // Logika upload file (sama seperti pada add_competition)
    $file = $_FILES['banner_img'];
    $target_dir = "../assets/images/";
    $allowed_extensions = ['jpg', 'jpeg', 'png'];
    $file_extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

    if (!in_array($file_extension, $allowed_extensions)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Format file banner baru tidak valid.']);
        exit;
    }

    $banner_img_name = 'banner_' . time() . '.' . $file_extension;
    $target_file = $target_dir . $banner_img_name;

    if (move_uploaded_file($file['tmp_name'], $target_file)) {
        // Jika upload baru berhasil, hapus file banner lama
        if ($old_banner_name && file_exists($target_dir . $old_banner_name)) {
            unlink($target_dir . $old_banner_name);
        }
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Gagal mengupload file banner baru.']);
        exit;
    }
}

// Update data di database
$sql = "UPDATE competitions SET nama_lomba = ?, deskripsi = ?, tanggal_mulai_daftar = ?, tanggal_akhir_daftar = ?, biaya = ?, banner_img = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssdsi", $nama_lomba, $deskripsi, $tanggal_mulai, $tanggal_akhir, $biaya, $banner_img_name, $id);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Data lomba berhasil diperbarui!']);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Gagal memperbarui data di database: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>