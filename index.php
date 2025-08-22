<!DOCTYPE html>
<html lang="id">
<head>
    <?php 
        $pageTitle = 'Home';
        include 'components/_head.php'; 
    ?>
</head>
<body>
    <main class="main-content">
        <header class="home-header">
            <div class="header-text">
                <h3 id="welcome-message">HALLO!</h3>
                <p>Rekomendasi untuk kamu</p>
            </div>
            <!-- <div class="header-icons">
                <img src="assets/images/icon-add-header.svg" alt="Add">
                <img src="assets/images/icon-idea.svg" alt="Idea">
                <img src="assets/images/icon-cart.svg" alt="Cart">
                <img src="assets/images/icon-notif.svg" alt="Notification">
            </div> -->
            <div class="header-logo">
                <img src="assets/images/logo-respect.png" alt="Respect Logo">
            </div>
        </header>

        <section class="event-list-wrapper">
            <div class="event-list-scroller" id="event-list-container">      
                </div>
        </section>
    </main>

    <?php include 'components/_navbar.php'; ?>
    <script type="module" src="assets/js/main.js"></script>
</body>
</html>