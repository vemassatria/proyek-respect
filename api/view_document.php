<?php
// Ambil nama file dari parameter URL
$fileName = $_GET['file'] ?? '';

// --- Keamanan Tingkat Lanjut ---
// Pastikan nama file tidak kosong dan tidak mengandung karakter berbahaya
// yang bisa menyebabkan serangan Directory Traversal (misalnya '../')
if (empty($fileName) || strpos($fileName, '..') !== false || strpos($fileName, '/') !== false || strpos($fileName, '\\') !== false) {
    http_response_code(400); // Bad Request
    die('Nama file tidak valid.');
}

// Tentukan path lengkap ke file di dalam folder 'uploads/documents/'
$filePath = '../uploads/documents/' . $fileName;

// Periksa apakah file benar-benar ada
if (!file_exists($filePath)) {
    http_response_code(404); // Not Found
    die('File tidak ditemukan.');
}

// Tentukan tipe konten (MIME type) berdasarkan ekstensi file
$fileInfo = new finfo(FILEINFO_MIME_TYPE);
$mimeType = $fileInfo->file($filePath);

// --- Bagian Kunci ---
// Atur header HTTP untuk memberitahu browser cara menangani file ini
header('Content-Type: ' . $mimeType);
header('Content-Disposition: inline; filename="' . basename($filePath) . '"');
header('Content-Length: ' . filesize($filePath));
header('Accept-Ranges: bytes');

// Baca dan kirim isi file ke browser
readfile($filePath);
exit;
?>