<?php
// Diagnostico temporario de deploy: confere se os arquivos do API chegaram
// intactos no servidor. Remover depois da verificacao.
header('Content-Type: application/json');

$arquivos = array(
    'galeria.php',
    'portfolio/list.php',
    'portfolio/insert.php',
    'portfolio/update.php',
    'public/portfolio_item.php',
);

$out = array('php' => PHP_VERSION);
foreach ($arquivos as $arquivo) {
    $caminho = __DIR__ . '/' . $arquivo;
    $existe = file_exists($caminho);
    $out[$arquivo] = array(
        'existe' => $existe,
        'size' => $existe ? filesize($caminho) : 0,
        'sha1' => $existe ? sha1_file($caminho) : '',
    );
}

echo json_encode($out);
