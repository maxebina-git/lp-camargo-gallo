-- Adiciona ordenacao manual ao portfolio.
-- Rode UMA vez no phpMyAdmin, no banco camargogallo26.
-- Pressupoe que seed-portfolio.sql ja foi executado (colunas slug/cidade/ano existem).

ALTER TABLE portfolio
  ADD COLUMN ordem INT NOT NULL DEFAULT 0 AFTER status;

-- Backfill: preserva a ordem que home e listagem ja exibiam (data_obra DESC, id ASC).
SET @o := 0;
UPDATE portfolio SET ordem = (@o := @o + 1) ORDER BY data_obra DESC, id ASC;
