<?php
$pageTitle = 'Verifikasi Transaksi';
$headerTitle = 'Verifikasi Pembayaran & Pendaftaran';
include '_header.php';
include '_sidebar.php';
?>

<div class="content-card">
    <div class="toolbar">
        <h4>Daftar Transaksi</h4>
        </div>

    <table class="data-table" id="transactions-table">
        <thead>
            <tr>
                <th>ID Transaksi</th>
                <th>Nama Peserta</th>
                <th>Nama Lomba</th>
                <th>Total Biaya</th>
                <th>Status</th>
                <th>Bukti</th>
                <th>Aksi</th>
            </tr>
        </thead>
        <tbody>
            </tbody>
    </table>
</div>

<div id="proof-modal" class="modal-overlay" style="display: none;">
    <div class="modal-content">
        <div class="modal-header">
            <h4>Bukti Pembayaran</h4>
            <button id="close-proof-modal-btn" class="close-button">&times;</button>
        </div>
        <div class="modal-body" style="text-align: center;">
            <img id="proof-image" src="" alt="Bukti Pembayaran" style="max-width: 100%; height: auto;">
        </div>
    </div>
</div>

<?php
include '_footer.php';
?>