<?php
$pageTitle = 'Manajemen Lomba';
$headerTitle = 'Manajemen Kompetisi & Lomba';
include '_header.php'; // Memanggil header, yang sudah termasuk auth.php
include '_sidebar.php'; // Memanggil sidebar dan header utama
?>

<div class="content-card">
    <div class="toolbar">
        <h4>Daftar Lomba</h4>
        <button class="btn-primary">
            <i class="fas fa-plus"></i> Tambah Lomba Baru
        </button>
    </div>

    <table class="data-table" id="competitions-table">
        <thead>
            <tr>
                <th>ID</th>
                <th>Nama Lomba</th>
                <th>Tanggal Pendaftaran</th>
                <th>Biaya</th>
                <th>Aksi</th>
            </tr>
        </thead>
        <tbody>
            </tbody>
    </table>
</div>

<div id="competition-modal" class="modal-overlay" style="display: none;">
    <div class="modal-content">
        <div class="modal-header">
            <h4 id="modal-title">Tambah Lomba Baru</h4>
            <button id="close-modal-btn" class="close-button">&times;</button>
        </div>
        <div class="modal-body">
            <form id="competition-form" enctype="multipart/form-data">
                <input type="hidden" id="competition_id" name="competition_id">

                <div class="form-group">
                    <label for="nama_lomba">Nama Lomba</label>
                    <input type="text" id="nama_lomba" name="nama_lomba" required>
                </div>

                <div class="form-group">
                    <label for="deskripsi">Deskripsi</label>
                    <textarea id="deskripsi" name="deskripsi" rows="4" required></textarea>
                </div>

                <div class="form-group-row">
                    <div class="form-group">
                        <label for="tanggal_mulai_daftar">Tanggal Mulai Pendaftaran</label>
                        <input type="date" id="tanggal_mulai_daftar" name="tanggal_mulai_daftar" required>
                    </div>
                    <div class="form-group">
                        <label for="tanggal_akhir_daftar">Tanggal Akhir Pendaftaran</label>
                        <input type="date" id="tanggal_akhir_daftar" name="tanggal_akhir_daftar" required>
                    </div>
                </div>

                <div class="form-group">
                    <label for="biaya">Biaya (Rp)</label>
                    <input type="number" id="biaya" name="biaya" placeholder="Contoh: 50000" required>
                </div>

                <div class="form-group">
                    <label for="banner_img">Banner/Poster Lomba</label>
                    <input type="file" id="banner_img" name="banner_img" accept="image/png, image/jpeg, image/jpg">
                </div>

                <div class="modal-footer">
                    <button type="button" id="cancel-btn" class="btn-secondary">Batal</button>
                    <button type="submit" class="btn-primary">Simpan</button>
                </div>
            </form>
        </div>
    </div>
</div>


<?php
include '_footer.php'; // Memanggil footer
?>