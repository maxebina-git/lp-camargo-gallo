<?php
// Galeria multiplas-imagens do portfolio.
// A coluna `imagens` guarda um JSON array de paths, ex.:
//   ["/assets/uploads/a.webp", "/assets/uploads/b.webp"]
// A primeira posicao e a capa (coluna `imagem`), que e o que os cards da
// home e das listagens usam — as listagens continuam lendo so `imagem`.

// Monta a galeria a partir do input do admin. Aceita `imagens` como string
// JSON (form-urlencoded) ou array (JSON body); se ausente, cai para `imagem`
// (obra antiga vira galeria de 1 item). Devolve array PHP limpo, no maximo
// CG_MAX_IMAGENS entradas, so strings nao vazias; [] quando nao ha imagem.
define('CG_MAX_IMAGENS', 20);

function cg_parse_imagens($input) {
    $raw = isset($input['imagens']) ? $input['imagens'] : null;
    $list = null;

    if (is_array($raw)) {
        $list = $raw;
    } elseif (is_string($raw) && trim($raw) !== '') {
        $decoded = json_decode($raw, true);
        if (is_array($decoded)) {
            $list = $decoded;
        }
    }

    if ($list === null) {
        $capa = (isset($input['imagem']) && is_string($input['imagem'])) ? trim($input['imagem']) : '';
        $list = ($capa !== '') ? [$capa] : array();
    }

    $clean = array();
    foreach ($list as $path) {
        if (is_string($path) && trim($path) !== '') {
            $clean[] = trim($path);
        }
        if (count($clean) >= CG_MAX_IMAGENS) {
            break;
        }
    }
    return $clean;
}

// Le uma linha vinda do banco e devolve a galeria como array PHP.
// Fallback para as obras antigas: imagens NULL -> [imagem]; sem nada -> [].
function cg_imagens_list($row) {
    $raw = isset($row['imagens']) ? $row['imagens'] : null;

    if (is_array($raw)) {
        return array_values(array_filter($raw, 'is_string'));
    }
    if (is_string($raw) && trim($raw) !== '') {
        $decoded = json_decode($raw, true);
        if (is_array($decoded)) {
            return array_values(array_filter($decoded, 'is_string'));
        }
    }

    $capa = isset($row['imagem']) ? $row['imagem'] : null;
    return (is_string($capa) && $capa !== '') ? array($capa) : array();
}

// Serializa a galeria para a coluna TEXT (null quando vazia).
function cg_imagens_json($galeria) {
    if (!is_array($galeria) || !$galeria) {
        return null;
    }
    return json_encode(array_values($galeria), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
}
?>
