<?php
// Mulai session dan panggil file auth.php untuk proteksi
// Ini memastikan hanya admin yang bisa mengakses API ini
require '../admin/auth.php';
require '../config/database.php';

header('Content-Type: application/json');

// Pastikan metode request adalah POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Metode request tidak valid.']);
    exit;
}

// --- Validasi dan Sanitasi Input ---
$nama_lomba = trim($_POST['nama_lomba'] ?? '');
$deskripsi = trim($_POST['deskripsi'] ?? '');
$tanggal_mulai = $_POST['tanggal_mulai_daftar'] ?? '';
$tanggal_akhir = $_POST['tanggal_akhir_daftar'] ?? '';
$biaya = filter_var($_POST['biaya'] ?? 0, FILTER_VALIDATE_FLOAT);

// Periksa apakah ada field yang kosong
if (empty($nama_lomba) || empty($deskripsi) || empty($tanggal_mulai) || empty($tanggal_akhir) || $biaya === false) {
    http_response_code(400); // Bad Request
    echo json_encode(['status' => 'error', 'message' => 'Semua field wajib diisi dengan benar.']);
    exit;
}

// --- Proses Upload Banner ---
$banner_img_name = '';
if (isset($_FILES['banner_img']) && $_FILES['banner_img']['error'] === UPLOAD_ERR_OK) {
    $file = $_FILES['banner_img'];
    $target_dir = "../assets/images/";
    $allowed_extensions = ['jpg', 'jpeg', 'png'];
    $file_extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

    if (!in_array($file_extension, $allowed_extensions)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Format file banner tidak valid. Hanya JPG, JPEG, PNG.']);
        exit;
    }

    // Buat nama file yang unik untuk menghindari tumpang tindih
    $banner_img_name = 'banner_' . time() . '.' . $file_extension;
    $target_file = $target_dir . $banner_img_name;

    if (!move_uploaded_file($file['tmp_name'], $target_file)) {
        http_response_code(500); // Internal Server Error
        echo json_encode(['status' => 'error', 'message' => 'Gagal mengupload file banner.']);
        exit;
    }
} else {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Banner/Poster wajib diupload.']);
    exit;
}

// --- Simpan ke Database ---
$sql = "INSERT INTO competitions (nama_lomba, deskripsi, tanggal_mulai_daftar, tanggal_akhir_daftar, biaya, banner_img) VALUES (?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
if ($stmt === false) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Gagal menyiapkan statement: ' . $conn->error]);
    exit;
}

$stmt->bind_param("ssssds", $nama_lomba, $deskripsi, $tanggal_mulai, $tanggal_akhir, $biaya, $banner_img_name);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Lomba baru berhasil ditambahkan!']);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Gagal menyimpan data ke database: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>