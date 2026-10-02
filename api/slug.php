<?php
// Gera slugs ASCII a partir do titulo, com desambiguacao contra a tabela.
// Usado por api/insights/insert.php e update.php.

function cg_slugify(string $text): string
{
    $text = trim($text);

    $map = [
        'á' => 'a', 'à' => 'a', 'ã' => 'a', 'â' => 'a', 'ä' => 'a', 'å' => 'a',
        'é' => 'e', 'è' => 'e', 'ê' => 'e', 'ë' => 'e',
        'í' => 'i', 'ì' => 'i', 'î' => 'i', 'ï' => 'i',
        'ó' => 'o', 'ò' => 'o', 'õ' => 'o', 'ô' => 'o', 'ö' => 'o',
        'ú' => 'u', 'ù' => 'u', 'û' => 'u', 'ü' => 'u',
        'ç' => 'c', 'ñ' => 'n',
    ];

    $text = strtolower($text);
    $text = strtr($text, $map);
    $text = preg_replace('/[^a-z0-9]+/', '-', $text);
    $text = trim($text, '-');

    return $text;
}

function cg_unique_slug(PDO $db, string $base, ?int $ignoreId = null): string
{
    $base = cg_slugify($base);
    if ($base === '') {
        $base = 'insight';
    }

    $slug = $base;
    $suffix = 2;

    while (true) {
        $sql = 'SELECT id FROM insights WHERE slug = :slug';
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
