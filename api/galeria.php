<?php
// Galeria multiplas-imagens do portfolio.
// SUPPORTS BOTH FORMATS:
//   Old format: ["image1.jpg", "image2.jpg"]
//   New format: [{"url": "image1.jpg", "legenda": "Legenda 1"}, ...]

// Define a qtd maxima de imagens.
define('CG_MAX_IMAGENS', 22);

// Tenta ler 'imagens' do input (pode ser array, string JSON ou vazio).
// Retorna array de itens: [['url' => '...', 'legenda' => '...'], ...]
// Mantém compatibilidade com formato antigo (apenas strings): ['...', '...']
function cg_parse_imagens($input) {
    $raw = isset($input['imagens']) ? $input['imagens'] : null;
    $itens = [];

    if (is_array($raw)) {
        // Novo formato: [{url: '...', legenda: '...'}, ...]
        // Ou formato antigo: ['...', '...']
        foreach ($raw as $item) {
            if (is_array($item) && isset($item['url'])) {
                $itens[] = [
                    'url' => trim($item['url']),
                    'legenda' => isset($item['legenda']) ? trim($item['legenda']) : ''
                ];
            } elseif (is_string($item)) {
                $itens[] = [
                    'url' => trim($item),
                    'legenda' => ''
                ];
            }
        }
    } elseif (is_string($raw) && trim($raw) !== '') {
        $decoded = json_decode($raw, true);
        if (is_array($decoded)) {
            foreach ($decoded as $item) {
                if (is_array($item) && isset($item['url'])) {
                    $itens[] = [
                        'url' => trim($item['url']),
                        'legenda' => isset($item['legenda']) ? trim($item['legenda']) : ''
                    ];
                } elseif (is_string($item)) {
                    $itens[] = [
                        'url' => trim($item),
                        'legenda' => ''
                    ];
                }
            }
        }
    }

    // Se nao teve itens, usa a capa isolada (fallback obra antiga)
    if (empty($itens)) {
        $capa = (isset($input['imagem']) && is_string($input['imagem'])) ? trim($input['imagem']) : '';
        $itens = $capa !== '' ? [['url' => $capa, 'legenda' => '']] : [];
    }

    // Limite de imagens
    $itens = array_slice($itens, 0, CG_MAX_IMAGENS);

    return $itens;
}

// Le uma linha vinda do banco e devolve a galeria como array de urls + legendas.
// Fallback para as obras antigas: imagens NULL -> [imagem]; sem nada -> [].
// RETORNA SEMPRE UM ARRAY VALIDO - nunca causa exception.
function cg_imagens_list($row) {
    $urls = [];
    $legendas = [];

    $raw = isset($row['imagens']) ? $row['imagens'] : null;

    if (is_array($raw)) {
        // Novo formato: [{url: '...', legenda: '...'}, ...]
        foreach ($raw as $item) {
            if (is_array($item) && isset($item['url'])) {
                $urls[] = trim($item['url']);
                $legendas[] = isset($item['legenda']) ? trim($item['legenda']) : '';
            } elseif (is_string($item)) {
                $urls[] = trim($item);
                $legendas[] = '';
            }
        }
    } elseif (is_string($raw) && trim($raw) !== '') {
        $decoded = json_decode($raw, true);
        if (is_array($decoded)) {
            foreach ($decoded as $item) {
                if (is_array($item) && isset($item['url'])) {
                    $urls[] = trim($item['url']);
                    $legendas[] = isset($item['legenda']) ? trim($item['legenda']) : '';
                } elseif (is_string($item)) {
                    $urls[] = trim($item);
                    $legendas[] = '';
                }
            }
        }
    }

    // Fallback para coluna imagem (obras antigas que ainda usam a coluna imagem)
    // SEMPRE garante pelo menos um resultado se houver dado
    $capa = isset($row['imagem']) ? $row['imagem'] : null;
    if (is_string($capa) && $capa !== '' && empty($urls)) {
        $urls = [$capa];
        $legendas = [''];
    }

    // RETORNO SEMPRE ARRAY - mesmo que vazio
    return ['urls' => array_values($urls), 'legendas' => array_values($legendas)];
}

// Serializa a galeria para a coluna TEXT.
// Agora guarda o formato enriquecido: [{"url": "...", "legenda": "..."}, ...]
function cg_imagens_json($galeria) {
    if (!is_array($galeria) || !$galeria) {
        return null;
    }

    $itens = [];
    foreach ($galeria as $idx => $url) {
        // $url pode ser string (legacy) ou array ['url' => '...', 'legenda' => '...']
        $legenda = '';
        $urlStr = (string) $url;

        if (is_array($url)) {
            $legenda = isset($galeria[$idx]['legenda'] ?? '') ? $galeria[$idx]['legenda'] : '';
            $urlStr = $url['url'] ?? $url[0] ?? '';
        }

        $itens[] = ['url' => $urlStr, 'legenda' => $legenda];
    }

    return json_encode($itens, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
}