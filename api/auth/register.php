<?php
session_start();
require_once '../db_config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
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

if (!isset($input['username']) || !isset($input['password']) || !isset($input['email'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Username, email and password are required']);
    exit;
}

$username = trim($input['username']);
$email = trim($input['email']);
$password = $input['password'];

try {
    $db = Database::getInstance();
    
    // Check if user already exists
    $stmt = $db->prepare("SELECT id FROM users WHERE username = :username OR email = :email LIMIT 1");
    $stmt->execute(['username' => $username, 'email' => $email]);
    
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(['error' => 'Username or email already exists']);
        exit;
    }

    // Hash password and insert
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    $stmt = $db->prepare("INSERT INTO users (username, password, email, role) VALUES (:username, :password, :email, 'editor')");
    $stmt->execute([
        'username' => $username,
        'password' => $hashedPassword,
        'email'    => $email
    ]);

    echo json_encode(['success' => true, 'message' => 'User created successfully']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
?>
