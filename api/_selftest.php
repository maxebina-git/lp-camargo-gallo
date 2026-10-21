<?php
// Self-test temporario: valida a logica da galeria no PHP real do servidor
// e identifica qual sintaxe da versao anterior quebrava o include (500).
require_once __DIR__ . '/galeria.php';
header('Content-Type: application/json');

$out = array();

// 1) Round-trip: input do admin -> urls + legendas -> JSON salvo na coluna.
$input = array(
    'imagens' => json_encode(array(
        array('url' => '/assets/uploads/a.jpg', 'legenda' => 'Fachada principal'),
        array('url' => '/assets/uploads/b.jpg', 'legenda' => ''),
        array('url' => '/assets/uploads/c.jpg', 'legenda' => 'Detalhe'),
    )),
    'imagem' => '/assets/uploads/a.jpg',
);
$urls = cg_parse_imagens($input);
$legendas = cg_parse_legendas($input);
$out['roundtrip'] = array(
    'urls' => $urls,
    'legendas' => $legendas,
    'json' => cg_imagens_json($urls, $legendas),
);

// 2) Le do banco: formato novo (com legenda).
$row = array('imagens' => '[{"url":"/x/1.jpg","legenda":"Um"},{"url":"/x/2.jpg","legenda":"Dois"}]', 'imagem' => '/x/1.jpg');
$out['db_novo'] = array('urls' => cg_imagens_list($row), 'legendas' => cg_imagens_legendas($row));

// 3) Le do banco: formato antigo (so strings).
$row = array('imagens' => '["/x/1.jpg","/x/2.jpg"]', 'imagem' => '/x/1.jpg');
$out['db_antigo'] = array('urls' => cg_imagens_list($row), 'legendas' => cg_imagens_legendas($row));

// 4) Le do banco: imagens NULL -> fallback para a capa.
$row = array('imagens' => null, 'imagem' => '/x/capa.jpg');
$out['db_null'] = array('urls' => cg_imagens_list($row), 'legendas' => cg_imagens_legendas($row));

// 5) Le do banco: '[]' -> galeria vazia (sem fallback).
$row = array('imagens' => '[]', 'imagem' => '/x/capa.jpg');
$out['db_vazio'] = array('urls' => cg_imagens_list($row), 'legendas' => cg_imagens_legendas($row));

// 6) Qual sintaxe da versao anterior causava o erro fatal de include?
$suspeitas = array(
    'isset_coalesce' => '$a = array("x" => 1); $v = isset($a["x"] ?? "");',
    'chain_coalesce' => '$a = array("x" => 1); $v = $a["x"] ?? $a[0] ?? "";',
    'string_cast' => '$a = array("x" => 1); $v = (string) $a;',
);
$out['sintaxe'] = array();
foreach ($suspeitas as $nome => $codigo) {
    try {
        eval($codigo);
        $out['sintaxe'][$nome] = 'OK';
    } catch (Throwable $e) {
        $out['sintaxe'][$nome] = get_class($e) . ': ' . $e->getMessage();
    }
}

echo json_encode($out, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
