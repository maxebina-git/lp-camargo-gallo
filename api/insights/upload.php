<?php
session_start();

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
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

if (!isset($_FILES['file']) || !is_uploaded_file($_FILES['file']['tmp_name'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Nenhum arquivo enviado']);
    exit;
}

$file = $_FILES['file'];

if ($file['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'Falha no upload (codigo ' . $file['error'] . ')']);
    exit;
}

$maxBytes = 5 * 1024 * 1024;
if ($file['size'] > $maxBytes) {
    http_response_code(413);
    echo json_encode(['error' => 'Arquivo maior que 5 MB']);
    exit;
}

// Valida que o conteudo e realmente uma imagem e detecta o formato real
// (nunca confiamos na extensao ou no Content-Type enviados pelo cliente).
$info = @getimagesize($file['tmp_name']);
if ($info === false) {
    http_response_code(415);
    echo json_encode(['error' => 'O arquivo nao e uma imagem valida']);
    exit;
}

$allowed = [
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp',
    'image/gif'  => 'gif',
];

$mime = $info['mime'] ?? '';
if (!isset($allowed[$mime])) {
    http_response_code(415);
    echo json_encode(['error' => 'Formato nao suportado. Use JPG, PNG, WEBP ou GIF']);
    exit;
}

// api/insights/ -> ../../ -> raiz do site (/public_html/staging/assets/uploads/)
$uploadDir = __DIR__ . '/../../assets/uploads/';
if (!is_dir($uploadDir) && !mkdir($uploadDir, 0755, true)) {
    http_response_code(500);
    echo json_encode(['error' => 'Nao foi possivel criar a pasta de uploads']);
    exit;
}

$filename = 'insight-' . date('Ymd-His') . '-' . bin2hex(random_bytes(6)) . '.' . $allowed[$mime];
$target = $uploadDir . $filename;

if (!move_uploaded_file($file['tmp_name'], $target)) {
    http_response_code(500);
    echo json_encode(['error' => 'Nao foi possivel salvar a imagem']);
    exit;
}

@chmod($target, 0644);

echo json_encode([
    'success' => true,
    'path'    => '/assets/uploads/' . $filename,
]);
