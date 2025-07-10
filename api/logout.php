<?php
// Selalu mulai session untuk bisa mengakses dan menghancurkannya.
session_start();

// Hapus semua variabel session.
$_SESSION = array();

// Hancurkan session-nya.
session_destroy();

// Kirim respon sukses dalam format JSON.
header('Content-Type: application/json');
echo json_encode(['status' => 'success', 'message' => 'Anda telah berhasil logout.']);
?>