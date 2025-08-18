<!DOCTYPE html>
<html lang="id">
<head>
    <?php 
        $pageTitle = 'News & Article';
        include 'components/_head.php'; 
    ?>
</head>
<body>
    <main class="main-content">
        <?php 
            $headerTitle = 'NEWS & ARTICLE';
            $headerSubtitle = 'Berita terkini dan artikel terpercaya';
            include 'components/_page-header.php'; 
        ?>

        <section class="news-section">
            <h2>Berita Terkini</h2>
            <div id="featured-news-container" class="featured-news-wrapper">
                </div>
        </section>

        <section class="articles-section">
            <h2>Artikel Organisasi</h2>
            <div class="articles-container">
                <div id="organizational-articles-left" class="article-column"></div>
                <div id="organizational-articles-right" class="article-column"></div>
            </div>
        </section>
    </main>
    
    <?php include 'components/_navbar.php'; ?>
    <script type="module" src="assets/js/main.js"></script>
</body>
</html>