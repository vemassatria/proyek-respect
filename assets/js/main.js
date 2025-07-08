document.addEventListener("DOMContentLoaded", function() {

    // =================================================================
    // MODUL 1: FUNGSI NAVIGASI UTAMA
    // Mengelola pemuatan dan status aktif dari navigasi bawah.
    // =================================================================

    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    if (navbarPlaceholder) {
        /**
         * Memuat konten dari 'bottom-navbar.html' dan menyisipkannya ke dalam placeholder.
         */
        function loadNavbar() {
            fetch('bottom-navbar.html')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Gagal memuat navbar: ' + response.statusText);
                    }
                    return response.text();
                })
                .then(data => {
                    navbarPlaceholder.innerHTML = data;
                    setActiveNavLink(); // Menandai link aktif setelah navbar dimuat
                })
                .catch(error => console.error('Terjadi kesalahan:', error));
        }

        /**
         * Menandai link navigasi yang aktif berdasarkan halaman yang sedang dibuka.
         */
        function setActiveNavLink() {
            const currentPage = window.location.pathname.split("/").pop(); // Mendapatkan nama file (e.g., "index.html")
            const navLinks = document.querySelectorAll('#navbar-placeholder .nav-link');
            
            navLinks.forEach(link => {
                if (link.getAttribute('href') === currentPage) {
                    link.classList.add('active');
                }
            });
        }

        // Panggil fungsi utama untuk memuat navbar
        loadNavbar();
    }


    // =================================================================
    // MODUL 2: FUNGSI AUTENTIKASI (LOGIN & REGISTER)
    // Mengelola perpindahan halaman dan interaksi form.
    // =================================================================

    /**
     * Fungsionalitas untuk tombol yang mengarahkan antar halaman.
     * Contoh: Tombol "Masuk Akun" di halaman register akan mengarah ke login.html.
     */
    const goToLoginBtn = document.getElementById('goToLogin');
    if (goToLoginBtn) {
        goToLoginBtn.addEventListener('click', () => { window.location.href = 'login.html'; });
    }

    const goToRegisterBtn = document.getElementById('goToRegister');
    if (goToRegisterBtn) {
        goToRegisterBtn.addEventListener('click', () => { window.location.href = 'register.html'; });
    }

    /**
     * Fungsionalitas untuk menampilkan dan menyembunyikan password,
     * sekaligus mengubah ikon mata secara dinamis.
     */
    // Definisikan SVG untuk ikon mata terbuka dan tertutup
    const eyeIconOpen = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const eyeIconSlashed = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><line x1="1" y1="1" x2="23" y2="23" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></line></svg>`;

    // Ambil semua tombol toggle password
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');

    // Beri fungsi pada setiap tombol
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const passwordInput = this.previousElementSibling;
            const isPasswordHidden = passwordInput.getAttribute('type') === 'password';

            if (isPasswordHidden) {
                // Jika password tersembunyi -> Tampilkan
                passwordInput.setAttribute('type', 'text');
                this.innerHTML = eyeIconSlashed; // Ubah ke ikon mata tertutup
            } else {
                // Jika password terlihat -> Sembunyikan
                passwordInput.setAttribute('type', 'password');
                this.innerHTML = eyeIconOpen; // Ubah ke ikon mata terbuka
            }
        });
    });

});