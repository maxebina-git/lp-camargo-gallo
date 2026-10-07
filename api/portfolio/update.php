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

if (!isset($input['id'], $input['titulo'], $input['descricao'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

try {
    $db = Database::getInstance();
    $slug = cg_unique_slug($db, 'portfolio', $input['slug'] ?? $input['titulo'], (int) $input['id']);

    $galeria = cg_parse_imagens($input);

    $stmt = $db->prepare("UPDATE portfolio SET titulo = :titulo, slug = :slug, descricao = :descricao, cidade = :cidade, ano = :ano, categoria = :categoria, data_obra = :data_obra, status = :status, imagem = :imagem, imagens = :imagens WHERE id = :id");
    
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
        'id'        => $input['id']
    ]);

    echo json_encode(['success' => true, 'slug' => $slug]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
