// Menjalankan semua skrip setelah konten halaman (DOM) selesai dimuat.
document.addEventListener("DOMContentLoaded", function() {

    // --- FUNGSI UNTUK HALAMAN LOGIN & REGISTER ---
    // Cek apakah elemen-elemen untuk form login/register ada di halaman ini.
    const loginBtn = document.getElementById('login');
    const registerBtn = document.getElementById('register');
    const loginForm = document.querySelector('form.login');
    const registerForm = document.querySelector('form.register');

    // Hanya jalankan kode ini jika elemen-elemen tersebut ditemukan.
    if (loginBtn && registerBtn && loginForm && registerForm) {
        // Event listener untuk tombol Login
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Mencegah link berpindah halaman
            loginForm.style.left = '50%';
            registerForm.style.left = '150%';
            // Mengatur style tombol aktif/non-aktif
            loginBtn.closest('.btn').classList.add('active');
            registerBtn.closest('.btn').classList.remove('active');
        });

        // Event listener untuk tombol Register
        registerBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Mencegah link berpindah halaman
            loginForm.style.left = '-50%';
            registerForm.style.left = '50%';
            // Mengatur style tombol aktif/non-aktif
            registerBtn.closest('.btn').classList.add('active');
            loginBtn.closest('.btn').classList.remove('active');
        });
    }


    // --- FUNGSI UNTUK MEMUAT NAVBAR DI HALAMAN UTAMA ---
    // Cek apakah ada placeholder untuk navbar di halaman ini.
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    
    // Hanya jalankan kode ini jika placeholder navbar ditemukan.
    if (navbarPlaceholder) {
        // Fungsi untuk memuat dan menyisipkan navbar dari file eksternal
        function loadNavbar() {
            fetch('bottom-navbar.html') // Mengambil konten dari bottom-navbar.html
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.text();
                })
                .then(data => {
                    // Masukkan konten navbar ke dalam placeholder
                    navbarPlaceholder.innerHTML = data;
                    // Setelah navbar dimuat, tandai link yang aktif
                    setActiveNavLink();
                })
                .catch(error => console.error('Error loading the navbar:', error));
        }

        // Fungsi untuk menandai link nav yang aktif sesuai halaman yang dibuka
        function setActiveNavLink() {
            // Dapatkan nama file halaman saat ini (cth: "index.html")
            const currentPage = window.location.pathname.split("/").pop();
            
            // Cari semua link di dalam navbar yang sudah dimuat
            const navLinks = document.querySelectorAll('#navbar-placeholder .nav-link');
            
            navLinks.forEach(link => {
                const linkPage = link.getAttribute('href');
                
                // Jika href pada link sama dengan halaman saat ini, tambahkan kelas 'active'
                if (linkPage === currentPage) {
                    link.classList.add('active');
                }
            });
        }

        // Panggil fungsi utama untuk memuat navbar
        loadNavbar();
    }
});