<?php
header('Content-Type: application/json');
require '../config/database.php';

$payment_options = [
    'competition_items' => [],
    'merchandise' => []
];

if (isset($_GET['id']) && !empty($_GET['id'])) {
    $competition_id = intval($_GET['id']);
    $stmt_items = $conn->prepare("SELECT id, item_name, price FROM competition_items WHERE competition_id = ?");
    $stmt_items->bind_param("i", $competition_id);
    $stmt_items->execute();
    $result_items = $stmt_items->get_result();

    if ($result_items->num_rows > 0) {
        while($row = $result_items->fetch_assoc()) {
            $payment_options['competition_items'][] = $row;
        }
    }
    $stmt_items->close();
}

$sql_merch = "SELECT id, item_name, price FROM merchandise";
$result_merch = $conn->query($sql_merch);
if ($result_merch && $result_merch->num_rows > 0) {
    while($row = $result_merch->fetch_assoc()) {
        $payment_options['merchandise'][] = $row;
    }
}

echo json_encode(['status' => 'success', 'data' => $payment_options]);
$conn->close();
?>