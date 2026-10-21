<?php
// Redirects de slug.
//
// Quando o slug de uma obra ou insight muda, o endereco antigo continua
// publicado (pode estar linkado, favoritado ou indexado). Este modulo
// guarda o par slug_antigo -> slug_novo para que a API publica possa
// responder "esse slug foi para la" em vez de 404.
//
// A tabela e criada na primeira escrita. A leitura e tolerante a tabela
// inexistente: nesse caso o slug antigo simplesmente volta 404, como antes.

// Cria a tabela de redirects uma vez por requisicao.
function cg_redirects_ensure_table(PDO $db): void
{
    static $criada = false;

    if ($criada) {
        return;
    }

    $db->exec(
        "CREATE TABLE IF NOT EXISTS redirects (
            id INT(11) NOT NULL AUTO_INCREMENT,
            tipo VARCHAR(20) NOT NULL,
            slug_antigo VARCHAR(191) NOT NULL,
            slug_novo VARCHAR(191) NOT NULL,
            criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY uk_tipo_antigo (tipo, slug_antigo),
            KEY ix_tipo_novo (tipo, slug_novo)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
    );

    $criada = true;
}

// Registra que o slug antigo passou a apontar para o novo.
// Se o slug antigo ja tinha redirect, ele e atualizado (a ultima versao
// vence). Redirects que apontavam para o slug antigo tambem sao
// reapontados, para nao deixar cadeia de dois saltos.
function cg_redirect_registrar(PDO $db, string $tipo, string $slugAntigo, string $slugNovo): void
{
    $slugAntigo = trim($slugAntigo);
    $slugNovo = trim($slugNovo);

    if ($slugAntigo === '' || $slugNovo === '' || $slugAntigo === $slugNovo) {
        return;
    }

    cg_redirects_ensure_table($db);

    // Colapsa a cadeia: quem apontava para o slug antigo passa a apontar
    // para o novo.
    $stmt = $db->prepare("UPDATE redirects SET slug_novo = :novo WHERE tipo = :tipo AND slug_novo = :antigo");
    $stmt->execute([':novo' => $slugNovo, ':tipo' => $tipo, ':antigo' => $slugAntigo]);

    $stmt = $db->prepare(
        "INSERT INTO redirects (tipo, slug_antigo, slug_novo) VALUES (:tipo, :antigo, :novo)
         ON DUPLICATE KEY UPDATE slug_novo = VALUES(slug_novo)"
    );
    $stmt->execute([':tipo' => $tipo, ':antigo' => $slugAntigo, ':novo' => $slugNovo]);
}

// Devolve o slug novo para o slug antigo, ou null se nao houver redirect.
function cg_redirect_buscar(PDO $db, string $tipo, string $slug): ?string
{
    $slug = trim($slug);

    if ($slug === '') {
        return null;
    }

    try {
        $stmt = $db->prepare("SELECT slug_novo FROM redirects WHERE tipo = :tipo AND slug_antigo = :antigo LIMIT 1");
        $stmt->execute([':tipo' => $tipo, ':antigo' => $slug]);
        $row = $stmt->fetch();

        if (!$row || empty($row['slug_novo'])) {
            return null;
        }

        return (string) $row['slug_novo'];
    } catch (Exception $e) {
        // Tabela ainda nao existe (ou indisponivel): sem redirect.
        return null;
    }
}
