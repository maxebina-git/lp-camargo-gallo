<?php
require_once '../db_config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    $db = Database::getInstance();
    $stmt = $db->query("SELECT id, slug, titulo, descricao, cidade, ano, imagem, categoria, data_obra, status FROM portfolio ORDER BY data_obra DESC, id ASC");
    $items = $stmt->fetchAll();
    echo json_encode($items);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
