<?php
session_start();
// Jika admin sudah login, langsung arahkan ke dashboard
if (isset($_SESSION['user_id']) && isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin') {
    header('Location: dashboard.php');
    exit;
}
$pageTitle = 'Admin Login';
// Kita tidak menyertakan _head.php biasa karena halaman admin mungkin punya style sendiri
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($pageTitle); ?> - Respect.id</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <style>
        /* Style khusus untuk halaman login admin */
        .admin-login-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: var(--background-light);
        }
        .admin-login-card {
            width: 100%;
            max-width: 400px;
        }
    </style>
</head>
<body>
    <main class="admin-login-container">
        <div class="register-card admin-login-card">
            <div style="text-align: center; margin-bottom: 2rem;">
                <img src="../assets/images/logo-respect.png" alt="Respect Logo" style="width: 80px;">
            </div>
            <h2>Admin Panel Login</h2>
            <form class="register-form" id="adminLoginForm">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="masukkan email admin" required>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" placeholder="masukkan password" required>
                </div>
                <button type="submit" class="btn-register">Login</button>
            </form>
        </div>
    </main>
    <script type="module" src="../assets/js/main.js"></script>
</body>
</html>