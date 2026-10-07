<?php
session_start();
require_once '../db_config.php';
require_once '../galeria.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

try {
    $db = Database::getInstance();
    $stmt = $db->query("SELECT id, titulo, slug, descricao, cidade, ano, categoria, data_obra, status, imagem, imagens, ordem FROM portfolio ORDER BY ordem ASC, id ASC");
    $items = $stmt->fetchAll();
    foreach ($items as &$item) {
        $item['imagens'] = cg_imagens_list($item);
    }
    unset($item);
    echo json_encode($items);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
