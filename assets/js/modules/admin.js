/**
 * assets/js/modules/admin.js
 * Modul untuk menangani semua fungsi di panel admin.
 */

// Menggunakan SweetAlert untuk notifikasi yang lebih baik daripada alert()
// Tidak perlu diimpor jika sudah dimuat melalui tag <script> di footer.

// --- FUNGSI GLOBAL & UTAMA ---

export function initAdmin() {
    // Fungsi yang berjalan di semua halaman admin
    handleAdminLogout();
    handleAdminLoginForm();

    // Jalankan fungsi spesifik berdasarkan halaman yang aktif
    const currentPage = window.location.pathname.split("/").pop();

    switch (currentPage) {
        case 'dashboard.php':
            loadDashboardStats();
            break;
        case 'manage_competitions.php':
            loadCompetitionsTable();
            setupCompetitionModal();
            break;
        case 'manage_news.php':
            loadNewsTable();
            setupNewsModal();
            break;
        case 'manage_transactions.php':
            loadTransactionsTable();
            setupTransactionActions();
            break;
        case 'manage_users.php':
            loadUsersTable();
            setupUserActions();
            break;
        case 'verify_free_registrations.php':
            loadFreeVerifications();
            break;
    }
}

// --- BAGIAN AUTENTIKASI ---

function handleAdminLoginForm() {
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const submitButton = this.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Memproses...';

            fetch('../api/admin_login.php', {
                method: 'POST',
                body: new FormData(this)
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    window.location.href = 'dashboard.php';

                } else {
                    // Jika gagal, tampilkan pesan error dan aktifkan kembali tombol
                    Swal.fire({
                        icon: 'error',
                        title: 'Login Gagal',
                        text: data.message
                    });
                    submitButton.disabled = false;
                    submitButton.textContent = 'Login';
                }
            })
            .catch(error => {
                console.error('Kesalahan Login Admin:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Kesalahan Jaringan',
                    text: 'Tidak dapat terhubung ke server.'
                });
                submitButton.disabled = false;
                submitButton.textContent = 'Login';
            });
        });
    }
}

function handleAdminLogout() {
    const logoutButton = document.getElementById('admin-logout-btn');
    if (!logoutButton) return;
    
    logoutButton.addEventListener('click', function(event) {
        event.preventDefault();

        Swal.fire({
            title: 'Anda yakin ingin logout?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, logout!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch('../api/admin_logout.php', { method: 'POST' })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 'success') {
                            window.location.href = 'index.php';
                        }
                    })
                    .catch(error => console.error('Error logging out:', error));
            }
        });
    });
}


// --- BAGIAN MANAJEMEN LOMBA (VERSI PERBAIKAN) ---

function loadCompetitionsTable() {
    const tableBody = document.querySelector('#competitions-table tbody');
    if (!tableBody) return;
    tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Memuat data...</td></tr>';

    fetch('../api/admin_get_competitions.php')
        .then(response => response.json())
        .then(data => {
            tableBody.innerHTML = '';
            if (data.status === 'success' && data.data.length > 0) {
                data.data.forEach(comp => {
                    const row = `
                        <tr>
                            <td>${comp.id}</td>
                            <td>${comp.nama_lomba}</td>
                            <td>${new Date(comp.tanggal_mulai_daftar).toLocaleDateString('id-ID')} - ${new Date(comp.tanggal_akhir_daftar).toLocaleDateString('id-ID')}</td>
                            <td>Rp ${Number(comp.biaya).toLocaleString('id-ID')}</td>
                            <td class="action-buttons">
                                <button class="btn-icon btn-edit-comp" data-id="${comp.id}" title="Edit"><i class="fas fa-pencil-alt"></i></button>
                                <button class="btn-icon btn-delete-comp" data-id="${comp.id}" title="Hapus"><i class="fas fa-trash-alt"></i></button>
                            </td>
                        </tr>
                    `;
                    tableBody.innerHTML += row;
                });
            } else {
                tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Tidak ada data untuk ditampilkan.</td></tr>';
            }
        })
        .catch(error => {
            console.error('Error fetching competitions:', error);
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Gagal memuat data.</td></tr>';
        });
}

function setupCompetitionModal() {
    const modal = document.getElementById('competition-modal');
    const form = document.getElementById('competition-form');
    // Perbaikan Kritis: Tambahkan '#' pada selector
    const openModalBtn = document.querySelector('#add-competition-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const table = document.querySelector('#competitions-table');

    if (!modal || !openModalBtn || !form || !table) return;

    // Fungsi untuk membuka modal (bisa untuk Tambah atau Edit)
    const openModal = (isEdit = false, data = {}) => {
        form.reset();
        document.getElementById('competition_id').value = isEdit ? data.id : '';
        document.getElementById('modal-title').textContent = isEdit ? `Edit Lomba #${data.id}` : 'Tambah Lomba Baru';
        
        if (isEdit) {
            // Isi form dengan data yang ada
            document.getElementById('nama_lomba').value = data.nama_lomba;
            document.getElementById('deskripsi').value = data.deskripsi;
            document.getElementById('tanggal_mulai_daftar').value = data.tanggal_mulai_daftar;
            document.getElementById('tanggal_akhir_daftar').value = data.tanggal_akhir_daftar;
            document.getElementById('biaya').value = parseFloat(data.biaya);
        }
        modal.style.display = 'flex';
    };

    const closeModal = () => {
        modal.style.display = 'none';
    };

    // Event listener untuk tombol utama "Tambah Lomba Baru"
    openModalBtn.addEventListener('click', () => openModal(false));
    
    // Event listener untuk menutup modal
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
    });

    // SATU event listener untuk semua aksi di dalam tabel (Edit & Hapus)
    table.addEventListener('click', function(event) {
        const target = event.target.closest('button');
        if (!target) return;
        const id = target.dataset.id;

        if (target.classList.contains('btn-edit-comp')) {
            fetch(`../api/admin_get_competition_detail.php?id=${id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.status === 'success') {
                        openModal(true, data.data); // Buka modal dalam mode Edit
                    } else {
                        Swal.fire('Gagal!', 'Data lomba tidak ditemukan.', 'error');
                    }
                });
        } else if (target.classList.contains('btn-delete-comp')) {
            handleDeleteCompetition(id);
        }
    });

    // Event listener untuk submit form (menangani Tambah dan Update sekaligus)
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        const competitionId = formData.get('competition_id');
        const apiUrl = competitionId ? '../api/admin_update_competition.php' : '../api/admin_add_competition.php';
        
        const submitButton = this.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Menyimpan...';

        fetch(apiUrl, { method: 'POST', body: formData })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    Swal.fire('Berhasil!', data.message, 'success');
                    closeModal();
                    loadCompetitionsTable();
                } else {
                    Swal.fire('Gagal!', data.message || 'Terjadi kesalahan.', 'error');
                }
            })
            .catch(error => Swal.fire('Error', 'Terjadi kesalahan pada jaringan.', 'error'))
            .finally(() => {
                submitButton.disabled = false;
                submitButton.textContent = 'Simpan';
            });
    });
}

function handleDeleteCompetition(id) {
    Swal.fire({
        title: 'Anda Yakin?',
        text: "Data ini akan dihapus permanen!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('../api/admin_delete_competition.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: id })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    Swal.fire('Terhapus!', data.message, 'success');
                    loadCompetitionsTable();
                } else {
                    Swal.fire('Gagal!', data.message, 'error');
                }
            });
        }
    });
}
// --- BAGIAN MANAJEMEN BERITA (VERSI PERBAIKAN) ---

function loadNewsTable() {
    const tableBody = document.querySelector('#news-table tbody');
    if (!tableBody) return;
    tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Memuat data...</td></tr>';

    fetch('../api/admin_get_news.php')
        .then(response => response.json())
        .then(data => {
            tableBody.innerHTML = '';
            if (data.status === 'success' && data.data.length > 0) {
                data.data.forEach(news => {
                    const row = `
                        <tr>
                            <td>${news.id}</td>
                            <td>${news.title}</td>
                            <td>${news.category}</td>
                            <td>${new Date(news.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                            <td class="action-buttons">
                                <button class="btn-icon btn-edit-news" data-id="${news.id}" title="Edit"><i class="fas fa-pencil-alt"></i></button>
                                <button class="btn-icon btn-delete-news" data-id="${news.id}" title="Hapus"><i class="fas fa-trash-alt"></i></button>
                            </td>
                        </tr>
                    `;
                    tableBody.innerHTML += row;
                });
            } else {
                tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Tidak ada berita untuk ditampilkan.</td></tr>';
            }
        })
        .catch(error => {
            console.error('Error fetching news:', error);
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Gagal memuat data.</td></tr>';
        });
}

function setupNewsModal() {
    const modal = document.getElementById('news-modal');
    const form = document.getElementById('news-form');
    const openModalBtn = document.getElementById('add-news-btn');
    const closeModalBtn = document.getElementById('close-news-modal-btn');
    const cancelBtn = document.getElementById('cancel-news-btn');
    const table = document.getElementById('news-table');

    if (!modal || !openModalBtn || !form || !table) return;

    // Fungsi terpusat untuk membuka modal
    const openModal = (isEdit = false, data = {}) => {
        form.reset();
        document.getElementById('news_id').value = isEdit ? data.id : '';
        document.getElementById('news-modal-title').textContent = isEdit ? `Edit Berita #${data.id}` : 'Tambah Berita Baru';
        
        if (isEdit) {
            document.getElementById('title').value = data.title;
            document.getElementById('article_link').value = data.article_link;
            document.getElementById('category').value = data.category;
            document.getElementById('is_featured').value = data.is_featured;
        }
        modal.style.display = 'flex';
    };

    const closeModal = () => {
        modal.style.display = 'none';
    };

    // Event listener untuk tombol "Tambah Berita Baru"
    openModalBtn.addEventListener('click', () => openModal(false));
    
    // Event listener untuk menutup modal
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
    });

    // SATU event listener untuk semua aksi di dalam tabel
    table.addEventListener('click', function(event) {
        const target = event.target.closest('button');
        if (!target) return;
        
        const id = target.dataset.id;
        if (target.classList.contains('btn-edit-news')) {
            fetch(`../api/admin_get_news_detail.php?id=${id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.status === 'success') {
                        openModal(true, data.data);
                    } else {
                        Swal.fire('Gagal!', 'Data berita tidak ditemukan.', 'error');
                    }
                });
        } else if (target.classList.contains('btn-delete-news')) {
            handleDeleteNews(id);
        }
    });

    // Event listener untuk submit form (menangani Tambah & Update)
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        const newsId = formData.get('news_id');
        const apiUrl = newsId ? '../api/admin_update_news.php' : '../api/admin_add_news.php';
        
        const submitButton = this.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Menyimpan...';

        fetch(apiUrl, { method: 'POST', body: formData })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    Swal.fire('Berhasil!', data.message, 'success');
                    closeModal();
                    loadNewsTable();
                } else {
                    Swal.fire('Gagal!', data.message || 'Terjadi kesalahan.', 'error');
                }
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.textContent = 'Simpan';
            });
    });
}

function handleDeleteNews(id) {
    Swal.fire({
        title: 'Anda Yakin?',
        text: "Berita ini akan dihapus permanen!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('../api/admin_delete_news.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: id })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    Swal.fire('Terhapus!', data.message, 'success');
                    loadNewsTable();
                } else {
                    Swal.fire('Gagal!', data.message, 'error');
                }
            });
        }
    });
}

function loadTransactionsTable() {
    const tableBody = document.querySelector('#transactions-table tbody');
    if (!tableBody) return;
    tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Memuat data...</td></tr>';

    fetch('../api/admin_get_transactions.php')
        .then(response => response.json())
        .then(data => {
            tableBody.innerHTML = '';
            if (data.status === 'success' && data.data.length > 0) {
                data.data.forEach(trx => {
                    let statusClass = '';
                    if (trx.payment_status === 'paid') statusClass = 'status-paid';
                    if (trx.payment_status === 'pending_payment') statusClass = 'status-pending';
                    if (trx.payment_status === 'Menunggu Validasi') statusClass = 'status-validating';
                    if (trx.payment_status === 'rejected') statusClass = 'status-rejected';

                    const row = `
                        <tr>
                            <td>${trx.transaction_code || `#${trx.id}`}</td>
                            <td>${trx.user_name}</td>
                            <td>${trx.competition_name}</td>
                            <td>Rp ${Number(trx.amount).toLocaleString('id-ID')}</td>
                            <td><span class="status-badge ${statusClass}">${trx.payment_status.replace('_', ' ')}</span></td>
                            <td>
                                ${trx.proof_path && trx.proof_path !== 'NULL' ? `<button class="btn-secondary btn-view-proof" data-proof="${trx.proof_path}">Lihat</button>` : 'N/A'}
                            </td>
                            <td class="action-buttons">
                                ${trx.payment_status !== 'paid' ? `<button class="btn-icon btn-approve" data-id="${trx.id}" title="Setujui"><i class="fas fa-check"></i></button>` : ''}
                                ${trx.payment_status !== 'rejected' ? `<button class="btn-icon btn-reject" data-id="${trx.id}" title="Tolak"><i class="fas fa-times"></i></button>` : ''}
                            </td>
                        </tr>
                    `;
                    tableBody.innerHTML += row;
                });
            } else {
                tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Tidak ada transaksi.</td></tr>';
            }
        });
}

function setupTransactionActions() {
    const table = document.getElementById('transactions-table');
    const modal = document.getElementById('proof-modal');
    const closeModalBtn = document.getElementById('close-proof-modal-btn');
    const proofImage = document.getElementById('proof-image');

    if (!table || !modal) return;
    
    const closeModal = () => modal.style.display = 'none';
    closeModalBtn.addEventListener('click', closeModal);

    table.addEventListener('click', function(event) {
        const target = event.target.closest('button');
        if (!target) return;

        const id = target.dataset.id;
        
        if (target.classList.contains('btn-view-proof')) {
            proofImage.src = `../uploads/proofs/${target.dataset.proof}`;
            modal.style.display = 'flex';
        } else if (target.classList.contains('btn-approve')) {
            updateTransactionStatus(id, 'paid');
        } else if (target.classList.contains('btn-reject')) {
            updateTransactionStatus(id, 'rejected');
        }
    });
}

function updateTransactionStatus(id, status, callback) {
    const actionText = status === 'paid' ? 'menyetujui' : 'menolak';
    Swal.fire({
        title: `Anda yakin ingin ${actionText} transaksi ini?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Ya, Lanjutkan',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('../api/admin_update_transaction_status.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: id, status: status })
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    Swal.fire('Berhasil!', data.message, 'success');
                    if (callback) callback();
                } else {
                    Swal.fire('Gagal!', data.message, 'error');
                }
            });
        }
    });
}

function loadFreeVerifications() {
    const container = document.getElementById('verification-list');
    if (!container) return;
    container.innerHTML = '<p style="text-align:center;">Memuat pendaftaran...</p>';

    fetch('../api/admin_get_free_registrations.php')
        .then(res => res.json())
        .then(data => {
            container.innerHTML = '';
            if (data.status === 'success' && data.data.length > 0) {
                data.data.forEach(reg => {
                    // Membuat daftar bukti untuk setiap pendaftaran
                    let proofsHTML = reg.proofs.map(p => `
                        <div class="proof-item">
                            <strong>${p.requirement_type.replace('req_', '')}:</strong>
                            <a href="../uploads/documents/${p.proof_path}" target="_blank" class="proof-link">Lihat Bukti</a>
                        </div>
                    `).join('');

                    const card = `
                        <div class="verification-card">
                            <div class="verification-header">
                                <span>ID Pendaftaran: <strong>#${reg.id}</strong></span>
                                <span>${reg.user_name} - <i>${reg.nama_lomba}</i></span>
                            </div>
                            <div class="verification-body">
                                ${proofsHTML}
                            </div>
                            <div class="verification-footer">
                                <button class="btn-secondary btn-reject-free" data-id="${reg.id}">Tolak</button>
                                <button class="btn-primary btn-approve-free" data-id="${reg.id}">Setujui</button>
                            </div>
                        </div>
                    `;
                    container.innerHTML += card;
                });
                
                // Pasang event listener untuk tombol Setujui/Tolak
                setupFreeVerificationActions();

            } else {
                container.innerHTML = '<p style="text-align:center;">Tidak ada pendaftaran gratis yang perlu diverifikasi saat ini.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching free registrations:', error);
            container.innerHTML = '<p style="text-align:center; color: red;">Gagal memuat data.</p>';
        });
}

function setupFreeVerificationActions() {
    const container = document.getElementById('verification-list');
    if (!container) return;

    container.addEventListener('click', function(event) {
        const target = event.target.closest('button');
        if (!target) return;

        const id = target.dataset.id;
        if (target.classList.contains('btn-approve-free')) {
            // Kita gunakan API yang sama dengan verifikasi transaksi biasa
            updateTransactionStatus(id, 'paid', loadFreeVerifications); // 'paid' menandakan terverifikasi
        } else if (target.classList.contains('btn-reject-free')) {
            updateTransactionStatus(id, 'rejected', loadFreeVerifications);
        }
    });
}

//usersss//

function loadUsersTable() {
    const tableBody = document.querySelector('#users-table tbody');
    if (!tableBody) return;
    tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Memuat data pengguna...</td></tr>';

    fetch('../api/admin_get_users.php')
        .then(response => response.json())
        .then(data => {
            tableBody.innerHTML = '';
            if (data.status === 'success' && data.data.length > 0) {
                data.data.forEach(user => {
                    // BARU: Menambahkan tombol Ubah Role
                    const row = `
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.nama}</td>
                            <td>${user.email}</td>
                            <td>${user.tingkatan || 'N/A'}</td>
                            <td>${user.institusi || 'N/A'}</td>
                            <td><span class="role-badge role-${user.role}">${user.role}</span></td>
                            <td class="action-buttons">
                                <button class="btn-icon btn-view-user" data-id="${user.id}" title="Lihat Detail"><i class="fas fa-eye"></i></button>
                                <button class="btn-icon btn-edit-role" data-id="${user.id}" data-current-role="${user.role}" title="Ubah Role"><i class="fas fa-user-shield"></i></button>
                            </td>
                        </tr>
                    `;
                    tableBody.innerHTML += row;
                });
            } else {
                tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Tidak ada pengguna terdaftar.</td></tr>';
            }
        });
}
function setupUserActions() {
    const tableBody = document.querySelector('#users-table tbody');
    if (!tableBody) return;

    tableBody.addEventListener('click', function(event) {
        const target = event.target.closest('button');
        if (!target) return;

        const userId = target.dataset.id;

        if (target.classList.contains('btn-edit-role')) {
            const currentRole = target.dataset.currentRole;
            handleChangeUserRole(userId, currentRole);
        }
        // Aksi lain seperti 'Lihat Detail' bisa ditambahkan di sini
    });
}

// FUNGSI BARU: Untuk proses ubah role
function handleChangeUserRole(userId, currentRole) {
    Swal.fire({
        title: 'Ubah Role Pengguna',
        html: `Pilih role baru untuk pengguna ID: <strong>${userId}</strong>`,
        input: 'select',
        inputOptions: {
            'user': 'User',
            'admin': 'Admin'
        },
        inputValue: currentRole,
        showCancelButton: true,
        confirmButtonText: 'Simpan Perubahan',
        cancelButtonText: 'Batal',
        inputValidator: (value) => {
            if (!value) {
                return 'Anda perlu memilih sebuah role!'
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const newRole = result.value;
            fetch('../api/admin_update_user_role.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, new_role: newRole })
            })
            .then(response => {
                // Penanganan error yang lebih baik
                if (!response.ok) {
                    return response.json().then(err => { throw new Error(err.message) });
                }
                return response.json();
            })
            .then(data => {
                if (data.status === 'success') {
                    Swal.fire('Berhasil!', data.message, 'success');
                    loadUsersTable(); // Muat ulang tabel untuk melihat perubahan
                }
            })
            .catch(error => {
                Swal.fire('Gagal!', error.message, 'error');
            });
        }
    });
}
function loadDashboardStats() {
    const statsContainer = document.querySelector('.dashboard-stats');
    if (!statsContainer) return;

    fetch('../api/admin_get_dashboard_stats.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const stats = data.data;

                // Update kartu Total Pengguna
                statsContainer.querySelector('.stat-card:nth-child(1) span').textContent = stats.total_users;
                
                // Update kartu Total Lomba
                statsContainer.querySelector('.stat-card:nth-child(2) span').textContent = stats.total_competitions;

                // Update kartu Transaksi Pending
                statsContainer.querySelector('.stat-card:nth-child(3) span').textContent = stats.pending_transactions;

                // Update kartu Total Pendapatan
                const revenue = Number(stats.total_revenue).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 });
                statsContainer.querySelector('.stat-card:nth-child(4) span').textContent = revenue;
            }
        })
        .catch(error => {
            console.error('Error fetching dashboard stats:', error);
            statsContainer.querySelectorAll('.stat-info span').forEach(span => {
                span.textContent = 'Error';
            });
        });
}