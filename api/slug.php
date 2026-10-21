<?php
// Gera slugs ASCII a partir do titulo, com desambiguacao contra a tabela.
// Usado pelos insert/update de insights e portfolio. A tabela e whitelisted.

require_once __DIR__ . '/redirects.php';

function cg_slugify(string $text): string
{
    $text = trim($text);

    // O strtolower do PHP so trata ASCII, entao as maiusculas acentuadas
    // precisam estar no mapa: sem isso "ÁREA" viraria "-rea" aqui e
    // "area" no slugify do admin (que usa NFD), e as duas pontas
    // discordariam do mesmo titulo.
    $map = [
        'á' => 'a', 'à' => 'a', 'ã' => 'a', 'â' => 'a', 'ä' => 'a', 'å' => 'a',
        'é' => 'e', 'è' => 'e', 'ê' => 'e', 'ë' => 'e',
        'í' => 'i', 'ì' => 'i', 'î' => 'i', 'ï' => 'i',
        'ó' => 'o', 'ò' => 'o', 'õ' => 'o', 'ô' => 'o', 'ö' => 'o',
        'ú' => 'u', 'ù' => 'u', 'û' => 'u', 'ü' => 'u',
        'ç' => 'c', 'ñ' => 'n',
        'Á' => 'a', 'À' => 'a', 'Ã' => 'a', 'Â' => 'a', 'Ä' => 'a', 'Å' => 'a',
        'É' => 'e', 'È' => 'e', 'Ê' => 'e', 'Ë' => 'e',
        'Í' => 'i', 'Ì' => 'i', 'Î' => 'i', 'Ï' => 'i',
        'Ó' => 'o', 'Ò' => 'o', 'Õ' => 'o', 'Ô' => 'o', 'Ö' => 'o',
        'Ú' => 'u', 'Ù' => 'u', 'Û' => 'u', 'Ü' => 'u',
        'Ç' => 'c', 'Ñ' => 'n',
    ];

    $text = strtolower($text);
    $text = strtr($text, $map);
    $text = preg_replace('/[^a-z0-9]+/', '-', $text);
    $text = trim($text, '-');

    return $text;
}

function cg_unique_slug(PDO $db, string $table, string $base, ?int $ignoreId = null): string
{
    $fallbacks = [
        'insights'  => 'insight',
        'portfolio' => 'obra',
    ];
    if (!isset($fallbacks[$table])) {
        throw new InvalidArgumentException('Tabela nao suportada para slug: ' . $table);
    }

    $base = cg_slugify($base);
    if ($base === '') {
        $base = $fallbacks[$table];
    }

    $slug = $base;
    $suffix = 2;

    while (true) {
        $sql = "SELECT id FROM {$table} WHERE slug = :slug";
        $params = [':slug' => $slug];

        if ($ignoreId !== null) {
            $sql .= ' AND id <> :id';
            $params[':id'] = $ignoreId;
        }

        $sql .= ' LIMIT 1';

        $stmt = $db->prepare($sql);
        $stmt->execute($params);

        if (!$stmt->fetch()) {
            return $slug;
        }

        $slug = $base . '-' . $suffix;
        $suffix++;
    }
}

// Slug pedido pelo admin, ou '' se ele nao mandou nenhum.
// Trim: o campo em branco no formulario chega como string vazia.
function cg_slug_input(array $input): string
{
    if (!isset($input['slug']) || !is_string($input['slug'])) {
        return '';
    }

    return trim($input['slug']);
}

// Resolve o slug final do item e registra o redirect quando ele muda.
//
// Se o admin mandou um slug, ele manda (com a desambiguacao de colisao).
// Se nao mandou — ou mandou em branco — o slug vem do titulo, que e o
// caso de quando o titulo foi alterado e o editor deixou o campo seguir
// sozinho.
//
// $slugAtual e o slug que estava gravado (null em inserts). Quando o slug
// final difere do atual, o endereco antigo passa a responder com o novo.
function cg_resolver_slug(PDO $db, string $table, string $slugInput, string $titulo, ?int $id, ?string $slugAtual = null): string
{
    $base = ($slugInput === '') ? $titulo : $slugInput;
    $slug = cg_unique_slug($db, $table, $base, $id);

    if ($slugAtual !== null && $slugAtual !== '' && $slugAtual !== $slug) {
        // Falhar em registrar o redirect nao pode impedir o salvamento do
        // item: e melhor perder o redirect do que a obra.
        try {
            cg_redirect_registrar($db, $table, $slugAtual, $slug);
        } catch (Exception $e) {
            error_log('cg_resolver_slug: nao foi possivel registrar o redirect de "' . $slugAtual . '" para "' . $slug . '": ' . $e->getMessage());
        }
    }

    return $slug;
}
