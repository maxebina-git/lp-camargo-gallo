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

if (!isset($input['titulo'], $input['resumo'], $input['conteudo'], $input['data'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

try {
    $db = Database::getInstance();
    $stmt = $db->prepare("INSERT INTO insights (titulo, resumo, conteudo, data, categoria, imagem, user_id) VALUES (:titulo, :resumo, :conteudo, :data, :categoria, :imagem, :user_id)");
    
    $stmt->execute([
        'titulo'    => $input['titulo'],
        'resumo'    => $input['resumo'],
        'conteudo'  => $input['conteudo'],
        'data'      => $input['data'],
        'categoria' => $input['categoria'] ?? null,
        'imagem'    => $input['imagem'] ?? null,
        'user_id'   => $_SESSION['user_id']
    ]);

    echo json_encode(['success' => true, 'id' => $db->lastInsertId()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
