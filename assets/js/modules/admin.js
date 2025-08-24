/**
 * assets/js/modules/admin.js
 * Modul untuk menangani semua fungsi di panel admin.
 */

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
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil!',
                        text: data.message,
                        timer: 1500,
                        showConfirmButton: false
                    }).then(() => {
                        window.location.href = 'dashboard.php';
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: data.message
                    });
                }
            })
            .catch(error => {
                console.error('Kesalahan Login Admin:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Kesalahan Jaringan',
                    text: 'Tidak dapat terhubung ke server.'
                });
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.textContent = 'Login';
            });
        });
    }
}

function handleAdminLogout() {
    const logoutButton = document.getElementById('admin-logout-btn');
    if (logoutButton) {
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
}

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
                                <button class="btn-icon btn-edit" title="Edit"><i class="fas fa-pencil-alt"></i></button>
                                <button class="btn-icon btn-delete" title="Hapus"><i class="fas fa-trash-alt"></i></button>
                            </td>
                        </tr>
                    `;
                    tableBody.innerHTML += row;
                });
            } else {
                tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Tidak ada data untuk ditampilkan.</td></tr>';
            }
        })
        .then(() => {
            addTableEventListeners(); // Panggil fungsi ini setelah tabel dimuat
        })
        .catch(error => {
            console.error('Error fetching competitions:', error);
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Gagal memuat data. Periksa koneksi Anda.</td></tr>';
        });
}

function setupCompetitionModal() {
    const modal = document.getElementById('competition-modal');
    const form = document.getElementById('competition-form');
    const openModalBtn = document.querySelector('.toolbar .btn-primary');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cancelBtn = document.getElementById('cancel-btn');

    if (!modal || !openModalBtn || !closeModalBtn || !form) return;

    const openModal = () => {
        form.reset();
        document.getElementById('competition_id').value = ''; // Pastikan ID kosong untuk mode "Tambah"
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
        if (event.target === modal) {
            closeModal();
        }
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        const competitionId = formData.get('competition_id');
        const apiUrl = competitionId ? '../api/admin_update_competition.php' : '../api/admin_add_competition.php';
        
        const submitButton = this.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Menyimpan...';

        fetch(apiUrl, {
            method: 'POST',
            body: formData
        })
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
        .catch(error => {
            console.error('Error submitting form:', error);
            Swal.fire('Error', 'Terjadi kesalahan pada jaringan.', 'error');
        })
        .finally(() => {
            submitButton.disabled = false;
            submitButton.textContent = 'Simpan';
        });
    });
}

function addTableEventListeners() {
    const tableBody = document.querySelector('#competitions-table tbody');
    if (!tableBody) return;

    tableBody.addEventListener('click', function(event) {
        const target = event.target.closest('button');
        if (!target) return;

        const row = target.closest('tr');
        const competitionId = row.cells[0].textContent;

        if (target.classList.contains('btn-delete')) {
            handleDeleteCompetition(competitionId);
        }

        if (target.classList.contains('btn-edit')) {
            const modal = document.getElementById('competition-modal');
            const form = document.getElementById('competition-form');
            form.reset();
            openModalForEdit(competitionId);
        }
    });
}

function openModalForEdit(id) {
    fetch(`../api/admin_get_competition_detail.php?id=${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const comp = data.data;
                const modal = document.getElementById('competition-modal');
                
                document.getElementById('competition_id').value = comp.id;
                document.getElementById('nama_lomba').value = comp.nama_lomba;
                document.getElementById('deskripsi').value = comp.deskripsi;
                document.getElementById('tanggal_mulai_daftar').value = comp.tanggal_mulai_daftar;
                document.getElementById('tanggal_akhir_daftar').value = comp.tanggal_akhir_daftar;
                document.getElementById('biaya').value = parseFloat(comp.biaya);
                
                document.getElementById('modal-title').textContent = 'Edit Lomba';
                modal.style.display = 'flex';
            } else {
                Swal.fire('Gagal!', 'Tidak dapat memuat data lomba.', 'error');
            }
        });
}

function handleDeleteCompetition(id) {
    Swal.fire({
        title: 'Anda Yakin?',
        text: "Data lomba yang dihapus tidak dapat dikembalikan!",
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
            })
            .catch(error => {
                console.error('Error deleting competition:', error);
                Swal.fire('Error', 'Terjadi kesalahan pada jaringan.', 'error');
            });
        }
    });
}

export function initAdmin() {
    // Fungsi ini dipanggil dari main.js jika berada di folder /admin/
    const page = window.location.pathname.split("/").pop();

    handleAdminLogout();

    switch(page) {
        case 'index.php':
            handleAdminLoginForm();
            break;
        case 'dashboard.php':
            // Bisa tambahkan fungsi untuk memuat statistik dashboard di sini
            break;
        case 'manage_competitions.php':
            loadCompetitionsTable();
            setupCompetitionModal();
            break;
    }
}