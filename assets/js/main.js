/**
 * Menjalankan semua skrip setelah seluruh konten halaman (DOM) selesai dimuat.
 */
document.addEventListener("DOMContentLoaded", function() {

    // =================================================================
    // MODUL 1: FUNGSI NAVIGASI UTAMA
    // Mengelola pemuatan dan status aktif dari navigasi bawah.
    // =================================================================
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    if (navbarPlaceholder) {
        function loadNavbar() {
            fetch('bottom-navbar.html')
                .then(response => {
                    if (!response.ok) throw new Error('Gagal memuat navbar');
                    return response.text();
                })
                .then(data => {
                    navbarPlaceholder.innerHTML = data;
                    setActiveNavLink();
                })
                .catch(error => console.error('Terjadi kesalahan:', error));
        }

        function setActiveNavLink() {
            const currentPage = window.location.pathname.split("/").pop();
            const navLinks = document.querySelectorAll('#navbar-placeholder .nav-link');
            navLinks.forEach(link => {
                if (link.getAttribute('href') === currentPage) {
                    link.classList.add('active');
                }
            });
        }
        loadNavbar();
    }


    // =================================================================
    // MODUL 2: FUNGSI AUTENTIKASI (LOGIN & REGISTER)
    // =================================================================

    // --- Sub-Modul 2a: Perpindahan Halaman ---
    const goToLoginBtn = document.getElementById('goToLogin');
    if (goToLoginBtn) {
        goToLoginBtn.addEventListener('click', () => { window.location.href = 'login.html'; });
    }
    const goToRegisterBtn = document.getElementById('goToRegister');
    if (goToRegisterBtn) {
        goToRegisterBtn.addEventListener('click', () => { window.location.href = 'register.html'; });
    }

    // --- Sub-Modul 2b: Toggle Tampil/Sembunyi Password ---
    const eyeIconOpen = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const eyeIconSlashed = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><line x1="1" y1="1" x2="23" y2="23" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></line></svg>`;
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const passwordInput = this.previousElementSibling;
            const isPasswordHidden = passwordInput.getAttribute('type') === 'password';
            passwordInput.setAttribute('type', isPasswordHidden ? 'text' : 'password');
            this.innerHTML = isPasswordHidden ? eyeIconSlashed : eyeIconOpen;
        });
    });

    // --- Sub-Modul 2c: Pengiriman Form ke API (KODE BARU DITAMBAHKAN) ---
    // Logika untuk form registrasi
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const formData = new FormData(this);

            fetch('api/register.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                // BARIS BARU: Tampilkan respon asli ke console untuk debugging
                console.log('Respon dari server (register):', data); 

                alert(data.message);
                if (data.status === 'success') {
                    window.location.href = 'login.html';
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }

    // Logika untuk form login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const formData = new FormData(this);

            fetch('api/login.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                // BARIS BARU: Tampilkan respon asli ke console untuk debugging
                console.log('Respon dari server (login):', data);

                alert(data.message);
                if (data.status === 'success') {
                    window.location.href = 'index.html';
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }

});