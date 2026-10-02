<?php
session_start();
require_once '../db_config.php';
require_once '../slug.php';

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

if (!isset($input['id'], $input['titulo'], $input['resumo'], $input['conteudo'], $input['data'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

try {
    $db = Database::getInstance();
    $slug = cg_unique_slug($db, 'insights', $input['slug'] ?? $input['titulo'], (int) $input['id']);

    $stmt = $db->prepare("UPDATE insights SET titulo = :titulo, slug = :slug, resumo = :resumo, conteudo = :conteudo, data = :data, categoria = :categoria, imagem = :imagem WHERE id = :id");
    
    $stmt->execute([
        'titulo'    => $input['titulo'],
        'slug'      => $slug,
        'resumo'    => $input['resumo'],
        'conteudo'  => $input['conteudo'],
        'data'      => $input['data'],
        'categoria' => $input['categoria'] ?? null,
        'imagem'    => $input['imagem'] ?? null,
        'id'        => $input['id']
    ]);

    echo json_encode(['success' => true, 'slug' => $slug]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
