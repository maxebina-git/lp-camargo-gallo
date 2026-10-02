<?php
require_once '../db_config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    $db = Database::getInstance();
    $stmt = $db->query("SELECT id, slug, titulo, resumo, data, categoria, imagem FROM insights ORDER BY data DESC");
    $items = $stmt->fetchAll();
    echo json_encode($items);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
