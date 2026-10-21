<?php
// Teste de integracao temporario: replica exatamente o fluxo dos endpoints
// de portfolio (list.php e public/portfolio_item.php) contra o banco real,
// para garantir que a legenda nao se perca.
ini_set('display_errors', '1');
error_reporting(E_ALL);
require_once __DIR__ . '/db_config.php';
require_once __DIR__ . '/galeria.php';
header('Content-Type: application/json');

$out = array();

try {
    $db = Database::getInstance();
    $stmt = $db->query("SELECT id, titulo, slug, imagem, imagens FROM portfolio ORDER BY id");
    $items = $stmt->fetchAll();

    foreach ($items as &$item) {
        // --- exatamente o que os endpoints fazem ---
        $galeria = cg_galeria_linha($item);
        $item['imagens'] = $galeria['urls'];
        $item['legendas'] = $galeria['legendas'];
        // ----------------------------------------------
        $out[] = array(
            'id' => $item['id'],
            'slug' => $item['slug'],
            'imagens' => $item['imagens'],
            'legendas' => $item['legendas'],
        );
    }
    unset($item);

    // Round-trip do write path: input do admin -> gravacao -> leitura.
    $input = array(
        'imagens' => json_encode(array(
            array('url' => '/assets/uploads/x.jpg', 'legenda' => 'Legenda de teste'),
        )),
        'imagem' => '/assets/uploads/x.jpg',
    );
    $urls = cg_parse_imagens($input);
    $legendas = cg_parse_legendas($input);
    $json = cg_imagens_json($urls, $legendas);

    $linha = array('imagens' => $json, 'imagem' => $urls[0]);
    $galeria = cg_galeria_linha($linha);
    $out['roundtrip'] = array(
        'json_salvo' => $json,
        'urls_lidos' => $galeria['urls'],
        'legendas_lidas' => $galeria['legendas'],
    );
} catch (Exception $e) {
    $out['erro'] = $e->getMessage();
}

echo json_encode($out, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
