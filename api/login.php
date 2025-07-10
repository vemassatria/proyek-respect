<?php
session_start();
header('Content-Type: application/json');
require '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = $_POST['email'];
    $password = $_POST['password'];

    if (empty($email) || empty($password)) {
        echo json_encode(['status' => 'error', 'message' => 'Email dan password harus diisi.']);
        exit;
    }

    $stmt = $conn->prepare("SELECT id, nama, password FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_nama'] = $user['nama'];
            
            echo json_encode([
                'status' => 'success', 
                'message' => 'Login berhasil!',
                'data' => ['id' => $user['id'], 'nama' => $user['nama']]
            ]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Password salah.']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Email tidak terdaftar.']);
    }
    $stmt->close();
    $conn->close();
}
?>