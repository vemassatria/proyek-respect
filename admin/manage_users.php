<?php
$pageTitle = 'Manajemen Pengguna';
$headerTitle = 'Manajemen Pengguna Terdaftar';
include '_header.php';
include '_sidebar.php';
?>

<div class="content-card">
    <div class="toolbar">
        <h4>Daftar Pengguna</h4>
        </div>

    <table class="data-table" id="users-table">
        <thead>
            <tr>
                <th>ID</th>
                <th>Nama</th>
                <th>Email</th>
                <th>Tingkatan</th>
                <th>Institusi</th>
                <th>Peran (Role)</th>
                <th>Aksi</th>
            </tr>
        </thead>
        <tbody>
            </tbody>
    </table>
</div>

<?php
include '_footer.php';
?>