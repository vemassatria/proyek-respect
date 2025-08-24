<?php
session_start();

// Periksa apakah user sudah login DAN memiliki peran 'admin'
if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
    // Jika tidak, hancurkan session untuk keamanan dan redirect ke halaman login
    session_destroy();
    header('Location: index.php');
    exit;
}

// Jika aman, kita bisa simpan nama admin untuk ditampilkan
$admin_name = $_SESSION['user_nama'];
?>