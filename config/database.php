<?php
$db_host = "localhost";
$db_user = "root";
$db_pass = "";
$db_name = "respect_db";

// Menonaktifkan laporan error internal mysqli agar kita bisa tangani sendiri secara manual.
mysqli_report(MYSQLI_REPORT_OFF);

$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

// HAPUS BLOK KODE DI BAWAH INI DARI FILE ANDA:
/*
if ($conn->connect_error) {
    die("Koneksi ke database gagal: " . $conn->connect_error);
}
*/
?>