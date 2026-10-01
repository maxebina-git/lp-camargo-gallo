<?php
session_start();
require_once '../db_config.php';

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

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['id'], $input['titulo'], $input['descricao'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

try {
    $db = Database::getInstance();
    $stmt = $db->prepare("UPDATE portfolio SET titulo = :titulo, descricao = :descricao, categoria = :categoria, data_obra = :data_obra, status = :status, imagem = :imagem WHERE id = :id");
    
    $stmt->execute([
        'titulo'    => $input['titulo'],
        'descricao' => $input['descricao'],
        'categoria' => $input['categoria'] ?? null,
        'data_obra' => $input['data_obra'] ?? null,
        'status'    => $input['status'] ?? 'concluido',
        'imagem'    => $input['imagem'] ?? null,
        'id'        => $input['id']
    ]);

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
