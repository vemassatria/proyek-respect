<?php
// Dapatkan nama file dari URL saat ini, contoh: "dashboard.php"
$current_page = basename($_SERVER['SCRIPT_NAME']);
?>
<aside class="sidebar">
    <div class="sidebar-header">
        <img src="../assets/images/logo-respect.png" alt="Logo" class="sidebar-logo">
        <h2>Admin Panel</h2>
    </div>
    <nav class="sidebar-nav">
        <a href="dashboard.php" class="nav-link <?php echo ($current_page == 'dashboard.php') ? 'active' : ''; ?>">
            <i class="fas fa-tachometer-alt"></i>
            <span>Dashboard</span>
        </a>
        <a href="manage_competitions.php" class="nav-link <?php echo ($current_page == 'manage_competitions.php') ? 'active' : ''; ?>">
            <i class="fas fa-trophy"></i>
            <span>Manajemen Lomba</span>
        </a>
        <a href="manage_news.php" class="nav-link <?php echo ($current_page == 'manage_news.php') ? 'active' : ''; ?>">
            <i class="fas fa-newspaper"></i>
            <span>Manajemen Berita</span>
        </a>
        <a href="manage_transactions.php" class="nav-link ...">
            <i class="fas fa-file-invoice-dollar"></i>
            <span>Verifikasi Transaksi</span>
        </a>
        <a href="verify_free_registrations.php" class="nav-link <?php echo ($current_page == 'verify_free_registrations.php') ? 'active' : ''; ?>">
            <i class="fas fa-check-double"></i>
            <span>Verifikasi Gratis</span>
        </a>
        <a href="manage_users.php" class="nav-link <?php echo ($current_page == 'manage_users.php') ? 'active' : ''; ?>">
            <i class="fas fa-users"></i>
            <span>Manajemen Pengguna</span>
        </a>
    </nav>
    <div class="sidebar-footer">
        <a href="#" id="admin-logout-btn" class="nav-link logout">
            <i class="fas fa-sign-out-alt"></i>
            <span>Logout</span>
        </a>
    </div>
</aside>
<main class="main-content">
    <header class="main-header">
        <h3><?php echo isset($headerTitle) ? htmlspecialchars($headerTitle) : 'Dashboard'; ?></h3>
        <div class="admin-profile">
            <span>Halo, <?php echo htmlspecialchars($admin_name); ?></span>
            <i class="fas fa-user-circle"></i>
        </div>
    </header>