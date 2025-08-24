<?php
$pageTitle = 'Akun Saya';
include 'components/_head.php';
?>
<body>
    <main class="main-content">
        <div class="account-card">
            <header class="account-header">
                <!-- Create/Update/Read Foto Profil -->
                <div class="profile-picture-container">
                    <img id="profile-picture-img" src="assets/images/icon-account-profile.svg" alt="Foto Profil" class="profile-picture-display">
                    <button id="change-picture-btn" class="change-picture-button" title="Ubah foto profil">
                        <i class="fas fa-camera"></i>
                    </button>
                    <input type="file" id="profile-picture-input" style="display: none;" accept="image/*">
                </div>
                <div class="account-greeting">
                    <h2>Halo, Selamat Datang</h2>
                    <p id="account-name">Memuat nama...</p>
                </div>
            </header>
            <div class="divider"></div>

            <!-- Read/Update Profil (Tingkatan & Institusi) -->
            <section class="profile-info-section">
                <h3>Profil Saya</h3>
                <div class="info-row">
                    <span>Tingkatan</span>
                    <strong id="display-tingkatan">Belum diatur</strong>
                </div>
                <div class="info-row">
                    <span>Institusi</span>
                    <strong id="display-institusi">Belum diatur</strong>
                </div>
                <button id="edit-profile-btn" class="btn-secondary-custom">Edit Profil</button>
            </section>
            <div class="divider"></div>

            <!-- Create/Read/Update/Delete Dokumen -->
            <section class="document-list">
                <h3>Kelengkapan Dokumen</h3>
                <!-- CV -->
                <div class="document-row" data-doctype="cv">
                    <div class="document-info">
                        <h3>CV (Curriculum Vitae)</h3>
                        <p class="doc-status">Dokumen belum diupload</p>
                    </div>
                    <div class="document-actions">
                        <button class="btn-action btn-delete" style="display: none;" title="Hapus"><i class="fas fa-trash-alt"></i></button>
                        <button class="btn-upload">Upload</button>
                    </div>
                </div>
                <!-- Portofolio -->
                <div class="document-row" data-doctype="portfolio">
                    <div class="document-info">
                        <h3>Portofolio</h3>
                        <p class="doc-status">Dokumen belum diupload</p>
                    </div>
                    <div class="document-actions">
                        <button class="btn-action btn-delete" style="display: none;" title="Hapus"><i class="fas fa-trash-alt"></i></button>
                        <button class="btn-upload">Upload</button>
                    </div>
                </div>
                <!-- KTM -->
                <div class="document-row" data-doctype="ktm">
                    <div class="document-info">
                        <h3>KTM / Kartu Pelajar</h3>
                        <p class="doc-status">Dokumen belum diupload</p>
                    </div>
                    <div class="document-actions">
                        <button class="btn-action btn-delete" style="display: none;" title="Hapus"><i class="fas fa-trash-alt"></i></button>
                        <button class="btn-upload">Upload</button>
                    </div>
                </div>
            </section>
            <button id="logout-button" class="btn-logout-custom">Logout</button>
        </div>
    </main>
    <?php include 'components/_navbar.php'; ?>
    <!-- Font Awesome untuk ikon -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/js/all.min.js"></script>
    <script type="module" src="assets/js/main.js"></script>
</body>
</html>