<div class="page-header">
    <a href="index.php" class="back-button">
        <svg width="24" height="24" viewBox="0 0 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M12 19L5 12L12 5" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </a>
    <div class="page-title">
        <h2><?php echo isset($headerTitle) ? htmlspecialchars($headerTitle) : 'Judul Halaman'; ?></h2>
        <p><?php echo isset($headerSubtitle) ? htmlspecialchars($headerSubtitle) : 'Subjudul halaman'; ?></p>
    </div>
    <img src="assets/images/logo-respect.png" alt="Respect Logo" class="page-logo">
</div>