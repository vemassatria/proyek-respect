/**
 * assets/js/modules/history.js
 * Modul untuk menangani halaman riwayat kejuaraan.
 */

function loadHistory() {
    const historyContainer = document.getElementById('history-list-container');
    if (!historyContainer) return;

    fetch('api/get_history.php')
        .then(response => response.json())
        .then(data => {
            historyContainer.innerHTML = '';
            if (data.status === 'success') {
                data.data.forEach(item => {
                    const eventDate = new Date(item.tanggal_mulai_daftar).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' });
                    historyContainer.innerHTML += `
                        <div class="history-card">
                            <div class="history-card-header">
                                <h3>${item.nama_lomba}</h3>
                                <p>Tingkatan akan ditampilkan di sini</p>
                                <span>Terdaftar pada: ${eventDate}</span>
                            </div>
                            <div class="history-card-body">
                                <p>Detail kejuaraan dan status kelulusan akan ditampilkan di sini di masa mendatang.</p>
                            </div>
                        </div>
                    `;
                });
            } else {
                historyContainer.innerHTML = `<p class="status-message">${data.message}</p>`;
            }
        }).catch(error => console.error("Error memuat riwayat:", error));
}


export function initHistory() {
    loadHistory();
}