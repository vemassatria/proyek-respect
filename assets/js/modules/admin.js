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

    // Fungsi spesifik per halaman
    if (document.getElementById('adminLoginForm')) {
        handleAdminLoginForm();
    }
    if (document.getElementById('competitions-table')) {
        loadCompetitionsTable();
        setupCompetitionModal();
    }
    if (document.getElementById('news-table')) {
        loadNewsTable();
        setupNewsModal();
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
                    // SEGERA LAKUKAN REDIRECT SETELAH SUKSES
                    // Tidak perlu notifikasi atau jeda.
                    // Baris inilah yang membuat redirect terjadi secara langsung.
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


// --- BAGIAN MANAJEMEN LOMBA ---

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
        })
        .finally(() => {
            addCompetitionTableEventListeners();
        });
}

function setupCompetitionModal() {
    const modal = document.getElementById('competition-modal');
    const form = document.getElementById('competition-form');
    const openModalBtn = document.querySelector('#add-competition-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cancelBtn = document.getElementById('cancel-btn');

    if (!modal || !openModalBtn || !closeModalBtn || !form) return;

    const openModal = () => {
        form.reset();
        document.getElementById('competition_id').value = '';
        document.getElementById('modal-title').textContent = 'Tambah Lomba Baru';
        modal.style.display = 'flex';
    };

    const closeModal = () => {
        modal.style.display = 'none';
    };

    openModalBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
    });

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
                Swal.fire('Gagal!', data.message, 'error');
            }
        })
        .catch(error => Swal.fire('Error', 'Terjadi kesalahan pada jaringan.', 'error'))
        .finally(() => {
            submitButton.disabled = false;
            submitButton.textContent = 'Simpan';
        });
    });
}

function addCompetitionTableEventListeners() {
    const table = document.querySelector('#competitions-table');
    if (!table) return;

    table.addEventListener('click', function(event) {
        const target = event.target.closest('button');
        if (!target) return;

        const id = target.dataset.id;

        if (target.classList.contains('btn-edit-comp')) {
            openCompetitionModalForEdit(id);
        } else if (target.classList.contains('btn-delete-comp')) {
            handleDeleteCompetition(id);
        }
    });
}

function openCompetitionModalForEdit(id) {
    fetch(`../api/admin_get_competition_detail.php?id=${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const comp = data.data;
                const form = document.getElementById('competition-form');
                form.reset();
                
                document.getElementById('competition_id').value = comp.id;
                document.getElementById('nama_lomba').value = comp.nama_lomba;
                document.getElementById('deskripsi').value = comp.deskripsi;
                document.getElementById('tanggal_mulai_daftar').value = comp.tanggal_mulai_daftar;
                document.getElementById('tanggal_akhir_daftar').value = comp.tanggal_akhir_daftar;
                document.getElementById('biaya').value = parseFloat(comp.biaya);
                
                document.getElementById('modal-title').textContent = 'Edit Lomba';
                document.getElementById('competition-modal').style.display = 'flex';
            } else {
                Swal.fire('Gagal!', 'Tidak dapat memuat data lomba.', 'error');
            }
        });
}

function handleDeleteCompetition(id) {
    Swal.fire({
        title: 'Anda Yakin?',
        text: "Data lomba ini akan dihapus permanen!",
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


// --- BAGIAN MANAJEMEN BERITA ---

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
        })
        .finally(() => {
            addNewsTableEventListeners();
        });
}

function setupNewsModal() {
    const modal = document.getElementById('news-modal');
    const form = document.getElementById('news-form');
    const openModalBtn = document.getElementById('add-news-btn');
    const closeModalBtn = document.getElementById('close-news-modal-btn');
    const cancelBtn = document.getElementById('cancel-news-btn');

    if (!modal || !openModalBtn || !closeModalBtn || !form) return;

    const openModal = () => {
        form.reset();
        document.getElementById('news_id').value = '';
        document.getElementById('news-modal-title').textContent = 'Tambah Berita Baru';
        modal.style.display = 'flex';
    };

    const closeModal = () => {
        modal.style.display = 'none';
    };

    openModalBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        const newsId = formData.get('news_id');
        const apiUrl = newsId ? '../api/admin_update_news.php' : '../api/admin_add_news.php';
        
        fetch(apiUrl, { method: 'POST', body: formData })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                Swal.fire('Berhasil!', data.message, 'success');
                closeModal();
                loadNewsTable();
            } else {
                Swal.fire('Gagal!', data.message, 'error');
            }
        });
    });
}

function addNewsTableEventListeners() {
    const table = document.getElementById('news-table');
    if (!table) return;

    table.addEventListener('click', function(event) {
        const target = event.target.closest('button');
        if (!target) return;
        
        const id = target.dataset.id;

        if (target.classList.contains('btn-edit-news')) {
            openNewsModalForEdit(id);
        } else if (target.classList.contains('btn-delete-news')) {
            handleDeleteNews(id);
        }
    });
}

function openNewsModalForEdit(id) {
    fetch(`../api/admin_get_news_detail.php?id=${id}`)
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            const news = data.data;
            const form = document.getElementById('news-form');
            form.reset();
            
            document.getElementById('news_id').value = news.id;
            document.getElementById('title').value = news.title;
            document.getElementById('article_link').value = news.article_link;
            document.getElementById('category').value = news.category;
            document.getElementById('is_featured').value = news.is_featured;
            
            document.getElementById('news-modal-title').textContent = 'Edit Berita';
            document.getElementById('news-modal').style.display = 'flex';
        } else {
            Swal.fire('Gagal!', 'Tidak dapat memuat data berita.', 'error');
        }
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