<?php
// Galeria multiplas-imagens do portfolio.
// A coluna `imagens` (TEXT) guarda um JSON array. Dois formatos aceitos:
//   Antigo: ["/assets/uploads/a.webp", "/assets/uploads/b.webp"]
//   Novo:   [{"url": "/assets/uploads/a.webp", "legenda": "Fachada"}, ...]
// A primeira posicao e a capa (coluna `imagem`).
//
// IMPORTANTE: este arquivo roda em PHP 7.4 no servidor.
// NUNCA escreva isset($algo ?? ''): o isset() nao aceita o operador ?? como
// argumento no PHP 7 e isso vira erro de parse. Como o erro de parse quebra
// o arquivo inteiro, o require_once falhava com HTTP 500 em list.php,
// portfolio_item.php, insert.php e update.php — o que zerava a contagem do
// dashboard, a listagem do admin e a pagina da obra no front.
// Use o operador ?? normalmente (fora do isset) ou o padrao abaixo:
//   $v = (isset($a['x']) && $a['x'] !== '') ? $a['x'] : '';

// Define a qtd maxima de imagens.
define('CG_MAX_IMAGENS', 22);

// Normaliza uma lista de imagens (array PHP) em pares url/legenda.
// Aceita strings (formato antigo) e objetos com url/legenda (formato novo).
// Retorna array com entradas array('url' => ..., 'legenda' => ...).
function cg_itens_imagens($lista) {
    $itens = array();

    if (!is_array($lista)) {
        return $itens;
    }

    foreach ($lista as $item) {
        if (is_array($item) && isset($item['url']) && is_string($item['url'])) {
            $url = trim($item['url']);
            $legenda = '';
            if (isset($item['legenda']) && is_string($item['legenda'])) {
                $legenda = trim($item['legenda']);
            }
            if ($url !== '') {
                $itens[] = array('url' => $url, 'legenda' => $legenda);
            }
        } elseif (is_string($item)) {
            $url = trim($item);
            if ($url !== '') {
                $itens[] = array('url' => $url, 'legenda' => '');
            }
        }
    }

    return $itens;
}

// Monta a galeria a partir do input do admin. Aceita `imagens` como string
// JSON (form-urlencoded) ou array (JSON body); se ausente, cai para `imagem`
// (obra antiga vira galeria de 1 item). Devolve array de pares url/legenda,
// no maximo CG_MAX_IMAGENS entradas.
function cg_parse_itens($input) {
    $raw = isset($input['imagens']) ? $input['imagens'] : null;
    $itens = null;

    if (is_array($raw)) {
        $itens = cg_itens_imagens($raw);
    } elseif (is_string($raw) && trim($raw) !== '') {
        $decoded = json_decode($raw, true);
        if (is_array($decoded)) {
            $itens = cg_itens_imagens($decoded);
        }
    }

    if ($itens === null) {
        $capa = (isset($input['imagem']) && is_string($input['imagem'])) ? trim($input['imagem']) : '';
        $itens = ($capa !== '') ? array(array('url' => $capa, 'legenda' => '')) : array();
    }

    if (count($itens) > CG_MAX_IMAGENS) {
        $itens = array_slice($itens, 0, CG_MAX_IMAGENS);
    }

    return $itens;
}

// URLs da galeria vindos do input do admin (formato antigo, so strings).
function cg_parse_imagens($input) {
    $urls = array();
    foreach (cg_parse_itens($input) as $item) {
        $urls[] = $item['url'];
    }
    return $urls;
}

// Legendas da galeria vindas do input do admin, na mesma ordem das URLs.
function cg_parse_legendas($input) {
    $legendas = array();
    foreach (cg_parse_itens($input) as $item) {
        $legendas[] = $item['legenda'];
    }
    return $legendas;
}

// Le uma linha vinda do banco e devolve a galeria em pares url/legenda.
// Fallback para as obras antigas: imagens NULL -> [imagem]; sem nada -> [].
function cg_itens_linha($row) {
    $raw = isset($row['imagens']) ? $row['imagens'] : null;

    if (is_array($raw)) {
        return cg_itens_imagens($raw);
    }
    if (is_string($raw) && trim($raw) !== '') {
        $decoded = json_decode($raw, true);
        if (is_array($decoded)) {
            return cg_itens_imagens($decoded);
        }
    }

    $capa = isset($row['imagem']) ? $row['imagem'] : null;
    if (is_string($capa) && trim($capa) !== '') {
        return array(array('url' => trim($capa), 'legenda' => ''));
    }
    return array();
}

// Galeria completa de uma linha do banco: urls + legendas.
// Use esta funcao nos endpoints que devolvem a galeria. O motivo: se voce
// chama cg_imagens_list() e depois cg_imagens_legendas() na mesma linha,
// a primeira chamada sobrescreve $row['imagens'] pelo array de URLs e a
// segunda ja nao encontra o JSON original — a legenda volta vazia.
function cg_galeria_linha($row) {
    $urls = array();
    $legendas = array();
    foreach (cg_itens_linha($row) as $item) {
        $urls[] = $item['url'];
        $legendas[] = $item['legenda'];
    }
    return array('urls' => $urls, 'legendas' => $legendas);
}

// URLs da galeria vindas do banco (contrato antigo, so strings).
function cg_imagens_list($row) {
    $galeria = cg_galeria_linha($row);
    return $galeria['urls'];
}

// Legendas da galeria vindas do banco, na mesma ordem das URLs.
function cg_imagens_legendas($row) {
    $galeria = cg_galeria_linha($row);
    return $galeria['legendas'];
}

// Serializa a galeria para a coluna TEXT no formato enriquecido:
//   [{"url": "...", "legenda": "..."}, ...]
// O parametro $legendas e opcional para nao quebrar chamadas antigas.
function cg_imagens_json($galeria, $legendas = array()) {
    if (!is_array($galeria) || !$galeria) {
        return null;
    }

    $itens = array();
    $total = count($galeria);
    for ($i = 0; $i < $total; $i++) {
        if (!isset($galeria[$i]) || !is_string($galeria[$i])) {
            continue;
        }
        $url = trim($galeria[$i]);
        if ($url === '') {
            continue;
        }
        $legenda = '';
        if (is_array($legendas) && isset($legendas[$i]) && is_string($legendas[$i])) {
            $legenda = trim($legendas[$i]);
        }
        $itens[] = array('url' => $url, 'legenda' => $legenda);
    }

    if (!$itens) {
        return null;
    }

    return json_encode($itens, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
}
