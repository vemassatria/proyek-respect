/**
 * Menjalankan semua skrip setelah seluruh konten halaman (DOM) selesai dimuat.
 * Ini adalah titik masuk utama untuk semua interaktivitas JavaScript di situs ini.
 */
document.addEventListener("DOMContentLoaded", function() {

    // =================================================================
    // MODUL 1: MANAJEMEN DATA PENGGUNA (LocalStorage)
    // Mengelola data pengguna yang login dan memperbarui UI.
    // =================================================================
    
    /**
     * Memeriksa LocalStorage dan memperbarui elemen halaman dengan data pengguna.
     */
    function loadUserData() {
        const userData = JSON.parse(localStorage.getItem('user'));
        
        if (userData) {
            // Perbarui sapaan di halaman utama
            const welcomeMessage = document.getElementById('welcome-message');
            if (welcomeMessage) {
                welcomeMessage.textContent = `HAI ${userData.nama.toUpperCase()}!`;
            }

            // Perbarui nama di halaman akun
            const accountName = document.getElementById('account-name');
            if (accountName) {
                accountName.textContent = userData.nama;
            }
        }
    }

    // Panggil fungsi ini di setiap halaman saat dimuat
    loadUserData();

    // Logika untuk tombol Logout
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.removeItem('user');
            // Di masa depan, panggil API logout di sini sebelum redirect
            window.location.href = 'login.html';
        });
    }


    // =================================================================
    // MODUL 2: FUNGSI NAVIGASI
    // Mengelola pemuatan navbar dan perpindahan antar halaman login/register.
    // =================================================================
    
    // Memuat navbar
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    if (navbarPlaceholder) {
        fetch('bottom-navbar.html')
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

    // Navigasi dari form register ke login
    const goToLoginBtn = document.getElementById('goToLogin');
    if (goToLoginBtn) {
        goToLoginBtn.addEventListener('click', () => { window.location.href = 'login.html'; });
    }

    // Navigasi dari form login ke register
    const goToRegisterBtn = document.getElementById('goToRegister');
    if (goToRegisterBtn) {
        goToRegisterBtn.addEventListener('click', () => { window.location.href = 'register.html'; });
    }


    // =================================================================
    // MODUL 3: FUNGSI FORM AUTENTIKASI
    // Mengelola toggle password dan pengiriman form login/register ke API.
    // =================================================================

    // --- Logika Toggle Password ---
    const eyeIconOpen = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const eyeIconSlashed = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><line x1="1" y1="1" x2="23" y2="23" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></line></svg>`;
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const passwordInput = this.previousElementSibling;
            const isPasswordHidden = passwordInput.type === 'password';
            passwordInput.type = isPasswordHidden ? 'text' : 'password';
            this.innerHTML = isPasswordHidden ? eyeIconSlashed : eyeIconOpen;
        });
    });

    // --- Pengiriman Form Registrasi ---
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            fetch('api/register.php', { method: 'POST', body: new FormData(this) })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                    if (data.status === 'success') window.location.href = 'login.html';
                })
                .catch(error => console.error('Kesalahan Registrasi:', error));
        });
    }

    // --- Pengiriman Form Login ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            fetch('api/login.php', { method: 'POST', body: new FormData(this) })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                    if (data.status === 'success') {
                        localStorage.setItem('user', JSON.stringify(data.data));
                        window.location.href = 'index.html';
                    }
                })
                .catch(error => console.error('Kesalahan Login:', error));
        });
    }


    // =================================================================
    // MODUL 4: PEMUATAN DATA DINAMIS
    // Mengambil data dari API untuk ditampilkan di halaman.
    // =================================================================

    // --- Memuat Daftar Kompetisi di Halaman Utama ---
    const eventListContainer = document.getElementById('event-list-container');
    if (eventListContainer) {
        fetch('api/get_competitions.php')
            .then(response => response.json())
            .then(data => {
                eventListContainer.innerHTML = ''; // Kosongkan container
                if (data.status === 'success') {
                    data.data.forEach(competition => {
                        eventListContainer.innerHTML += `
                            <div class="event-card">
                                <div class="event-card-banner"><img src="assets/images/${competition.banner_img}" alt="Event Banner"></div>
                                <div class="event-card-body">
                                    <h3>${competition.nama_lomba}</h3>
                                    <p class="event-date">${new Date(competition.tanggal_mulai_daftar).toLocaleDateString('id-ID')} - ${new Date(competition.tanggal_akhir_daftar).toLocaleDateString('id-ID')}</p>
                                    <div class="event-info-item">
                                        <p><strong>Biaya</strong></p>
                                        <p>Rp. ${Number(competition.biaya).toLocaleString('id-ID')} atau Gratis</p>
                                    </div>
                                    <div class="event-info-item"><p><strong>Baca Juknis</strong></p></div>
                                </div>
                                <div class="event-card-footer">
                                    <span>Klik untuk mendaftar</span>
                                    <a href="event-detail.html?id=${competition.id}" class="btn-daftar">DAFTAR DI SINI</a>
                                </div>
                            </div>`;
                    });
                } else {
                    eventListContainer.innerHTML = `<p class="status-message">${data.message}</p>`;
                }
            })
            .catch(error => {
                console.error('Kesalahan memuat kompetisi:', error);
                eventListContainer.innerHTML = `<p class="status-message">Gagal memuat data. Periksa koneksi Anda.</p>`;
            });
    }

    // --- Memuat Daftar Transaksi di Halaman Transaksi ---
    const transactionContainer = document.getElementById('transaction-list-container');
    if (transactionContainer) {
        fetch('api/get_transactions.php')
            .then(response => response.json())
            .then(data => {
                const header = transactionContainer.querySelector('.transaction-header');
                transactionContainer.innerHTML = ''; // Kosongkan semua
                transactionContainer.appendChild(header); // Kembalikan header

                if (data.status === 'success') {
                    data.data.forEach(trx => {
                        const isPaid = trx.payment_status === 'paid';
                        const statusClass = isPaid ? 'status-paid' : 'status-no-paid';
                        const statusText = isPaid ? 'Paid' : 'No Paid';
                        const buttonState = isPaid ? 'disabled' : '';
                        
                        transactionContainer.innerHTML += `
                            <div class="transaction-row">
                                <div>#${trx.id}</div>
                                <div>${trx.nama_lomba}</div>
                                <div><button class="btn-upload-bukti ${buttonState}" ${buttonState}>Upload Bukti</button></div>
                                <div>Rp. ${Number(trx.amount || 0).toLocaleString('id-ID')}</div>
                                <div class="status-cell">
                                    <div class="${statusClass}">
                                        <span>${statusText}</span>
                                        <div class="progress-bar"><div class="progress" style="width: ${isPaid ? '100%' : '10%'}"></div></div>
                                        ${!isPaid ? '<small>Segera bayar</small>' : ''}
                                    </div>
                                </div>
                            </div>`;
                    });
                } else {
                    transactionContainer.innerHTML += `<p class="status-message">${data.message}</p>`;
                }
            })
            .catch(error => {
                console.error('Kesalahan memuat transaksi:', error);
                transactionContainer.innerHTML += `<p class="status-message">Gagal memuat data. Periksa koneksi Anda.</p>`;
            });
    }

    // =================================================================
    // MODUL 5: FUNGSI HALAMAN DETAIL & PENDAFTARAN LOMBA
    // =================================================================
    const btnGratis = document.getElementById('btn-gratis');
    const btnBerbayar = document.getElementById('btn-berbayar');
    if (btnGratis && btnBerbayar) {
        const urlParams = new URLSearchParams(window.location.search);
        const competitionId = urlParams.get('id');
        const user = JSON.parse(localStorage.getItem('user'));

        function registerToCompetition() {
            if (!user) {
                alert("Anda harus login terlebih dahulu untuk mendaftar.");
                window.location.href = 'login.html';
                return;
            }
            if (!competitionId) {
                alert("ID Kompetisi tidak ditemukan. Kembali ke halaman utama.");
                window.location.href = 'index.html';
                return;
            }

            const formData = new FormData();
            formData.append('user_id', user.id);
            formData.append('competition_id', competitionId);
            
            fetch('api/register_competition.php', { method: 'POST', body: formData })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                    if (data.status === 'success') {
                        window.location.href = 'transactions.html';
                    }
                })
                .catch(error => console.error('Kesalahan Pendaftaran Lomba:', error));
        }

        btnGratis.addEventListener('click', registerToCompetition);
        btnBerbayar.addEventListener('click', registerToCompetition);
    }

});