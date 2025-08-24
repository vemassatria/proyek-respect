<?php
// Set judul halaman default jika tidak ditentukan
$pageTitle = isset($pageTitle) ? $pageTitle : 'Platform Kompetisi Online';
?>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?php echo htmlspecialchars($pageTitle); ?> - Respect.id</title>
<link rel="stylesheet" href="assets/css/style.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">