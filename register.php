<!DOCTYPE html>
<html lang="id">
<head>
    <?php 
        $pageTitle = 'Daftar Akun Baru';
        include 'components/_head.php'; 
    ?>
</head>
<body>
    <div class="logo-container">
        <img src="assets/images/logo-respect.png" alt="Respect Logo" class="respect-logo">
    </div>

    <main class="main-content">
        <div class="register-container">
            <div class="register-left">
                <div class="register-card">
                    <h2>Daftar Baru Akun Respect.id</h2>
                    <form class="register-form" id="registerForm">
                        <div class="form-group">
                            <label for="name">Nama Lengkap</label>
                            <input type="text" id="name" name="nama" placeholder="masukkan nama lengkap kamu" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Masukkan Email Kamu Disini</label>
                            <input type="email" id="email" name="email" placeholder="masukkan email kamu disini" required>
                        </div>
                        <div class="form-group">
                            <label for="password">Masukkan password</label>
                            <div class="password-input">
                                <input type="password" id="password" name="password" placeholder="masukkan password kamu" required>
                                <button type="button" class="toggle-password">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        <circle cx="12" cy="12" r="3" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="confirmPassword">Konfirmasi password</label>
                            <div class="password-input">
                                <input type="password" id="confirmPassword" name="confirmPassword" placeholder="ketik ulang password" required>
                                <button type="button" class="toggle-password">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        <circle cx="12" cy="12" r="3" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <button type="submit" class="btn-register">Verifikasi Email Sekarang!</button>
                        <button type="button" class="btn-login" id="goToLogin">Masuk Akun</button>
                    </form>
                </div>
            </div>
            <div class="register-right">
                <div class="illustration">
                    <img src="assets/images/hero.png" alt="3D Character with VR headset" class="hero-image">
                </div>
            </div>
        </div>
        <div class="footer-banner">
            <h3>Platform Kolaborasi dari Berbagai Universitas<br>dalam Pendidikan, Riset, Teknologi, dan Kesehatan</h3>
        </div>
    </main>
    <script type="module" src="assets/js/main.js"></script>
</body>
</html>