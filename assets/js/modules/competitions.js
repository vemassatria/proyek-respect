/**
 * assets/js/modules/competitions.js
 * Modul untuk menangani semua fungsi terkait kompetisi.
 */

function loadCompetitionList() {
    const eventListContainer = document.getElementById('event-list-container');
    if (!eventListContainer) return;

    fetch('api/get_competitions.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success' && data.data.length > 0) {
                eventListContainer.innerHTML = '';
                data.data.forEach(competition => {
                    eventListContainer.innerHTML += createCompetitionCard(competition);
                });
            } else {
                eventListContainer.innerHTML = `<p class="status-message">${data.message}</p>`;
            }
        })
        .catch(error => {
            console.error('Kesalahan memuat kompetisi:', error);
            eventListContainer.innerHTML = `<p class="status-message">Gagal memuat data.</p>`;
        });
}

function createCompetitionCard(competition) {
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
            </div>
            <div class="event-card-footer">
                <span>Klik untuk mendaftar</span>
                <a href="event-detail.php?id=${competition.id}" class="btn-daftar">DAFTAR</a>
            </div>
        </div>`;
}

function loadCompetitionDetail() {
    const competitionDetailContainer = document.getElementById('competition-detail-content');
    if (!competitionDetailContainer) return;

    const urlParams = new URLSearchParams(window.location.search);
    const competitionId = urlParams.get('id');

    if (!competitionId) {
        competitionDetailContainer.innerHTML = "<h1>ID Lomba tidak ditemukan.</h1>";
        return;
    }

    fetch(`api/get_competitions_detail.php?id=${competitionId}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const competition = data.data;
                document.getElementById('competition-title').textContent = competition.nama_lomba;
                document.getElementById('competition-description').textContent = competition.deskripsi;
                document.getElementById('competition-banner').src = `assets/images/${competition.banner_img}`;

                const detailsContainer = document.getElementById('details-container');
                detailsContainer.innerHTML = '';
                if (competition.details && competition.details.length > 0) {
                    competition.details.forEach(detail => {
                        detailsContainer.innerHTML += `
                            <div class="detail-item">
                                <h3>${detail.detail_title}</h3>
                                <p>${detail.detail_content}</p>
                            </div>`;
                    });
                } else {
                    detailsContainer.innerHTML = "<p>Informasi detail untuk lomba ini belum tersedia.</p>";
                }
            } else {
                competitionDetailContainer.innerHTML = `<p>${data.message}</p>`;
            }
        })
        .catch(error => {
            console.error('Error memuat detail kompetisi:', error);
            competitionDetailContainer.innerHTML = "<p>Terjadi kesalahan saat memuat data.</p>";
        });

    const btnGratis = document.getElementById('btn-gratis');
    const btnBerbayar = document.getElementById('btn-berbayar');
    if (btnGratis && btnBerbayar) {
        btnGratis.addEventListener('click', () => { if(competitionId) window.location.href = `free-registration.php?id=${competitionId}`; });
        btnBerbayar.addEventListener('click', () => { if(competitionId) window.location.href = `payment.php?id=${competitionId}`; });
    }
}

export function initCompetitions() {
    loadCompetitionList();
    loadCompetitionDetail();
}