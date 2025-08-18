<!DOCTYPE html>
<html lang="id">
<head>
    <?php 
        $pageTitle = 'Detail Event';
        include 'components/_head.php'; 
    ?>
</head>
<body class="bg-pink-gradient">
    <main class="main-content-flow">
        <a href="index.php" class="back-button-corner">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M12 19L5 12L12 5" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </a>
        <div class="competition-detail-container" id="competition-detail-content">
            <header class="competition-header">
                <h2 id="competition-title">Memuat nama lomba...</h2>
                <p id="competition-description"></p>
                <img id="competition-banner" src="" alt="Banner Lomba" style="width: 100%; border-radius: 16px; margin-top: 1rem;">
            </header>
            <section class="details-section" id="details-container">
                </section>
        </div>
    </main>
    <footer class="event-detail-footer">
        <button id="btn-gratis" class="btn-choice gratis">Gratis</button>
        <button id="btn-berbayar" class="btn-choice berbayar">Berbayar</button>
    </footer>
    <script type="module" src="assets/js/main.js"></script>
</body>
</html>