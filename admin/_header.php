<?php
// Panggil auth.php di setiap halaman admin yang terproteksi
// Ini akan otomatis memulai session dan memeriksa hak akses
require_once 'auth.php';
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo isset($pageTitle) ? htmlspecialchars($pageTitle) : 'Admin Panel'; ?> - Respect.id</title>
    
    <link rel="stylesheet" href="../assets/css/admin.css">
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
</head>
<body>
    <div class="admin-wrapper"></div>