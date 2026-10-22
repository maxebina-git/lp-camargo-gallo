-- migrate-portfolio-resumo.sql
-- Migração: Adicionar campo resumo ao portfolio (espelha o insights)
-- Banco: camargogallo26 (MySQL/MariaDB)
-- Executado: via phpMyAdmin ou console MySQL
-- --------------------------------------------------------

-- --------------------------------------------------------
-- 1. Verificar estrutura atual da tabela portfolio
-- --------------------------------------------------------
DESCRIBE portfolio;

-- --------------------------------------------------------
-- 2. Adicionar a coluna resumo
--    Texto, NOT NULL com default vazio para nao quebrar obras
--    existentes que nao possuem resumo preenchido.
-- --------------------------------------------------------
ALTER TABLE `portfolio` ADD COLUMN `resumo` text NOT NULL DEFAULT '' AFTER `descricao`;

-- --------------------------------------------------------
-- 3. Verificar resultado
-- --------------------------------------------------------
DESCRIBE portfolio;

-- --------------------------------------------------------
-- Observacoes
-- --------------------------------------------------------
-- O campo resumo segue o mesmo tratamento do insights:
--   - preenchido no cadastro/edicao da obra (modal do admin)
--   - devolvido pela API publica (portfolio_item.php)
--   - exibido no front da obra (portfolio-view.astro) com destaque
--   - exibe-se vazio para obras cadastradas antes desta migracao
-- --------------------------------------------------------

-- FIM DA MIGRAÇÃO
