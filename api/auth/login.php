<?php
session_start();
require_once '../db_config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Adjust this for production security
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
        $content = trim(file_get_contents('php://input'));
        if (!empty($content)) {
            // Try to parse as JSON
            $maybeJson = json_decode($content, true);
            if (json_last_error() === JSON_ERROR_NONE && $maybeJson !== null) {
                $input = $maybeJson;
            } else {
                // Try to parse as query string
                parse_str($content, $input);
            }
        }
    }
}

// Override com parametros GET removido: senha na query string fica registrada
// em logs de acesso. O login aceita somente POST com body (JSON ou form).

if (!isset($input['email']) || !isset($input['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Email and password are required']);
    exit;
}

$email = trim($input['email']);
$password = $input['password'];

try {
    $db = Database::getInstance();
    $stmt = $db->prepare("SELECT id, email, password, role FROM users WHERE email = :email LIMIT 1");
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        // Password is correct, start session
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['email'] = $user['email'];
        $_SESSION['role'] = $user['role'];

        echo json_encode([
            'success' => true,
            'message' => 'Login successful',
                'user' => [
                    'email' => $user['email'],
                    'role' => $user['role']
                ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid email or password']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
?>
