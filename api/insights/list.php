<?php
session_start();
require_once '../db_config.php';
require_once __DIR__ . '/content_sanitizer.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

try {
    $db = Database::getInstance();
    $stmt = $db->query("SELECT id, slug, titulo, resumo, conteudo, data, categoria, imagem FROM insights ORDER BY data DESC");
    $items = $stmt->fetchAll();
    foreach ($items as &$item) {
        $item['conteudo'] = cg_sanitize_insight_content($item['conteudo']);
    }
    unset($item);
    echo json_encode($items);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
