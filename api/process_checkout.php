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
        $transaction_code = "RES-" . strtoupper(uniqid());
        $item_summary = implode(", ", $item_details_for_db);

        $stmt_insert = $conn->prepare("INSERT INTO registrations (user_id, competition_id, amount, transaction_code, payment_status) VALUES (?, ?, ?, ?, 'pending_payment')");
        $stmt_insert->bind_param("iids", $user_id, $competition_id, $total_amount, $item_summary);
        
        if ($stmt_insert->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Checkout berhasil! Silakan lanjutkan pembayaran.']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Gagal menyimpan transaksi.']);
        }
        $stmt_insert->close();
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Tidak ada item yang dipilih atau total biaya nol.']);
    }
    $conn->close();
}
?>