/**
 * assets/js/main.js
 * File JavaScript utama yang bertugas sebagai entry point.
 */

// Impor semua fungsi inisialisasi dari modul-modul
import { initAuth } from './modules/auth.js';
import { initCompetitions } from './modules/competitions.js';
import { initAccount } from './modules/account.js';
import { initPayment } from './modules/payment.js';
import { initTransactions } from './modules/transactions.js';
import { initHistory } from './modules/history.js';
import { initNews } from './modules/news.js';
import { protectRoutes, loadNavbar, handleLogout, loadUserData } from './modules/shared.js';

// Jalankan semua skrip setelah DOM selesai dimuat
document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Jalankan proteksi halaman
    if (!protectRoutes()) {
        return; // Hentikan eksekusi jika pengguna tidak diotorisasi
    }

    // 2. Jalankan fungsi global yang ada di banyak halaman
    handleLogout();
    loadUserData(); // Untuk menampilkan nama pengguna

    // 3. Panggil inisialisasi modul yang spesifik untuk halaman saat ini
    const page = window.location.pathname.split("/").pop();

    switch(page) {
        case 'login.php':
        case 'register.php':
            initAuth();
            break;
        case 'index.php':
        case 'event-detail.php':
            initCompetitions();
            break;
        case 'account.php':
            initAccount();
            break;
        case 'payment.php':
        case 'free-registration.php':
            initPayment();
            break;
        case 'transactions.php':
            initTransactions();
            break;
        case 'history.php':
            initHistory();
            break;
        case 'news.php':
            initNews();
            break;
    }
});