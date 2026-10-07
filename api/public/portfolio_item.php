<?php
require_once '../db_config.php';
require_once '../galeria.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$slug = isset($_GET['slug']) ? trim((string) $_GET['slug']) : '';

if ($slug === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Missing slug']);
    exit;
}

try {
    $db = Database::getInstance();
    $stmt = $db->prepare("SELECT id, slug, titulo, descricao, cidade, ano, imagem, imagens, categoria, data_obra, status FROM portfolio WHERE slug = :slug LIMIT 1");
    $stmt->execute([':slug' => $slug]);
    $item = $stmt->fetch();

    if (!$item) {
        http_response_code(404);
        echo json_encode(['error' => 'Not found']);
        exit;
    }

    $item['imagens'] = cg_imagens_list($item);
    echo json_encode($item);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
