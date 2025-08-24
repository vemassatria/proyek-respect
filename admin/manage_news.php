<?php
$pageTitle = 'Manajemen Berita';
$headerTitle = 'Manajemen Berita & Artikel';
include '_header.php';
include '_sidebar.php';
?>

<div class="content-card">
    <div class="toolbar">
        <h4>Daftar Berita & Artikel</h4>
        <button id="add-news-btn" class="btn-primary">
            <i class="fas fa-plus"></i> Tambah Berita Baru
        </button>
    </div>

    <table class="data-table" id="news-table">
        <thead>
            <tr>
                <th>ID</th>
                <th>Judul</th>
                <th>Kategori</th>
                <th>Tanggal Publikasi</th>
                <th>Aksi</th>
            </tr>
        </thead>
        <tbody>
            </tbody>
    </table>
</div>

<div id="news-modal" class="modal-overlay" style="display: none;">
    <div class="modal-content">
        <div class="modal-header">
            <h4 id="news-modal-title">Tambah Berita Baru</h4>
            <button id="close-news-modal-btn" class="close-button">&times;</button>
        </div>
        <div class="modal-body">
            <form id="news-form" enctype="multipart/form-data">
                <input type="hidden" id="news_id" name="news_id">

                <div class="form-group">
                    <label for="title">Judul Berita/Artikel</label>
                    <input type="text" id="title" name="title" required>
                </div>

                <div class="form-group">
                    <label for="article_link">Link Artikel (URL)</label>
                    <input type="url" id="article_link" name="article_link" placeholder="https://contoh.com/berita" required>
                </div>

                <div class="form-group-row">
                    <div class="form-group">
                        <label for="category">Kategori</label>
                        <select id="category" name="category" required>
                            <option value="Berita Terkini">Berita Terkini</option>
                            <option value="Artikel Organisasi">Artikel Organisasi</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="is_featured">Jadikan Berita Utama?</label>
                        <select id="is_featured" name="is_featured" required>
                            <option value="1">Ya</option>
                            <option value="0">Tidak</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label for="image_url">Gambar Berita</label>
                    <input type="file" id="image_url" name="image_url" accept="image/png, image/jpeg, image/jpg">
                    <small>Kosongkan jika tidak ingin mengubah gambar saat edit.</small>
                </div>

                <div class="modal-footer">
                    <button type="button" id="cancel-news-btn" class="btn-secondary">Batal</button>
                    <button type="submit" class="btn-primary">Simpan</button>
                </div>
            </form>
        </div>
    </div>
</div>


<?php
include '_footer.php';
?>