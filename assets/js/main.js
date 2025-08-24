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
import { initAdmin } from './modules/admin.js'; // <-- BARU: Impor modul admin
import { protectRoutes, handleLogout, loadUserData, setActiveNavLink, handleDynamicBackButton } from './modules/shared.js';

// Jalankan semua skrip setelah DOM selesai dimuat
document.addEventListener("DOMContentLoaded", function() {

    const currentPath = window.location.pathname;

    // --- LOGIKA BARU UNTUK MEMISAHKAN ADMIN DAN USER ---
    // Cek apakah kita berada di dalam folder admin
    if (currentPath.includes('/admin/')) {
        initAdmin(); // Jalankan hanya skrip untuk admin
        return;      // Hentikan eksekusi agar skrip user tidak berjalan
    }
    // ----------------------------------------------------


    // --- Skrip untuk halaman PENGGUNA (USER) ---
    if (!protectRoutes()) {
        return; // Hentikan jika pengguna belum login dan mencoba akses halaman terproteksi
    }

    // Jalankan fungsi global untuk halaman pengguna
    handleDynamicBackButton();
    setActiveNavLink();
    handleLogout();
    loadUserData();

    // Dapatkan nama file halaman saat ini
    const page = currentPath.split("/").pop() || 'index.php';

    // Jalankan inisialisasi modul berdasarkan halaman yang aktif
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