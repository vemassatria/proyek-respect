import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11.10.2/src/sweetalert2.js';

/**
 * Fungsi utama yang dipanggil saat halaman akun dimuat.
 */
export function initAccount() {
    // Pastikan kita berada di halaman akun sebelum menjalankan apa pun
    if (!document.querySelector('.account-card')) return;

    loadProfileData(); // Memuat semua data saat halaman dibuka (Read)
    setupEventListeners(); // Memasang semua listener untuk aksi CRUD
}

/**
 * READ: Mengambil data profil terbaru dari server dan memperbarui tampilan.
 * Ini adalah fungsi kunci yang memastikan data Anda muncul.
 */
function loadProfileData() {
    fetch('api/get_profile.php')
        .then(response => {
            // Cek jika respons dari server adalah error (spt 404 atau 500)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Cek status dari JSON yang dikirim oleh API PHP
            if (data.status === 'success') {
                const profile = data.data;
                
                // Update info dasar
                document.getElementById('display-tingkatan').textContent = profile.tingkatan || 'Belum diatur';
                document.getElementById('display-institusi').textContent = profile.institusi || 'Belum diatur';
                
                // Update foto profil
                const profileImg = document.getElementById('profile-picture-img');
                if (profile.profile_picture_path) {
                    // Cache buster untuk memastikan gambar terbaru yang dimuat
                    profileImg.src = `uploads/profiles/${profile.profile_picture_path}?v=${new Date().getTime()}`;
                } else {
                    profileImg.src = 'assets/images/icon-account-profile.svg';
                }

                // Update UI untuk setiap dokumen
                updateDocumentUI('cv', profile.cv_path);
                updateDocumentUI('portfolio', profile.portfolio_path);
                updateDocumentUI('ktm', profile.ktm_path);
            } else {
                // Jika status dari API adalah 'error' (misal: "Akses ditolak")
                throw new Error(data.message || 'Gagal memuat data profil.');
            }
        })
        .catch(error => {
            // Blok ini akan menangkap semua jenis error (jaringan atau dari API)
            console.error('Error saat memuat profil:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `Tidak dapat memuat data akun Anda. Penyebab: ${error.message}`,
                footer: 'Silakan coba login kembali atau hubungi administrator.'
            });
        });
}

/**
 * Menghubungkan semua tombol dengan fungsinya masing-masing.
 */
function setupEventListeners() {
    // Listener untuk ubah foto profil (Create/Update)
    document.getElementById('change-picture-btn').addEventListener('click', () => {
        document.getElementById('profile-picture-input').click();
    });
    document.getElementById('profile-picture-input').addEventListener('change', handleProfilePictureUpload);

    // Listener untuk tombol edit profil (pop-up) (Update)
    document.getElementById('edit-profile-btn').addEventListener('click', handleEditProfilePopup);

    // Listener untuk semua aksi dokumen (Create/Update/Delete)
    document.querySelectorAll('.document-row').forEach(row => {
        const docType = row.dataset.doctype;
        row.querySelector('.btn-upload').addEventListener('click', () => handleDocumentUpload(docType));
        row.querySelector('.btn-delete').addEventListener('click', () => handleDocumentDelete(docType));
    });
}

/**
 * CREATE/UPDATE: Mengunggah foto profil baru.
 */
function handleProfilePictureUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('profile_picture', file);

    fetch('api/upload_profile_picture.php', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                Swal.fire('Berhasil!', data.message, 'success');
                loadProfileData(); // KUNCI: Muat ulang data setelah berhasil
            } else {
                Swal.fire('Gagal!', data.message, 'error');
            }
        });
}

/**
 * UPDATE: Memunculkan pop-up untuk edit tingkatan & institusi.
 */
async function handleEditProfilePopup() {
    const { value: formValues } = await Swal.fire({
        title: 'Edit Profil',
        html: `
            <select id="swal-tingkatan" class="swal2-select">
                <option value="Siswa">Siswa</option>
                <option value="Mahasiswa">Mahasiswa</option>
            </select>
            <input id="swal-institusi" class="swal2-input" placeholder="Nama Institusi">`,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Simpan',
        cancelButtonText: 'Batal',
        didOpen: () => {
            // Mengisi nilai awal pop-up dengan data saat ini
            const currentTingkatan = document.getElementById('display-tingkatan').textContent;
            const currentInstitusi = document.getElementById('display-institusi').textContent;
            document.getElementById('swal-tingkatan').value = currentTingkatan;
            document.getElementById('swal-institusi').value = currentInstitusi === 'Belum diatur' ? '' : currentInstitusi;
        },
        preConfirm: () => ({
            tingkatan: document.getElementById('swal-tingkatan').value,
            institusi: document.getElementById('swal-institusi').value
        })
    });

    if (formValues) {
        const formData = new FormData();
        formData.append('tingkatan', formValues.tingkatan);
        formData.append('institusi', formValues.institusi);

        fetch('api/update_profile.php', { method: 'POST', body: formData })
            .then(res => res.json())
            .then(data => {
                Swal.fire(data.status === 'success' ? 'Berhasil!' : 'Gagal!', data.message, data.status);
                if (data.status === 'success') loadProfileData(); // KUNCI: Muat ulang data setelah berhasil
            });
    }
}

/**
 * CREATE/UPDATE: Mengunggah dokumen (CV, KTM, dll).
 */
function handleDocumentUpload(docType) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = ".pdf,.jpg,.jpeg,.png";
    fileInput.onchange = () => {
        if (fileInput.files.length > 0) {
            const formData = new FormData();
            formData.append('document_file', fileInput.files[0]);
            formData.append('document_type', docType);

            fetch('api/upload_document.php', { method: 'POST', body: formData })
                .then(res => res.json())
                .then(data => {
                    Swal.fire(data.status === 'success' ? 'Berhasil!' : 'Gagal!', data.message, data.status);
                    if (data.status === 'success') loadProfileData(); // KUNCI: Muat ulang data setelah berhasil
                });
        }
    };
    fileInput.click();
}

/**
 * DELETE: Menghapus dokumen.
 */
function handleDocumentDelete(docType) {
    Swal.fire({
        title: 'Anda yakin?',
        text: "Dokumen ini akan dihapus permanen!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('api/delete_document.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ doc_type: docType })
            })
            .then(res => res.json())
            .then(data => {
                Swal.fire(data.status === 'success' ? 'Dihapus!' : 'Gagal!', data.message, data.status);
                if (data.status === 'success') loadProfileData(); // KUNCI: Muat ulang data setelah berhasil
            });
        }
    });
}

/**
 * Memperbarui tampilan satu baris dokumen.
 */
function updateDocumentUI(docType, filePath) {
    const row = document.querySelector(`.document-row[data-doctype='${docType}']`);
    if (!row) return;
    const statusEl = row.querySelector('.doc-status');
    const uploadBtn = row.querySelector('.btn-upload');
    const deleteBtn = row.querySelector('.btn-delete');

    if (filePath) {
        statusEl.innerHTML = `<a href="api/view_document.php?file=${filePath}" target="_blank">Tersimpan. Klik untuk melihat.</a>`;
        uploadBtn.textContent = 'Ganti';
        deleteBtn.style.display = 'inline-block';
    } else {
        statusEl.textContent = 'Dokumen belum diupload';
        uploadBtn.textContent = 'Upload';
        deleteBtn.style.display = 'none';
    }
}
