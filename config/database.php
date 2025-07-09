<?php

// --- PENGATURAN KONEKSI DATABASE ---
// Mendefinisikan detail koneksi ke dalam variabel agar mudah diubah.
$db_host = "localhost"; 
$db_user = "root";      
$db_pass = "";         
$db_name = "respect_db";

// --- MEMBUAT KONEKSI ---
// Membuat koneksi ke database menggunakan detail di atas.
$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);


// --- PENGECEKAN KONEKSI ---
// Memeriksa apakah koneksi berhasil atau gagal.
if ($conn->connect_error) {
    // Jika koneksi gagal, hentikan eksekusi skrip dan tampilkan pesan error.
    die("Koneksi ke database gagal: " . $conn->connect_error);
} 
// else {
//     echo "Koneksi ke database berhasil!";
// }

?>