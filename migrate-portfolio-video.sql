-- Adiciona o video do YouTube ao portfolio (embed na pagina da obra,
-- acima da galeria de imagens).
-- Rode UMA vez no phpMyAdmin, no banco camargogallo26.
-- ANTES do push: o deploy de api/ e admin/ e automatico e o INSERT/UPDATE
-- passa a gravar esta coluna; sem ela, o CRUD do admin quebra.
--
-- Guarda o link como o usuario colou (ex.:
--   https://youtu.be/YxwwEqbQLzw?si=5uiP6DduWKKs7Z5g)
-- A pagina extrai o ID do video na hora de montar o iframe; link invalido
-- simplesmente nao renderiza o bloco.

ALTER TABLE portfolio
  ADD COLUMN video_youtube VARCHAR(500) NULL AFTER imagens;
