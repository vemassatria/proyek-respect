<!DOCTYPE html>
<html lang="id">
<head>
    <?php 
        $pageTitle = 'Syarat Pendaftaran Gratis';
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
        <form id="free-regis-form" class="registration-container">
            <header class="registration-header">
                <h2>PERSYARATAN PENDAFTARAN GRATIS</h2>
            </header>
            <section class="requirement-list">
                <div class="requirement-item">
                    <div class="requirement-info"><h3>Follow Instagram @Respect.id_Indonesia</h3></div>
                    <input type="file" name="req_follow" class="file-input-requirement" required>
                </div>
                <div class="requirement-item">
                    <div class="requirement-info"><h3>Share Poster Event Ke Instastory</h3></div>
                    <input type="file" name="req_share" class="file-input-requirement" required>
                </div>
                <div class="requirement-item">
                    <div class="requirement-info"><h3>Ajak 5 Teman kamu di Poster Event</h3></div>
                    <input type="file" name="req_invite" class="file-input-requirement" required>
                </div>
                <div class="requirement-item">
                    <div class="requirement-info"><h3>Subscribe Youtube Respect.id</h3></div>
                    <input type="file" name="req_subscribe" class="file-input-requirement" required>
                </div>
            </section>
            <button type="submit" class="btn-submit-requirement">Submit Persyaratan</button>
        </form>
    </main>
    <script type="module" src="assets/js/main.js"></script>
</body>
</html>