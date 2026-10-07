-- Adiciona a galeria multiplas-imagens ao portfolio.
-- Rode UMA vez no phpMyAdmin, no banco camargogallo26.
-- ANTES do push: o deploy de api/ e admin/ e automatico e o INSERT/UPDATE
-- passa a gravar esta coluna; sem ela, o CRUD do admin quebra.
--
-- imagens guarda um JSON array de paths, ex.: ["/assets/uploads/a.webp", ...]
-- TEXT (nao o tipo JSON) para funcionar em qualquer versao do MySQL.
-- As obras antigas ficam com NULL: a API faz fallback para a coluna
-- imagem (a capa vira galeria de 1 item) na leitura.

ALTER TABLE portfolio
  ADD COLUMN imagens TEXT NULL AFTER imagem;
