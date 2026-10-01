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

// Override with GET parameters if present (for testing in restricted environments)
if (!isset($input['username']) && isset($_GET['username'])) {
    $input['username'] = $_GET['username'];
}
if (!isset($input['password']) && isset($_GET['password'])) {
    $input['password'] = $_GET['password'];
}

if (!isset($input['username']) || !isset($input['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Username and password are required']);
    exit;
}

$username = trim($input['username']);
$password = $input['password'];

try {
    $db = Database::getInstance();
    $stmt = $db->prepare("SELECT id, username, password, role FROM users WHERE username = :username LIMIT 1");
    $stmt->execute(['username' => $username]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        // Password is correct, start session
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['role'] = $user['role'];

        echo json_encode([
            'success' => true,
            'message' => 'Login successful',
            'user' => [
                'username' => $user['username'],
                'role' => $user['role']
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid username or password']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
?>
