/**
 * Menjalankan semua skrip setelah seluruh konten halaman (DOM) selesai dimuat.
 * Ini adalah titik masuk utama untuk semua interaktivitas JavaScript di situs ini.
 */
document.addEventListener("DOMContentLoaded", function() {

    // =================================================================
    // MODUL 0: PROTEKSI HALAMAN (ROUTE PROTECTION) - KODE BARU
    // =================================================================
    
    // Ambil data pengguna dari LocalStorage.
    const user = JSON.parse(localStorage.getItem('user'));
    
    // Ambil nama file halaman saat ini (misal: "index.html").
    const currentPage = window.location.pathname.split("/").pop();
    
    // Daftar halaman yang Boleh diakses TANPA login.
    const publicPages = ['login.html', 'register.html'];

    // Cek kondisi:
    // Jika TIDAK ada data user (belum login) DAN halaman saat ini BUKAN halaman publik.
    if (!user && !publicPages.includes(currentPage)) {
        // Peringatkan pengguna dan usir kembali ke halaman login.
        alert("Anda harus login terlebih dahulu untuk mengakses halaman ini.");
        window.location.href = 'login.html';
    }
    
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

    // --- Memuat Daftar Kompetisi di Halaman Utama (REVISI UNTUK LOOPING) ---
const eventListContainer = document.getElementById('event-list-container');
if (eventListContainer) {
    fetch('api/get_competitions.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success' && data.data.length > 0) {
                eventListContainer.innerHTML = ''; // Kosongkan container

                // Fungsi untuk membuat HTML satu kartu
                const createCardHTML = (competition) => {
                    return `
                        <div class="event-card">
                            <div class="event-card-banner"><img src="assets/images/${competition.banner_img}" alt="Event Banner"></div>
                            <div class="event-card-body">
                                <h3>${competition.nama_lomba}</h3>
                                </div>
                            <div class="event-card-footer">
                                <span>Klik untuk mendaftar</span>
                                <a href="event-detail.html?id=${competition.id}" class="btn-daftar">DAFTAR DI SINI</a>
                            </div>
                        </div>`;
                };

                // Ambil data asli
                const originalCards = data.data;

                // Gabungkan data asli dengan duplikatnya untuk efek loop
                const loopedCards = [...originalCards, ...originalCards];

                // Tampilkan semua kartu (asli + duplikat)
                loopedCards.forEach(competition => {
                    eventListContainer.innerHTML += createCardHTML(competition);
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
        // Ambil ID kompetisi dari URL untuk diteruskan ke halaman selanjutnya
        const urlParams = new URLSearchParams(window.location.search);
        const competitionId = urlParams.get('id');

        // Jika tombol 'Gratis' diklik, arahkan ke halaman pendaftaran gratis
        btnGratis.addEventListener('click', function() {
            if (competitionId) {
                window.location.href = `free-registration.html?id=${competitionId}`;
            } else {
                alert("ID Kompetisi tidak ditemukan!");
            }
        });

        // Jika tombol 'Berbayar' diklik, arahkan ke halaman pembayaran
        btnBerbayar.addEventListener('click', function() {
            if (competitionId) {
                window.location.href = `payment.html?id=${competitionId}`;
            } else {
                alert("ID Kompetisi tidak ditemukan!");
            }
        });
    }
    // MODUL 6: FUNGSI HALAMAN PEMBAYARAN (CHECKOUT) - KODE DIPERBARUI
    // =================================================================
    const paymentContainer = document.getElementById('payment-container');
    if (paymentContainer) {
        
        const competitionItemsContainer = document.getElementById('competition-items-container');
        const merchandiseContainer = document.getElementById('merchandise-items-container');
        const totalCostElement = document.getElementById('total-cost');
        const checkoutButton = document.getElementById('process-checkout-btn');

        const urlParams = new URLSearchParams(window.location.search);
        const competitionId = urlParams.get('id');

        let cart = [];

        function updateTotal() {
            let total = 0;
            cart.forEach(item => {
                total += item.price * item.quantity;
            });
            totalCostElement.textContent = `Rp ${total.toLocaleString('id-ID')}`;
        }

        function loadPaymentOptions() {
            if (!competitionId) {
                alert("ID Kompetisi tidak ditemukan.");
                return;
            }

            fetch(`api/get_payment_options.php?id=${competitionId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        // --- PERUBAHAN DI SINI ---
                        // Tampilkan item kompetisi dengan input di dalam label
                        data.data.competition_items.forEach(item => {
                            competitionItemsContainer.innerHTML += `
                                <div class="checkout-item">
                                    <label class="checkout-label">
                                        <input type="checkbox" class="checkout-checkbox" data-id="${item.id}" data-name="${item.item_name}" data-price="${item.price}" data-type="competition">
                                        ${item.item_name}
                                    </label>
                                    <span>Rp ${Number(item.price).toLocaleString('id-ID')}</span>
                                </div>`;
                        });

                        // Tampilkan item merchandise (tidak berubah)
                        data.data.merchandise.forEach(item => {
                            merchandiseContainer.innerHTML += `
                                <div class="checkout-item merchandise">
                                    <div class="item-info">
                                        <p>${item.item_name}</p>
                                        <span>Rp ${Number(item.price).toLocaleString('id-ID')}</span>
                                    </div>
                                    <div class="quantity-stepper">
                                        <button class="stepper-btn minus" data-id="${item.id}" data-name="${item.item_name}" data-price="${item.price}" data-type="merchandise">-</button>
                                        <span id="quantity-${item.id}">0</span>
                                        <button class="stepper-btn plus" data-id="${item.id}" data-name="${item.item_name}" data-price="${item.price}" data-type="merchandise">+</button>
                                    </div>
                                </div>`;
                        });
                        
                        addEventListenersToItems();
                    }
                })
                .catch(error => console.error('Error:', error));
        }

        function addEventListenersToItems() {
            document.querySelectorAll('.checkout-checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', function() {
                    const itemData = this.dataset;
                    const itemId = parseInt(itemData.id);
                    
                    if (this.checked) {
                        cart.push({ id: itemId, name: itemData.name, price: parseFloat(itemData.price), quantity: 1, type: itemData.type });
                    } else {
                        cart = cart.filter(cartItem => !(cartItem.id === itemId && cartItem.type === 'competition'));
                    }
                    updateTotal();
                });
            });

            document.querySelectorAll('.stepper-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const itemData = this.dataset;
                    const itemId = parseInt(itemData.id);
                    let itemInCart = cart.find(cartItem => cartItem.id === itemId && cartItem.type === 'merchandise');

                    if (this.classList.contains('plus')) {
                        if (itemInCart) {
                            itemInCart.quantity++;
                        } else {
                            cart.push({ id: itemId, name: itemData.name, price: parseFloat(itemData.price), quantity: 1, type: itemData.type });
                        }
                    } else if (this.classList.contains('minus')) {
                        if (itemInCart && itemInCart.quantity > 0) {
                            itemInCart.quantity--;
                        }
                    }
                    
                    cart = cart.filter(cartItem => cartItem.quantity > 0);
                    
                    const quantityElement = document.getElementById(`quantity-${itemId}`);
                    if (quantityElement) {
                        const updatedItem = cart.find(cartItem => cartItem.id === itemId && cartItem.type === 'merchandise');
                        quantityElement.textContent = updatedItem ? updatedItem.quantity : 0;
                    }
                    
                    updateTotal();
                });
            });
        }
        
        checkoutButton.addEventListener('click', function() {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                alert("Silakan login terlebih dahulu.");
                return;
            }
            if (cart.length === 0) {
                alert("Keranjang Anda kosong. Silakan pilih item terlebih dahulu.");
                return;
            }

            const checkoutData = {
                competition_id: competitionId,
                user_id: user.id,
                items: cart
            };

            fetch('api/process_checkout.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(checkoutData)
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                if (data.status === 'success') {
                    window.location.href = 'transactions.html';
                }
            })
            .catch(error => console.error('Error:', error));
        });

        loadPaymentOptions();
    }
});