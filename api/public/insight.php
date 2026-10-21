<?php
require_once '../db_config.php';
require_once __DIR__ . '/../insights/content_sanitizer.php';
require_once __DIR__ . '/../redirects.php';

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
    $stmt = $db->prepare("SELECT id, slug, titulo, resumo, conteudo, data, categoria, imagem FROM insights WHERE slug = :slug LIMIT 1");
    $stmt->execute([':slug' => $slug]);
    $item = $stmt->fetch();

    if (!$item) {
        // O slug pode ter mudado depois que o insight foi publicado. Nesse
        // caso devolvemos para onde foi, e o front troca a URL.
        $novoSlug = cg_redirect_buscar($db, 'insights', $slug);

        if ($novoSlug !== null) {
            echo json_encode(['redirect' => $novoSlug]);
            exit;
        }

        http_response_code(404);
        echo json_encode(['error' => 'Not found']);
        exit;
    }

    $item['conteudo'] = cg_sanitize_insight_content($item['conteudo']);
    echo json_encode($item);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
