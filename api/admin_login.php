<?php
session_start();
header('Content-Type: application/json');
require '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    if (empty($email) || empty($password)) {
        echo json_encode(['status' => 'error', 'message' => 'Email dan password harus diisi.']);
        exit;
    }

    // Ambil data user, TERMASUK role
    $stmt = $conn->prepare("SELECT id, nama, password, role FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();

        // Verifikasi password DAN periksa role
        if (password_verify($password, $user['password'])) {
            if ($user['role'] === 'admin') {
                // Jika berhasil, simpan semua data penting ke session
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['user_nama'] = $user['nama'];
                $_SESSION['user_role'] = $user['role'];

                echo json_encode([
                    'status' => 'success',
                    'message' => 'Login berhasil!'
                ]);
            } else {
                // Password benar, tapi bukan admin
                echo json_encode(['status' => 'error', 'message' => 'Akses ditolak. Akun ini bukan admin.']);
            }
        } else {
            // Password salah
            echo json_encode(['status' => 'error', 'message' => 'Kombinasi email dan password salah.']);
        }
    } else {
        // Email tidak ditemukan
        echo json_encode(['status' => 'error', 'message' => 'Kombinasi email dan password salah.']);
    }
    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Metode request tidak valid.']);
}
?>