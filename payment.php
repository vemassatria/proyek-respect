<!DOCTYPE html>
<html lang="id">
<head>
    <?php 
        $pageTitle = 'Pembayaran';
        include 'components/_head.php'; 
    ?>
</head>
<body class="bg-pink-gradient">
    <main class="main-content-flow">
        <a href="event-detail.php" class="back-button-corner">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M12 19L5 12L12 5" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </a>
        <div class="checkout-container" id="payment-container">
            <header class="checkout-header">
                <h2>Detail Pembayaran</h2>
                <p>Pilih item lomba dan merchandise yang Anda inginkan.</p>
            </header>
            <section class="checkout-section">
                <h3>Pilih Kategori Lomba</h3>
                <div id="competition-items-container"></div>
            </section>
            <section class="checkout-section">
                <h3>Merchandise</h3>
                <div id="merchandise-items-container"></div>
            </section>
        </div>
    </main>
    <footer class="checkout-footer">
        <div class="total-price">
            <span>Total Biaya:</span>
            <strong id="total-cost">Rp 0</strong>
        </div>
        <button id="process-checkout-btn" class="btn-checkout">Selesaikan Pembayaran</button>
    </footer>
    <script type="module" src="assets/js/main.js"></script>
</body>
</html>