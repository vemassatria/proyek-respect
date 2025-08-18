<!DOCTYPE html>
<html lang="id">
<head>
    <?php 
        $pageTitle = 'History';
        include 'components/_head.php'; 
    ?>
</head>
<body>
    <main class="main-content">
        <?php 
            $headerTitle = 'HISTORY';
            $headerSubtitle = 'Perjalanan Kejuaraan';
            include 'components/_page-header.php'; 
        ?>

        <section class="history-list" id="history-list-container">
            </section>
    </main>

    <?php include 'components/_navbar.php'; ?>
    <script type="module" src="assets/js/main.js"></script>
</body>
</html>