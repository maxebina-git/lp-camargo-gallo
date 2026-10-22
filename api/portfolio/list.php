<?php
session_start();
require_once '../db_config.php';
require_once '../galeria.php';
require_once '../content_sanitizer.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

try {
    $db = Database::getInstance();
    $stmt = $db->query("SELECT id, titulo, slug, descricao, resumo, cidade, ano, categoria, data_obra, status, imagem, imagens, video_youtube, ordem FROM portfolio ORDER BY ordem ASC, id ASC");
    $items = $stmt->fetchAll();
    foreach ($items as &$item) {
        $item['descricao'] = cg_sanitize_rich_content($item['descricao']);
        // Calcula a galeria em uma unica passagem: se 'imagens' fosse
        // sobrescrito antes de ler as legendas, a legenda voltaria vazia.
        $galeria = cg_galeria_linha($item);
        $item['imagens'] = $galeria['urls'];
        $item['legendas'] = $galeria['legendas'];
    }
    unset($item);
    echo json_encode($items);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
