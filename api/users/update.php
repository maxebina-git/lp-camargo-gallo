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

if ($_SERVER['CONTENT_TYPE'] === 'application/json') {
    $input = json_decode(file_get_contents('php://input'), true);
} else {
    $input = $_REQUEST;
    if (empty($input) && $_SERVER['REQUEST_METHOD'] === 'POST') {
        parse_str(file_get_contents('php://input'), $input);
    }
}

if (!isset($input['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'ID is required']);
    exit;
}

$isAdmin = ($_SESSION['role'] ?? '') === 'admin';
$targetId = (int) $input['id'];

if (!$isAdmin && $targetId !== (int) $_SESSION['user_id']) {
    http_response_code(403);
    echo json_encode(['error' => 'Forbidden']);
    exit;
}

$nome = trim($input['nome'] ?? '');
$email = trim($input['email'] ?? '');
$telefone = trim($input['telefone'] ?? '');
$password = $input['password'] ?? '';
$role = $input['role'] ?? null;

if ($nome !== '' && (strlen($nome) < 3 || strlen($nome) > 120)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid name']);
    exit;
}
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email']);
    exit;
}
if ($password !== '' && strlen($password) < 8) {
    http_response_code(400);
    echo json_encode(['error' => 'Password must be at least 8 characters']);
    exit;
}
if ($role !== null && !in_array($role, ['admin', 'editor'], true)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid role']);
    exit;
}

try {
    $db = Database::getInstance();

    $stmt = $db->prepare("SELECT id, email, role FROM users WHERE id = :id");
    $stmt->execute(['id' => $targetId]);
    $target = $stmt->fetch();
    if (!$target) {
        http_response_code(404);
        echo json_encode(['error' => 'User not found']);
        exit;
    }

    if ($role !== null && $role !== $target['role'] && !$isAdmin) {
        http_response_code(403);
        echo json_encode(['error' => 'Only admin can change role']);
        exit;
    }

    if ($role !== null && $role !== $target['role'] && $target['role'] === 'admin' && $role === 'editor') {
        $stmt = $db->query("SELECT COUNT(*) AS total FROM users WHERE role = 'admin'");
        $count = (int) $stmt->fetch()['total'];
        if ($count <= 1) {
            http_response_code(400);
            echo json_encode(['error' => 'Cannot demote the last admin']);
            exit;
        }
    }

    if ($email !== '' && $email !== $target['email']) {
        $stmt = $db->prepare("SELECT id FROM users WHERE email = :email AND id != :id");
        $stmt->execute(['email' => $email, 'id' => $targetId]);
        if ($stmt->fetch()) {
            http_response_code(409);
            echo json_encode(['error' => 'Email already in use']);
            exit;
        }
    }

    $fields = [];
    $params = ['id' => $targetId];
    if ($nome !== '') { $fields[] = 'nome = :nome'; $params['nome'] = $nome; }
    if ($email !== '') { $fields[] = 'email = :email'; $params['email'] = $email; }
    if ($telefone !== '') { $fields[] = 'telefone = :telefone'; $params['telefone'] = $telefone; }
    if ($role !== null && $isAdmin) { $fields[] = 'role = :role'; $params['role'] = $role; }
    if ($password !== '') { $fields[] = 'password = :password'; $params['password'] = password_hash($password, PASSWORD_DEFAULT); }

    if (empty($fields)) {
        http_response_code(400);
        echo json_encode(['error' => 'Nothing to update']);
        exit;
    }

    $sql = 'UPDATE users SET ' . implode(', ', $fields) . ' WHERE id = :id';
    $stmt = $db->prepare($sql);
    $stmt->execute($params);

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
