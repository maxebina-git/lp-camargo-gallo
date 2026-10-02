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

// Aceita JSON { "ids": [1,2,3] } ou form ids=1,2,3 / ids[]=1&ids[]=2
if (($_SERVER['CONTENT_TYPE'] ?? '') === 'application/json') {
    $input = json_decode(file_get_contents('php://input'), true);
} else {
    $input = $_REQUEST;
    if (empty($input)) {
        parse_str(file_get_contents('php://input'), $input);
    }
}

$ids = $input['ids'] ?? null;
if (is_string($ids)) {
    $ids = array_values(array_filter(explode(',', $ids), 'strlen'));
}

if (!is_array($ids) || !count($ids)) {
    http_response_code(400);
    echo json_encode(['error' => 'Lista de ids vazia']);
    exit;
}

foreach ($ids as $id) {
    if (!ctype_digit((string) $id)) {
        http_response_code(400);
        echo json_encode(['error' => 'ID invalido']);
        exit;
    }
}
$ids = array_map('intval', $ids);

try {
    $db = Database::getInstance();
    $db->beginTransaction();

    $stmt = $db->prepare("UPDATE portfolio SET ordem = :ordem WHERE id = :id");
    foreach ($ids as $index => $id) {
        $stmt->execute([':ordem' => $index + 1, ':id' => $id]);
    }

    $db->commit();
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
