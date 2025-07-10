<?php
header('Content-Type: application/json');
require '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $nama = $_POST['nama'];
    $email = $_POST['email'];
    $password = $_POST['password'];

    if (empty($nama) || empty($email) || empty($password)) {
        echo json_encode(['status' => 'error', 'message' => 'Semua field harus diisi.']);
        exit;
    }

    $hashed_password = password_hash($password, PASSWORD_BCRYPT);
    $stmt = $conn->prepare("INSERT INTO users (nama, email, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $nama, $email, $hashed_password);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Registrasi berhasil!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Registrasi gagal: ' . $stmt->error]);
    }
    $stmt->close();
    $conn->close();
}
?>