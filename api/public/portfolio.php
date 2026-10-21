<?php
require_once '../db_config.php';
require_once '../content_sanitizer.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    $db = Database::getInstance();
    $stmt = $db->query("SELECT id, slug, titulo, descricao, cidade, ano, imagem, categoria, data_obra, status, ordem FROM portfolio ORDER BY ordem ASC, id ASC");
    $items = $stmt->fetchAll();
    foreach ($items as &$item) {
        $item['descricao'] = cg_rich_content_to_plain_text($item['descricao']);
    }
    unset($item);
    echo json_encode($items);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
