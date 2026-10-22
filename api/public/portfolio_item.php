<?php
require_once '../db_config.php';
require_once '../galeria.php';
require_once '../content_sanitizer.php';
require_once '../redirects.php';

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
    $stmt = $db->prepare("SELECT id, slug, titulo, descricao, resumo, cidade, ano, imagem, imagens, video_youtube, categoria, data_obra, status FROM portfolio WHERE slug = :slug LIMIT 1");
    $stmt->execute([':slug' => $slug]);
    $item = $stmt->fetch();

    if (!$item) {
        // O slug pode ter mudado depois que a obra foi publicada. Nesse
        // caso devolvemos para onde foi, e o front troca a URL.
        $novoSlug = cg_redirect_buscar($db, 'portfolio', $slug);

        if ($novoSlug !== null) {
            echo json_encode(['redirect' => $novoSlug]);
            exit;
        }

        http_response_code(404);
        echo json_encode(['error' => 'Not found']);
        exit;
    }

    $item['descricao'] = cg_sanitize_rich_content($item['descricao']);
    // Calcula a galeria em uma unica passagem: se 'imagens' fosse
    // sobrescrito antes de ler as legendas, a legenda voltaria vazia.
    $galeria = cg_galeria_linha($item);
    $item['imagens'] = $galeria['urls'];
    $item['legendas'] = $galeria['legendas'];
    echo json_encode($item);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
