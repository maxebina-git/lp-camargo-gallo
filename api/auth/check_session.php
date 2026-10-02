<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized access']);
    exit;
}

echo json_encode([
    'success' => true,
    'user' => [
        'id' => $_SESSION['user_id'],
        'email' => $_SESSION['email'],
        'role' => $_SESSION['role']
    ]
]);
?>
