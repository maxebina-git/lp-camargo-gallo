<?php
session_start();
require_once '../db_config.php';
require_once '../slug.php';
require_once '../galeria.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

// Get input data
if ($_SERVER['CONTENT_TYPE'] === 'application/json') {
    $input = json_decode(file_get_contents('php://input'), true);
} else {
    // Handle application/x-www-form-urlencoded or fallback
    $input = $_REQUEST;
    // If $_POST is empty, try to parse the input
    if (empty($input) && $_SERVER['REQUEST_METHOD'] === 'POST') {
        parse_str(file_get_contents('php://input'), $input);
    }
}

if (!isset($input['titulo'], $input['descricao'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

try {
    $db = Database::getInstance();
    $slug = cg_unique_slug($db, 'portfolio', $input['slug'] ?? $input['titulo']);
    $ordem = (int) $db->query("SELECT COALESCE(MAX(ordem), 0) + 1 FROM portfolio")->fetchColumn();

    $galeria = cg_parse_imagens($input);

    $video = (isset($input['video_youtube']) && is_string($input['video_youtube'])) ? trim($input['video_youtube']) : '';
    if (strlen($video) > 500) {
        $video = substr($video, 0, 500);
    }

    $stmt = $db->prepare("INSERT INTO portfolio (titulo, slug, descricao, cidade, ano, categoria, data_obra, status, imagem, imagens, video_youtube, ordem, user_id) VALUES (:titulo, :slug, :descricao, :cidade, :ano, :categoria, :data_obra, :status, :imagem, :imagens, :video_youtube, :ordem, :user_id)");
    
    $stmt->execute([
        'titulo'    => $input['titulo'],
        'slug'      => $slug,
        'descricao' => $input['descricao'],
        'cidade'    => $input['cidade'] ?? null,
        'ano'       => $input['ano'] ?? null,
        'categoria' => $input['categoria'] ?? null,
        'data_obra' => $input['data_obra'] ?? null,
        'status'    => $input['status'] ?? 'concluido',
        'imagem'    => $galeria ? $galeria[0] : null,
        'imagens'   => cg_imagens_json($galeria),
        'video_youtube' => ($video !== '' ? $video : null),
        'ordem'     => $ordem,
        'user_id'   => $_SESSION['user_id']
    ]);

    echo json_encode(['success' => true, 'id' => $db->lastInsertId(), 'slug' => $slug]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
