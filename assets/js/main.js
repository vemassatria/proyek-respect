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
    // MODUL 4: PEMUATAN DATA DINAMIS (DISEMPURNAKAN)
    // =================================================================

    // --- Memuat Daftar Kompetisi di Halaman Utama ---
    const eventListWrapper = document.querySelector('.event-list-wrapper');
    if (eventListWrapper) {
        const eventListContainer = document.getElementById('event-list-container');
        let isScrolling;

        fetch('api/get_competitions.php')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success' && data.data.length > 0) {
                    
                    const createCardHTML = (competition) => {
                        const options = { year: 'numeric', month: 'long', day: 'numeric' };
                        const startDate = new Date(competition.tanggal_mulai_daftar).toLocaleDateString('id-ID', options);
                        const endDate = new Date(competition.tanggal_akhir_daftar).toLocaleDateString('id-ID', options);
                        const shortDescription = competition.deskripsi.length > 100 ? competition.deskripsi.substring(0, 100) + '...' : competition.deskripsi;

                        return `
                            <div class="event-card">
                                <div class="event-card-banner"><img src="assets/images/${competition.banner_img}" alt="${competition.nama_lomba}"></div>
                                <div class="event-card-body">
                                    <h3>${competition.nama_lomba}</h3>
                                    <p class="event-description">${shortDescription}</p>
                                    <div class="event-info-item"><p><strong>Pendaftaran</strong></p><p>${startDate} - ${endDate}</p></div>
                                    <div class="event-info-item"><p><strong>Biaya</strong></p><p>Rp. ${Number(competition.biaya).toLocaleString('id-ID')} atau Gratis</p></div>
                                    <div class="event-info-item"><p><strong>Baca Juknis</strong></p></div>
                                </div>
                                <div class="event-card-footer"><span>Klik untuk mendaftar</span><a href="event-detail.html?id=${competition.id}" class="btn-daftar">DAFTAR</a></div>
                            </div>`;
                    };

                    eventListContainer.innerHTML = '';
                    data.data.forEach(competition => {
                        eventListContainer.innerHTML += createCardHTML(competition);
                    });

                    eventListContainer.innerHTML += eventListContainer.innerHTML;

                    function handleInfiniteScroll() {
                        if (window.clearTimeout(isScrolling)) { /* ... */ }
                        isScrolling = setTimeout(function() {
                            const maxScrollLeft = eventListContainer.scrollWidth - eventListContainer.clientWidth;
                            if (eventListWrapper.scrollLeft >= maxScrollLeft - 1) {
                                eventListWrapper.scrollLeft = 1;
                            } else if (eventListWrapper.scrollLeft <= 0) {
                                eventListWrapper.scrollLeft = maxScrollLeft - 2;
                            }
                        }, 66);
                    }
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

    // --- Memuat Daftar Transaksi di Halaman Transaksi ---
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
                        
                        // --- LOGIKA BARU UNTUK TIGA STATUS ---
                        let statusHTML = '';
                        let buttonState = '';

                        if (trx.payment_status === 'paid') {
                            statusHTML = `<div class="status-paid"><span>Paid</span><div class="progress-bar"><div class="progress" style="width: 100%;"></div></div></div>`;
                            buttonState = 'disabled';
                        } else if (trx.payment_status === 'Menunggu Validasi') {
                            statusHTML = `<div class="status-validating"><span>Menunggu Validasi</span><div class="progress-bar"><div class="progress" style="width: 50%;"></div></div></div>`;
                            buttonState = 'disabled'; // Tombol upload juga nonaktif
                        } else { // Default (pending_payment atau lainnya)
                            statusHTML = `<div class="status-no-paid"><span>No Paid</span><div class="progress-bar"><div class="progress" style="width: 10%;"></div></div><small>Segera bayar</small></div>`;
                            buttonState = '';
                        }

                        transactionContainer.innerHTML += `
                            <div class="transaction-row">
                                <div>#${trx.transaction_code || trx.id}</div>
                                <div>${trx.nama_lomba}</div>
                                <div><button class="btn-upload-bukti" data-trx-id="${trx.id}" ${buttonState}>Upload Bukti</button></div>
                                <div>Rp. ${Number(trx.amount || 0).toLocaleString('id-ID')}</div>
                                <div class="status-cell">${statusHTML}</div>
                            </div>`;
                    });

                    addEventListenersToUploadButtons();

                } else {
                    transactionContainer.innerHTML += `<p class="status-message">${data.message}</p>`;
                }
            }).catch(error => console.error('Kesalahan memuat transaksi:', error));
    }
    
    // --- Fungsi untuk menangani tombol upload bukti ---
    function addEventListenersToUploadButtons() {
        document.querySelectorAll('.btn-upload-bukti').forEach(button => {
            if (button.disabled) return;

            button.addEventListener('click', function() {
                const transactionId = this.dataset.trxId;
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = ".jpg,.jpeg,.png,.pdf";

                fileInput.onchange = () => {
                    if (fileInput.files.length > 0) {
                        const file = fileInput.files[0];
                        const formData = new FormData();
                        formData.append('proof_file', file);
                        formData.append('transaction_id', transactionId);

                        fetch('api/upload_proof.php', { method: 'POST', body: formData })
                            .then(response => response.json())
                            .then(data => { alert(data.message); })
                            .catch(error => console.error('Error:', error));
                    }
                };
                fileInput.click();
            });
        });
    }

    // --- Memuat Riwayat Kejuaraan di Halaman History ---
    const historyContainer = document.getElementById('history-list-container');
    if (historyContainer) {
        fetch('api/get_history.php')
            .then(response => response.json())
            .then(data => {
                historyContainer.innerHTML = ''; // Kosongkan dulu
                if (data.status === 'success') {
                    data.data.forEach(item => {
                        const eventDate = new Date(item.tanggal_mulai_daftar).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' });
                        historyContainer.innerHTML += `
                            <div class="history-card">
                                <div class="history-card-header">
                                    <h3>${item.nama_lomba}</h3>
                                    <p>Mahasiswa - Perguruan Tinggi</p>
                                    <span>${eventDate}</span>
                                </div>
                                <div class="history-card-body">
                                    <p>Detail kejuaraan akan ditampilkan di sini.</p>
                                </div>
                            </div>
                        `;
                    });
                } else {
                    // Tampilkan pesan jika tidak ada history
                    historyContainer.innerHTML = `<p class="status-message">${data.message}</p>`;
                }
            });
    }

    // =================================================================
    // MODUL 5: FUNGSI HALAMAN DETAIL LOMBA (DIROMBAK TOTAL)
    // =================================================================
    const competitionDetailContainer = document.getElementById('competition-detail-content');
    if (competitionDetailContainer) {
        
        const urlParams = new URLSearchParams(window.location.search);
        const competitionId = urlParams.get('id');

        // Pastikan ada ID di URL sebelum melakukan fetch
        if (competitionId) {
            fetch(`api/get_competitions_detail.php?id=${competitionId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        const competition = data.data;

                        // Isi elemen-elemen di halaman dengan data dari API
                        document.getElementById('competition-title').textContent = competition.nama_lomba;
                        document.getElementById('competition-description').textContent = competition.deskripsi;
                        document.getElementById('competition-banner').src = `assets/images/${competition.banner_img}`;

                        // Isi bagian detail (juknis, timeline, dll)
                        const detailsContainer = document.getElementById('details-container');
                        detailsContainer.innerHTML = ''; // Kosongkan dulu untuk mencegah duplikasi

                        if (competition.details && competition.details.length > 0) {
                            competition.details.forEach(detail => {
                                detailsContainer.innerHTML += `
                                    <div class="detail-item">
                                        <h3>${detail.detail_title}</h3>
                                        <p>${detail.detail_content}</p>
                                    </div>
                                `;
                            });
                        } else {
                            detailsContainer.innerHTML = "<p>Informasi detail untuk lomba ini belum tersedia.</p>";
                        }
                    } else {
                        // Jika API mengembalikan error (misal: lomba tidak ditemukan)
                        competitionDetailContainer.innerHTML = `<p>${data.message}</p>`;
                    }
                })
                .catch(error => {
                    console.error('Error memuat detail kompetisi:', error);
                    competitionDetailContainer.innerHTML = "<p>Terjadi kesalahan saat memuat data.</p>";
                });
        } else {
            competitionDetailContainer.innerHTML = "<h1>ID Lomba tidak ditemukan.</h1>";
        }
        
        // --- Event listener untuk tombol Gratis & Berbayar ---
        const btnGratis = document.getElementById('btn-gratis');
        const btnBerbayar = document.getElementById('btn-berbayar');
        if (btnGratis && btnBerbayar) {
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
    const user = JSON.parse(localStorage.getItem('user')); // Ambil data user di awal
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
                cart = cart.filter(ci => !(ci.id === itemId && ci.type === 'competition'));
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
                const quantityElement = document.getElementById(`quantity-${itemId}`);
                if(quantityElement) {
                    const updatedItem = cart.find(ci => ci.id === itemId && ci.type === 'merchandise');
                    quantityElement.textContent = updatedItem ? updatedItem.quantity : 0;
                }
                updateTotal();
            });
        });
    }
    
    // --- Fungsi BARU untuk menampilkan popup ---
    function showPaymentPopup(details) {
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        const totalFormatted = Number(details.total).toLocaleString('id-ID');
        modalOverlay.innerHTML = `
            <div class="modal-content">
                <h2>Instruksi Pembayaran</h2>
                <div class="payment-info">
                    <p>Silakan transfer sejumlah: <strong class="total-payment">Rp ${totalFormatted}</strong></p>
                    <p>Jumlah tersebut sudah termasuk kode unik <strong>${details.kode_unik}</strong> untuk verifikasi.</p>
                    <hr style="margin: 1rem 0;">
                    <p>Ke nomor rekening berikut: <strong>${details.rekening}</strong></p>
                </div>
                <button id="confirm-and-close" class="btn-confirm-payment">Saya Mengerti, Lanjutkan</button>
            </div>`;
        document.body.appendChild(modalOverlay);
        setTimeout(() => modalOverlay.classList.add('active'), 10);
        document.getElementById('confirm-and-close').addEventListener('click', () => {
            window.location.href = 'transactions.html';
        });
    }

    // --- Event listener untuk tombol checkout utama (DIUBAH) ---
    checkoutButton.addEventListener('click', function() {
        if (!user) return alert("Sesi Anda telah berakhir, silakan login kembali.");
        if (cart.length === 0) return alert("Keranjang Anda kosong.");
        
        const checkoutData = { competition_id: competitionId, user_id: user.id, items: cart };

        fetch('api/process_checkout.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(checkoutData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Panggil fungsi popup, bukan alert
                showPaymentPopup(data.paymentDetails);
            } else {
                alert(data.message); // Tampilkan pesan error jika checkout gagal
            }
        }).catch(error => console.error('Error:', error));
    });

    // Fungsi untuk memuat semua opsi pembayaran saat halaman dibuka
    function loadPaymentOptions() {
        if (!competitionId) {
            alert("ID Kompetisi tidak ditemukan.");
            return;
        }
        fetch(`api/get_payment_options.php?id=${competitionId}`)
            .then(response => response.json()).then(data => {
                if (data.status === 'success') {
                    data.data.competition_items.forEach(item => {
                        competitionItemsContainer.innerHTML += `<div class="checkout-item"><label class="checkout-label"><input type="checkbox" class="checkout-checkbox" data-id="${item.id}" data-name="${item.item_name}" data-price="${item.price}" data-type="competition"> ${item.item_name}</label><span>Rp ${Number(item.price).toLocaleString('id-ID')}</span></div>`;
                    });
                    data.data.merchandise.forEach(item => {
                        merchandiseContainer.innerHTML += `<div class="checkout-item merchandise"><div class="item-info"><p>${item.item_name}</p><span>Rp ${Number(item.price).toLocaleString('id-ID')}</span></div><div class="quantity-stepper"><button class="stepper-btn minus" data-id="${item.id}" data-name="${item.item_name}" data-price="${item.price}" data-type="merchandise">-</button><span id="quantity-${item.id}">0</span><button class="stepper-btn plus" data-id="${item.id}" data-name="${item.item_name}" data-price="${item.price}" data-type="merchandise">+</button></div></div>`;
                    });
                    handleItemSelection();
                }
            }).catch(error => console.error('Error:', error));
    }
    
    // Panggil fungsi utama
    loadPaymentOptions();
}
     // =================================================================
    // MODUL 7: FUNGSI HALAMAN AKUN (Disesuaikan dengan Desain Anda)
    // =================================================================
    const accountCard = document.querySelector('.account-card');
    if (accountCard) {

        // --- Fungsi untuk memuat data profil dari API ---
        function loadProfileData() {
            fetch('api/get_profile.php')
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        const profile = data.data;
                        // Isi form dengan data yang ada
                        document.getElementById('tingkatan').value = profile.tingkatan || "";
                        document.getElementById('institusi').value = profile.institusi || "";
                        
                        // Update UI untuk setiap dokumen
                        updateDocumentUI('cv', profile.cv_path, 'CV (Curriculum Vitae)');
                        updateDocumentUI('portfolio', profile.portfolio_path, 'Portofolio');
                        updateDocumentUI('ktm', profile.ktm_path, 'KTM / Kartu Pelajar');
                    }
                })
                .catch(error => console.error('Error memuat profil:', error));
        }

        // --- Fungsi untuk memperbarui tampilan setiap baris dokumen ---
        function updateDocumentUI(docType, filePath, docName) {
            const row = document.querySelector(`.document-row[data-doctype='${docType}']`);
            if (!row) return;

            const statusEl = row.querySelector('p');
            const buttonEl = row.querySelector('.btn-upload');

            if (filePath) {
                statusEl.innerHTML = `<span class="uploaded-file-name">${filePath}</span>`;
                statusEl.className = 'status-uploaded';
                buttonEl.textContent = 'Ganti';
                buttonEl.classList.add('edit');
            } else {
                statusEl.textContent = 'Dokumen belum diupload';
                statusEl.className = '';
                buttonEl.textContent = 'Upload';
                buttonEl.classList.remove('edit');
            }
        }

        // --- Event listener untuk form update profil ---
        const profileForm = document.getElementById('profile-form');
        profileForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(this);
            fetch('api/update_profile.php', { method: 'POST', body: formData })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                });
        });

        // --- Event listener untuk upload dokumen ---
        document.querySelectorAll('.btn-upload').forEach(button => {
            button.addEventListener('click', function() {
                const docType = this.dataset.doctype;
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = ".pdf,.jpg,.jpeg,.png";
                
                fileInput.onchange = () => {
                    if (fileInput.files.length > 0) {
                        const file = fileInput.files[0];
                        const formData = new FormData();
                        formData.append('document_file', file);
                        formData.append('document_type', docType);

                        fetch('api/upload_document.php', { method: 'POST', body: formData })
                            .then(response => response.json())
                            .then(data => {
                                alert(data.message);
                                if (data.status === 'success') {
                                    updateDocumentUI(docType, data.fileName);
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
    // =================================================================
    // MODUL 8: FUNGSI HALAMAN NEWS (PERIKSA BAGIAN INI)
    // =================================================================
    const featuredNewsContainer = document.getElementById('featured-news-container');
    if (featuredNewsContainer) {
        const articlesLeftContainer = document.getElementById('organizational-articles-left');
        const articlesRightContainer = document.getElementById('organizational-articles-right');

        fetch('api/get_news.php')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // --- Fungsi untuk menentukan path gambar ---
                    function getImagePath(imageUrl) {
                        // Cek jika imageUrl adalah link eksternal
                        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
                            return imageUrl; // Gunakan link apa adanya
                        } else {
                            // Jika bukan, anggap ini file lokal
                            return `assets/images/${imageUrl}`;
                        }
                    }
                    
                      // Tampilkan Berita Utama (Featured News)
                    const featuredNews = data.data.featured_news;
                    featuredNewsContainer.innerHTML = ''; 
                    featuredNews.forEach(news => {
                        const imagePath = getImagePath(news.image_url);
                        featuredNewsContainer.innerHTML += `
                            <a href="${news.article_link}" target="_blank" class="featured-card" style="background-image: url('${imagePath}')">
                                <p class="news-title">${news.title}</p>
                            </a>`;
                    });

                    // --- BAGIAN PENTING 2: ARTIKEL ORGANISASI ---
                    const orgArticles = data.data.organizational_articles;
                    articlesLeftContainer.innerHTML = ''; 
                    articlesRightContainer.innerHTML = ''; 

                    const middleIndex = Math.ceil(orgArticles.length / 2);
                    orgArticles.forEach((article, index) => {
                        const shortDescription = article.article_link;
                        
                        // Pastikan ada 'target="_blank"' di sini juga
                        const articleHTML = `
                            <div class="article-item-text-only">
                                <a href="${article.article_link}" target="_blank" class="article-link-wrapper">
                                    <h4 class="article-title">${article.title}</h4>
                                    <p class="article-description">${shortDescription}</p>
                                </a>
                            </div>`;

                        if (index < middleIndex) {
                            articlesLeftContainer.innerHTML += articleHTML;
                        } else {
                            articlesRightContainer.innerHTML += articleHTML;
                        }
                    });
                }
            });
    }
    // =================================================================
// MODUL 9: FUNGSI HALAMAN PENDAFTARAN GRATIS
// =================================================================
const freeRegisForm = document.getElementById('free-regis-form');
if (freeRegisForm) {
    freeRegisForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const urlParams = new URLSearchParams(window.location.search);
        const competitionId = urlParams.get('id');
        const formData = new FormData(this);
        formData.append('competition_id', competitionId);

        fetch('api/submit_free_req.php', {
            method: 'POST',
            body: formData
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
}
});