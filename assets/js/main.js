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
    loadNavbar();
    handleLogout();
    loadUserData(); // Untuk menampilkan nama pengguna

    // 3. Panggil inisialisasi modul yang spesifik untuk halaman saat ini
    const page = window.location.pathname.split("/").pop();

    switch(page) {
        case 'login.html':
        case 'register.html':
            initAuth();
            break;
        case 'index.html':
        case 'event-detail.html':
            initCompetitions();
            break;
        case 'account.html':
            initAccount();
            break;
        case 'payment.html':
        case 'free-registration.html':
            initPayment();
            break;
        case 'transactions.html':
            initTransactions();
            break;
        case 'history.html':
            initHistory();
            break;
        case 'news.html':
            initNews();
            break;
    }
});