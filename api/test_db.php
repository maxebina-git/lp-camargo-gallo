<?php
require_once 'db_config.php';

header('Content-Type: text/plain');

try {
    $db = Database::getInstance();
    echo "Conexão com o banco de dados realizada com sucesso!\n";
    echo "Banco: " . DB_NAME . "\n";
    echo "Host: " . DB_HOST . "\n";
} catch (Exception $e) {
    http_response_code(500);
    echo "Erro ao conectar ao banco de dados: " . $e->getMessage();
}
?>
