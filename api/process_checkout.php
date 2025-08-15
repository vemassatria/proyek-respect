<?php
require 'init.php';
$user_id = $_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $json_data = file_get_contents('php://input');
    $data = json_decode($json_data, true);

    if (!isset($data['competition_id']) || !isset($data['items']) || !is_array($data['items'])) {
        echo json_encode(['status' => 'error', 'message' => 'Data tidak lengkap atau format salah.']);
        exit;
    }

    $competition_id = $data['competition_id'];
    $items = $data['items'];
    $total_amount = 0;
    $item_details_for_db = [];

    foreach ($items as $item) {
        if ($item['type'] === 'competition') {
            $stmt = $conn->prepare("SELECT price, item_name FROM competition_items WHERE id = ?");
            $stmt->bind_param("i", $item['id']);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($row = $result->fetch_assoc()) {
                $total_amount += $row['price'] * $item['quantity'];
                $item_details_for_db[] = $row['item_name'] . ' (x' . $item['quantity'] . ')';
            }
            $stmt->close();
        } elseif ($item['type'] === 'merchandise') {
            $stmt = $conn->prepare("SELECT price, item_name FROM merchandise WHERE id = ?");
            $stmt->bind_param("i", $item['id']);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($row = $result->fetch_assoc()) {
                $total_amount += $row['price'] * $item['quantity'];
                $item_details_for_db[] = $row['item_name'] . ' (x' . $item['quantity'] . ')';
            }
            $stmt->close();
        }
    }

    if ($total_amount > 0) {
        // --- PERUBAHAN UTAMA DI SINI ---
        // 1. Buat kode unik 3 digit
        $unique_code = rand(001, 999);
        
        // 2. Tambahkan kode unik ke total biaya
        $final_amount = $total_amount + $unique_code;

        // 3. Siapkan data untuk disimpan dan dikirim
        $transaction_code = "RES-" . strtoupper(uniqid());
        $item_summary = implode(", ", $item_details_for_db);
        $rekening_tujuan = "1234567890 (Bank ABC a.n. Respect.id)"; // Ganti dengan no. rek Anda

        // 4. Simpan total biaya AKHIR ke database
        $stmt_insert = $conn->prepare("INSERT INTO registrations (user_id, competition_id, amount, transaction_code, payment_status) VALUES (?, ?, ?, ?, 'pending_payment')");
        $stmt_insert->bind_param("iids", $user_id, $competition_id, $final_amount, $item_summary);
        
        if ($stmt_insert->execute()) {
            // 5. Kirim respon sukses beserta detail pembayaran
            echo json_encode([
                'status' => 'success', 
                'message' => 'Checkout berhasil! Harap selesaikan pembayaran.',
                'paymentDetails' => [
                    'rekening' => $rekening_tujuan,
                    'total' => $final_amount,
                    'kode_unik' => $unique_code
                ]
            ]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Gagal menyimpan transaksi.']);
        }
        $stmt_insert->close();
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Tidak ada item yang dipilih.']);
    }

    $conn->close();
}
?>