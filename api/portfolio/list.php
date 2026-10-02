<?php
session_start();
require_once '../db_config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

try {
    $db = Database::getInstance();
    $stmt = $db->query("SELECT id, titulo, slug, descricao, cidade, ano, categoria, data_obra, status, imagem FROM portfolio ORDER BY data_obra DESC, id ASC");
    $items = $stmt->fetchAll();
    echo json_encode($items);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
