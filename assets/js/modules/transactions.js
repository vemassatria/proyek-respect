/**
 * assets/js/modules/transactions.js
 * Modul untuk menangani halaman daftar transaksi.
 */

function loadTransactions() {
    const transactionContainer = document.getElementById('transaction-list-container');
    if (!transactionContainer) return;

    fetch('api/get_transactions.php')
        .then(response => response.json())
        .then(data => {
            const header = transactionContainer.querySelector('.transaction-header');
            transactionContainer.innerHTML = ''; // Hapus isi lama
            if (header) transactionContainer.appendChild(header); // Tambahkan header kembali

            if (data.status === 'success') {
                data.data.forEach(trx => {
                    transactionContainer.innerHTML += createTransactionRow(trx);
                });
                addEventListenersToUploadButtons();
            } else {
                transactionContainer.innerHTML += `<p class="status-message">${data.message}</p>`;
            }
        }).catch(error => console.error('Kesalahan memuat transaksi:', error));
}

function createTransactionRow(trx) {
    let statusHTML = '';
    let buttonHTML = '';

    const isFree = trx.transaction_code && trx.transaction_code.startsWith('FREE-');

    if (isFree) {
        // Logika status untuk pendaftaran gratis
        if (trx.payment_status === 'Menunggu Validasi') {
            statusHTML = `<div class="status-validating"><span>Menunggu Validasi</span></div>`;
        } else if (trx.payment_status === 'paid') {
            statusHTML = `<div class="status-paid"><span>Terverifikasi</span></div>`;
        } else { // rejected
             statusHTML = `<div class="status-no-paid"><span>Ditolak</span></div>`;
        }
        buttonHTML = `<button class="btn-upload-bukti btn-disabled-custom" disabled>Pendaftaran Gratis</button>`;

    } else {
        // Logika untuk pendaftaran berbayar
        if (trx.payment_status === 'paid') {
            statusHTML = `<div class="status-paid"><span>Paid</span></div>`;
            buttonHTML = `<button class="btn-upload-bukti btn-disabled-custom" disabled>Sudah Dibayar</button>`;
        } else if (trx.payment_status === 'Menunggu Validasi') {
            statusHTML = `<div class="status-validating"><span>Menunggu Validasi</span></div>`;
            buttonHTML = `<button class="btn-upload-bukti btn-disabled-custom" disabled>Menunggu Validasi</button>`;
        } else { // 'pending_payment'
            statusHTML = `<div class="status-no-paid"><span>Belum Dibayar</span></div>`;
            buttonHTML = `<button class="btn-upload-bukti" data-trx-id="${trx.id}">Upload Bukti</button>`;
        }
    }

    return `
        <div class="transaction-row">
            <div>${trx.transaction_code || '#' + trx.id}</div>
            <div>${trx.nama_lomba}</div>
            <div>${buttonHTML}</div>
            <div>Rp ${Number(trx.amount || 0).toLocaleString('id-ID')}</div>
            <div class="status-cell">${statusHTML}</div>
        </div>`;
}

function addEventListenersToUploadButtons() {
    document.querySelectorAll('.btn-upload-bukti:not([disabled])').forEach(button => {
        button.addEventListener('click', function() {
            const transactionId = this.dataset.trxId;
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = ".jpg,.jpeg,.png";

            fileInput.onchange = () => {
                if (fileInput.files.length > 0) {
                    const file = fileInput.files[0];
                    const formData = new FormData();
                    formData.append('proof_file', file);
                    formData.append('transaction_id', transactionId);

                    // Kirim ke API yang benar (asumsi nama file `upload_proof.php` di folder api)
                    fetch('api/upload_proof.php', { method: 'POST', body: formData })
                        .then(response => response.json())
                        .then(data => {
                            alert(data.message);
                            if(data.status === 'success') window.location.reload();
                         })
                        .catch(error => console.error('Error upload bukti:', error));
                }
            };
            fileInput.click();
        });
    });
}

export function initTransactions() {
    loadTransactions();
}