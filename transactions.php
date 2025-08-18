<!DOCTYPE html>
<html lang="id">
<head>
    <?php 
        $pageTitle = 'Transaksi';
        include 'components/_head.php'; 
    ?>
</head>
<body>
    <main class="main-content">
        <?php 
            $headerTitle = 'TRANSACTION';
            $headerSubtitle = 'Daftar Pembayaran';
            include 'components/_page-header.php'; 
        ?>

        <div class="transaction-table" id="transaction-list-container">
            <div class="transaction-header">
                <div>No Transaksi</div>
                <div>Proses Paket</div>
                <div>Upload Bukti Transfer</div>
                <div>Amount</div>
                <div>Berlaku Hingga</div>
            </div>
             </div>
    </main>

    <?php include 'components/_navbar.php'; ?>
    <script type="module" src="assets/js/main.js"></script>
</body>
</html>