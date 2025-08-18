/**
 * assets/js/modules/account.js
 * Modul untuk menangani semua fungsi di halaman Akun.
 */

function loadProfileData() {
    fetch('api/get_profile.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const profile = data.data;
                document.getElementById('tingkatan').value = profile.tingkatan || "";
                document.getElementById('institusi').value = profile.institusi || "";
                
                updateDocumentUI('cv', profile.cv_path);
                updateDocumentUI('portfolio', profile.portfolio_path);
                updateDocumentUI('ktm', profile.ktm_path);
            }
        })
        .catch(error => console.error('Error memuat profil:', error));
}

function updateDocumentUI(docType, filePath) {
    const row = document.querySelector(`.document-row[data-doctype='${docType}']`);
    if (!row) return;

    const statusEl = row.querySelector('p');
    const buttonEl = row.querySelector('.btn-upload');

    if (filePath) {
        statusEl.innerHTML = `<span class="status-uploaded"><span class="uploaded-file-name">${filePath}</span></span>`;
        buttonEl.textContent = 'Ganti';
        buttonEl.classList.add('edit');
    } else {
        statusEl.textContent = 'Dokumen belum diupload';
        statusEl.className = '';
        buttonEl.textContent = 'Upload';
        buttonEl.classList.remove('edit');
    }
}

function handleProfileFormSubmit() {
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(this);
            fetch('api/update_profile.php', { method: 'POST', body: formData })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                });
        });
    }
}

function handleDocumentUploads() {
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
}

export function initAccount() {
    const accountCard = document.querySelector('.account-card');
    if (accountCard) {
        loadProfileData();
        handleProfileFormSubmit();
        handleDocumentUploads();
    }
}