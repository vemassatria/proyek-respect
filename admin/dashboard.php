<?php
$pageTitle = 'Dashboard';
$headerTitle = 'Dashboard Overview';
include '_header.php'; // Memanggil header, yang sudah termasuk auth.php
include '_sidebar.php'; // Memanggil sidebar dan header utama
?>

<div class="dashboard-stats">
    <div class="stat-card">
        <div class="stat-icon users">
            <i class="fas fa-users"></i>
        </div>
        <div class="stat-info">
            <p>Total Pengguna</p>
            <span>Memuat...</span>
        </div>
    </div>
    <div class="stat-card">
        <div class="stat-icon competitions">
            <i class="fas fa-trophy"></i>
        </div>
        <div class="stat-info">
            <p>Total Lomba</p>
            <span>Memuat...</span>
        </div>
    </div>
    <div class="stat-card">
        <div class="stat-icon transactions">
            <i class="fas fa-file-invoice-dollar"></i>
        </div>
        <div class="stat-info">
            <p>Transaksi Pending</p>
            <span>Memuat...</span>
        </div>
    </div>
    <div class="stat-card">
        <div class="stat-icon revenue">
            <i class="fas fa-money-bill-wave"></i>
        </div>
        <div class="stat-info">
            <p>Total Pendapatan</p>
            <span>Memuat...</span>
        </div>
    </div>
</div>

<div class="dashboard-content">
    <div class="content-card">
        <h4>Aktivitas Terbaru</h4>
        <p>Fitur ini akan menampilkan pendaftaran atau transaksi terbaru.</p>
    </div>
</div>

<?php
include '_footer.php'; // Memanggil footer
?>