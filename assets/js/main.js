/**
 * Menjalankan semua skrip setelah seluruh konten halaman (DOM) selesai dimuat.
 * Ini adalah titik masuk utama untuk semua interaktivitas JavaScript di situs ini.
 */
document.addEventListener("DOMContentLoaded", function() {

    // =================================================================
    // MODUL 0: PROTEKSI HALAMAN (ROUTE PROTECTION)
    // =================================================================
    const user = JSON.parse(localStorage.getItem('user'));
    const currentPage = window.location.pathname.split("/").pop();
    const publicPages = ['login.html', 'register.html', '']; // '' untuk root path

    if (!user && !publicPages.includes(currentPage)) {
        alert("Anda harus login terlebih dahulu untuk mengakses halaman ini.");
        window.location.href = 'login.html';
        return; // Hentikan eksekusi skrip jika pengguna tidak sah
    }

    // =================================================================
    // MODUL 1: MANAJEMEN DATA PENGGUNA & UI
    // =================================================================
    function loadUserData() {
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
    loadUserData();

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            // Panggil API logout terlebih dahulu
            fetch('api/logout.php')
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        // Jika server mengkonfirmasi logout berhasil:
                        // 1. Hapus data pengguna dari LocalStorage browser.
                        localStorage.removeItem('user');
                        // 2. Arahkan kembali ke halaman login.
                        window.location.href = 'login.html';
                    } else {
                        // Jika karena suatu alasan logout di server gagal
                        alert('Gagal logout. Silakan coba lagi.');
                    }
                })
                .catch(error => {
                    console.error('Error saat logout:', error);
                    alert('Terjadi kesalahan. Tidak bisa logout.');
                });
        });
    }

    // =================================================================
    // MODUL 2: FUNGSI NAVIGASI
    // =================================================================
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    if (navbarPlaceholder) {
        fetch('bottom-navbar.html')
            .then(response => response.ok ? response.text() : Promise.reject('Gagal memuat navbar'))
            .then(data => {
                navbarPlaceholder.innerHTML = data;
                const navLinks = document.querySelectorAll('#navbar-placeholder .nav-link');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === currentPage) {
                        link.classList.add('active');
                    }
                });
            })
            .catch(error => console.error('Kesalahan Navigasi:', error));
    }

    const goToLoginBtn = document.getElementById('goToLogin');
    if (goToLoginBtn) { goToLoginBtn.addEventListener('click', () => { window.location.href = 'login.html'; }); }

    const goToRegisterBtn = document.getElementById('goToRegister');
    if (goToRegisterBtn) { goToRegisterBtn.addEventListener('click', () => { window.location.href = 'register.html'; }); }

    // =================================================================
    // MODUL 3: FUNGSI FORM AUTENTIKASI
    // =================================================================
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

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            fetch('api/register.php', { method: 'POST', body: new FormData(this) })
                .then(response => response.json()).then(data => {
                    alert(data.message);
                    if (data.status === 'success') window.location.href = 'login.html';
                }).catch(error => console.error('Kesalahan Registrasi:', error));
        });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            fetch('api/login.php', { method: 'POST', body: new FormData(this) })
                .then(response => response.json()).then(data => {
                    alert(data.message);
                    if (data.status === 'success') {
                        localStorage.setItem('user', JSON.stringify(data.data));
                        window.location.href = 'index.html';
                    }
                }).catch(error => console.error('Kesalahan Login:', error));
        });
    }

    // =================================================================
    // MODUL 4: PEMUATAN DATA DINAMIS
    // =================================================================

    // --- Memuat Daftar Kompetisi (REVISI UNTUK INFINITE SCROLL MANUAL) ---
     const eventListWrapper = document.querySelector('.event-list-wrapper');
    if (eventListWrapper) {
        const eventListContainer = document.getElementById('event-list-container');
        let isThrottled = false; // Flag untuk throttling

        fetch('api/get_competitions.php')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success' && data.data.length > 0) {
                    // Tampilkan kartu awal HANYA SATU KALI
                    data.data.forEach(competition => {
                        eventListContainer.innerHTML += `
                            <div class="event-card">
                                <div class="event-card-banner"><img src="assets/images/${competition.banner_img}" alt="Banner"></div>
                                <div class="event-card-body">
                                    <h3>${competition.nama_lomba}</h3>
                                    <p class="event-date">${new Date(competition.tanggal_mulai_daftar).toLocaleDateString('id-ID')}</p>
                                    <div class="event-info-item"><p><strong>Biaya</strong></p><p>Rp. ${Number(competition.biaya).toLocaleString('id-ID')}</p></div>
                                    <div class="event-info-item"><p><strong>Baca Juknis</strong></p></div>
                                </div>
                                <div class="event-card-footer">
                                    <span>Klik untuk mendaftar</span>
                                    <a href="event-detail.html?id=${competition.id}" class="btn-daftar">DAFTAR</a>
                                </div>
                            </div>`;
                    });

                    // Gandakan semua kartu yang ada SATU KALI untuk buffer
                    // Ini diperlukan agar ada 'ruang' saat teleportasi
                    eventListContainer.innerHTML += eventListContainer.innerHTML;

                    function handleInfiniteScroll() {
                        // Mencegah fungsi berjalan terlalu sering (throttling)
                        if (isThrottled) return;
                        isThrottled = true;

                        // Gunakan requestAnimationFrame untuk sinkronisasi dengan browser
                        requestAnimationFrame(() => {
                            const maxScrollLeft = eventListContainer.scrollWidth - eventListWrapper.clientWidth;
                            
                            // Jika scroll sampai ke ujung kanan
                            if (eventListWrapper.scrollLeft >= maxScrollLeft - 1) {
                                // Pindahkan posisi scroll ke sepertiga awal secara diam-diam
                                eventListWrapper.scrollLeft = maxScrollLeft / 2 - 1;
                            }
                            // Jika scroll sampai ke ujung kiri
                            else if (eventListWrapper.scrollLeft <= 0) {
                                // Pindahkan posisi scroll ke sepertiga akhir secara diam-diam
                                eventListWrapper.scrollLeft = maxScrollLeft / 2 + 1;
                            }
                            
                            isThrottled = false; // Izinkan pengecekan lagi
                        });
                    }

                    // Tambahkan event listener ke wrapper
                    eventListWrapper.addEventListener('scroll', handleInfiniteScroll);

                } else {
                    eventListContainer.innerHTML = `<p class="status-message">${data.message}</p>`;
                }
            })
            .catch(error => {
                console.error('Kesalahan memuat kompetisi:', error);
                eventListContainer.innerHTML = `<p class="status-message">Gagal memuat data.</p>`;
            });
    }

    const transactionContainer = document.getElementById('transaction-list-container');
    if (transactionContainer) {
        fetch('api/get_transactions.php')
            .then(response => response.json())
            .then(data => {
                const header = transactionContainer.querySelector('.transaction-header');
                transactionContainer.innerHTML = '';
                if(header) transactionContainer.appendChild(header);

                if (data.status === 'success') {
                    data.data.forEach(trx => {
                        const isPaid = trx.payment_status === 'paid';
                        transactionContainer.innerHTML += `
                            <div class="transaction-row">
                                <div>#${trx.id}</div>
                                <div>${trx.nama_lomba}</div>
                                <div><button class="btn-upload-bukti" ${isPaid ? 'disabled' : ''}>Upload Bukti</button></div>
                                <div>Rp. ${Number(trx.amount || 0).toLocaleString('id-ID')}</div>
                                <div class="status-cell">
                                    <div class="${isPaid ? 'status-paid' : 'status-no-paid'}">
                                        <span>${isPaid ? 'Paid' : 'No Paid'}</span>
                                        <div class="progress-bar"><div class="progress" style="width: ${isPaid ? '100%' : '10%'}"></div></div>
                                    </div>
                                </div>
                            </div>`;
                    });
                } else {
                    transactionContainer.innerHTML += `<p class="status-message">${data.message}</p>`;
                }
            }).catch(error => console.error('Kesalahan memuat transaksi:', error));
    }

    // =================================================================
    // MODUL 5: FUNGSI HALAMAN DETAIL & PENDAFTARAN LOMBA
    // =================================================================
    const competitionDetailContainer = document.getElementById('competition-detail-content');
    if (competitionDetailContainer) {
        
        const urlParams = new URLSearchParams(window.location.search);
        const competitionId = urlParams.get('id');

        if (competitionId) {
            // Panggil API untuk mengambil detail
            fetch(`api/get_competition_detail.php?id=${competitionId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        const competition = data.data;

                        // Isi data utama
                        document.getElementById('competition-title').textContent = competition.nama_lomba;
                        document.getElementById('competition-description').textContent = competition.deskripsi;
                        document.getElementById('competition-banner').src = `assets/images/${competition.banner_img}`;

                        // Isi bagian detail (juknis, timeline, dll)
                        const detailsContainer = document.getElementById('details-container');
                        detailsContainer.innerHTML = ''; // Kosongkan dulu
                        competition.details.forEach(detail => {
                            detailsContainer.innerHTML += `
                                <div class="detail-item">
                                    <h3>${detail.detail_title}</h3>
                                    <p>${detail.detail_content}</p>
                                </div>
                            `;
                        });
                    } else {
                        alert(data.message);
                    }
                })
                .catch(error => console.error('Error:', error));
        }
        
        // Logika untuk tombol Gratis & Berbayar
        const btnGratis = document.getElementById('btn-gratis');
        const btnBerbayar = document.getElementById('btn-berbayar');
        if(btnGratis && btnBerbayar) {
             btnGratis.addEventListener('click', () => { if(competitionId) window.location.href = `free-registration.html?id=${competitionId}`; });
             btnBerbayar.addEventListener('click', () => { if(competitionId) window.location.href = `payment.html?id=${competitionId}`; });
        }
    }

    // =================================================================
    // MODUL 6: FUNGSI HALAMAN PEMBAYARAN (CHECKOUT)
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
            let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            totalCostElement.textContent = `Rp ${total.toLocaleString('id-ID')}`;
        }

        function handleItemSelection() {
            document.querySelectorAll('.checkout-checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', function() {
                    const itemData = this.dataset;
                    const itemId = parseInt(itemData.id);
                    cart = cart.filter(ci => !(ci.id === itemId && ci.type === 'competition')); // Hapus dulu
                    if (this.checked) {
                        cart.push({ id: itemId, name: itemData.name, price: parseFloat(itemData.price), quantity: 1, type: itemData.type });
                    }
                    updateTotal();
                });
            });

            document.querySelectorAll('.stepper-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const itemData = this.dataset;
                    const itemId = parseInt(itemData.id);
                    let itemInCart = cart.find(ci => ci.id === itemId && ci.type === 'merchandise');
                    if (this.classList.contains('plus')) {
                        if (itemInCart) itemInCart.quantity++;
                        else cart.push({ id: itemId, name: itemData.name, price: parseFloat(itemData.price), quantity: 1, type: itemData.type });
                    } else if (this.classList.contains('minus') && itemInCart) {
                        itemInCart.quantity--;
                    }
                    cart = cart.filter(ci => ci.quantity > 0);
                    document.getElementById(`quantity-${itemId}`).textContent = itemInCart ? itemInCart.quantity : 0;
                    updateTotal();
                });
            });
        }

        checkoutButton.addEventListener('click', function() {
            if (cart.length === 0) return alert("Keranjang Anda kosong.");
            const checkoutData = { competition_id: competitionId, user_id: user.id, items: cart };

            fetch('api/process_checkout.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(checkoutData)
            })
            .then(response => response.json()).then(data => {
                alert(data.message);
                if (data.status === 'success') window.location.href = 'transactions.html';
            }).catch(error => console.error('Error:', error));
        });

        if (competitionId) {
            fetch(`api/get_payment_options.php?id=${competitionId}`)
                .then(response => response.json()).then(data => {
                    if (data.status === 'success') {
                        data.data.competition_items.forEach(item => {
                            competitionItemsContainer.innerHTML += `
                                <div class="checkout-item">
                                    <label class="checkout-label"><input type="checkbox" class="checkout-checkbox" data-id="${item.id}" data-name="${item.item_name}" data-price="${item.price}" data-type="competition"> ${item.item_name}</label>
                                    <span>Rp ${Number(item.price).toLocaleString('id-ID')}</span>
                                </div>`;
                        });
                        data.data.merchandise.forEach(item => {
                            merchandiseContainer.innerHTML += `
                                <div class="checkout-item merchandise">
                                    <div class="item-info"><p>${item.item_name}</p><span>Rp ${Number(item.price).toLocaleString('id-ID')}</span></div>
                                    <div class="quantity-stepper">
                                        <button class="stepper-btn minus" data-id="${item.id}" data-name="${item.item_name}" data-price="${item.price}" data-type="merchandise">-</button>
                                        <span id="quantity-${item.id}">0</span>
                                        <button class="stepper-btn plus" data-id="${item.id}" data-name="${item.item_name}" data-price="${item.price}" data-type="merchandise">+</button>
                                    </div>
                                </div>`;
                        });
                        handleItemSelection();
                    }
                }).catch(error => console.error('Error:', error));
        }
    }
     // =================================================================
    // MODUL 7: FUNGSI HALAMAN AKUN (Disesuaikan dengan Desain Anda)
    // =================================================================
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        
        // --- Fungsi untuk memuat data profil dari API dan mengisinya ke form ---
        function loadProfileData() {
            fetch('api/get_profile.php')
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        const profile = data.data;
                        
                        // Isi form dengan data yang ada dari database
                        document.getElementById('tingkatan').value = profile.tingkatan || "";
                        document.getElementById('institusi').value = profile.institusi || "";
                        
                        // Update UI untuk setiap dokumen
                        updateDocumentUI('cv', profile.cv_path);
                        updateDocumentUI('portfolio', profile.portfolio_path);
                        updateDocumentUI('ktm', profile.ktm_path);
                    }
                })
                .catch(error => console.error('Error memuat profil:', error));
        }

        // --- Fungsi untuk memperbarui tampilan setiap baris dokumen ---
        function updateDocumentUI(docType, filePath) {
            const statusEl = document.querySelector(`button[data-doctype='${docType}']`).previousElementSibling.querySelector('p');
            const buttonEl = document.querySelector(`button[data-doctype='${docType}']`);

            if (filePath) {
                // Jika file SUDAH diupload
                statusEl.innerHTML = `Dokumen sudah ada. <a href="uploads/documents/${filePath}" target="_blank">Lihat File</a>`;
                statusEl.className = 'status-uploaded';
                buttonEl.textContent = 'Edit';
                buttonEl.classList.add('edit');
            } else {
                // Jika file BELUM diupload
                statusEl.textContent = `Dokumen belum diupload`;
                statusEl.className = '';
                buttonEl.textContent = 'Upload';
                buttonEl.classList.remove('edit');
            }
        }

        // --- Event listener untuk form update profil ---
        profileForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(this);
            fetch('api/update_profile.php', { method: 'POST', body: formData })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                });
        });

        // --- Event listener untuk semua tombol upload ---
        document.querySelectorAll('.btn-upload').forEach(button => {
            button.addEventListener('click', function() {
                const docType = this.dataset.doctype;
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.onchange = () => {
                    if (fileInput.files.length > 0) {
                        const formData = new FormData();
                        formData.append('document_file', fileInput.files[0]);
                        formData.append('document_type', docType);

                        fetch('api/upload_document.php', { method: 'POST', body: formData })
                            .then(response => response.json())
                            .then(data => {
                                alert(data.message);
                                if (data.status === 'success') {
                                    loadProfileData(); // Muat ulang data untuk update UI
                                }
                            });
                    }
                };
                fileInput.click();
            });
        });
        
        // Panggil fungsi utama untuk memuat data saat halaman dibuka
        loadProfileData();
    }
    // =================================================================
    // MODUL 8: FUNGSI UPLOAD DOKUMEN DI HALAMAN AKUN (KODE BARU)
    // =================================================================
    const uploadButtons = document.querySelectorAll('.btn-upload');

    if (uploadButtons.length > 0) {
        // Buat satu elemen input file yang akan kita gunakan berulang kali
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.style.display = 'none'; // Sembunyikan input file ini

        let currentDocumentType = ''; // Untuk menyimpan tipe dokumen yang diupload

        // Tambahkan event listener pada setiap tombol upload
        uploadButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Simpan tipe dokumen dari tombol yang diklik (cv, portfolio, dll)
                currentDocumentType = this.dataset.doctype;
                // Picu klik pada input file yang tersembunyi
                fileInput.click();
            });
        });

        // Tambahkan event listener pada input file
        // Ini akan berjalan SETELAH pengguna memilih file
        fileInput.addEventListener('change', function() {
            // Pastikan pengguna memilih sebuah file
            if (this.files.length > 0) {
                const file = this.files[0];
                const formData = new FormData();

                // Siapkan data untuk dikirim ke API
                formData.append('document_file', file);
                formData.append('document_type', currentDocumentType);

                // Kirim file ke server
                fetch('api/upload_document.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    alert(data.message); // Tampilkan pesan sukses atau gagal dari API
                    if (data.status === 'success') {
                        // Refresh halaman untuk melihat status baru (jika ada)
                        window.location.reload();
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Terjadi kesalahan saat mengunggah file.');
                });
            }
        });
    }

});