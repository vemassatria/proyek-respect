/**
 * assets/js/modules/shared.js
 * Modul untuk fungsi bersama: route protection, pemuatan navbar, dan logika logout.
 */

// 1. Proteksi Halaman
export function protectRoutes() {
    const user = JSON.parse(localStorage.getItem('user'));
    const currentPage = window.location.pathname.split("/").pop();
    const publicPages = ['login.php', 'register.php', ''];

    if (!user && !publicPages.includes(currentPage)) {
        alert("Anda harus login terlebih dahulu untuk mengakses halaman ini.");
        window.location.href = 'login.php';
        return false; // Mengindikasikan untuk menghentikan eksekusi skrip lebih lanjut
    }
    return true; // Lanjutkan eksekusi
}

// 2. Memuat Navbar Bawah
export function loadNavbar() {
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    if (navbarPlaceholder) {
        fetch('bottom-navbar.php')
            .then(response => response.ok ? response.text() : Promise.reject('Gagal memuat navbar'))
            .then(data => {
                navbarPlaceholder.innerHTML = data;
                const currentPage = window.location.pathname.split("/").pop();
                const navLinks = document.querySelectorAll('#navbar-placeholder .nav-link');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === currentPage) {
                        link.classList.add('active');
                    }
                });
            })
            .catch(error => console.error('Kesalahan Navigasi:', error));
    }
}

// 3. Menangani Logout
export function handleLogout() {
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            fetch('api/logout.php')
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        localStorage.removeItem('user');
                        window.location.href = 'login.php';
                    } else {
                        alert('Gagal logout. Silakan coba lagi.');
                    }
                })
                .catch(error => console.error('Error saat logout:', error));
        });
    }
}

// 4. Memuat Data Pengguna Global (misal: di header)
export function loadUserData() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        const welcomeMessage = document.getElementById('welcome-message');
        if (welcomeMessage) {
            welcomeMessage.textContent = `HAI ${user.nama.toUpperCase()}!`;
        }
        const accountName = document.getElementById('account-name');
        if (accountName) {
            accountName.textContent = user.nama;
        }
    }
}