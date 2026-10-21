-- migrate-portfolio-legendas.sql
-- Migração: Adicionar suporte a legenda por imagem no portfolio
-- Banco: camargogallo26 (MySQL/MariaDB)
-- Executado: via phpMyAdmin ou console MySQL
-- --------------------------------------------------------

-- --------------------------------------------------------
-- 1. Verificar estrutura atual da tabela portfolio
-- --------------------------------------------------------
DESCRIBE portfolio;

-- --------------------------------------------------------
-- 2. Verificar dados existentes (amostra)
-- --------------------------------------------------------
SELECT id, titulo, LEFT(imagens, 100) as img_preview, LENGTH(imagens) as img_tamanho
FROM portfolio 
LIMIT 5;

-- --------------------------------------------------------
-- 3. Garantir que todas as obras tenham imagens no formato JSON
-- --------------------------------------------------------
-- Esta query corrige obras antigas que possam ter imagens NULL ou vazias
-- O formato será compatível com o novo sistema de legenda por imagem
-- --------------------------------------------------------
UPDATE portfolio 
SET imagens = '[]' 
WHERE imagens IS NULL OR imagens = '' OR imagens = '';

-- --------------------------------------------------------
-- 4. Verificar resultado pós-migração
-- --------------------------------------------------------
SELECT id, titulo, 
       CASE 
         WHEN imagens IS NULL THEN 'NULL' 
         WHEN imagens = '' THEN 'VAZIO' 
         ELSE 'POPULADO' 
       END as imagens_status,
       LENGTH(imagens) as chars
FROM portfolio 
LIMIT 5;

-- --------------------------------------------------------
-- 5. Observações importantes
-- --------------------------------------------------------
-- O campo 'imagens' já existe como TEXT no banco de dados.
-- Esta migração apenas:
--   - Corrige dados NULL/VAZIO para formato JSON vazio '[]'
--   - Deixa o campo pronto para receber o novo formato:
--       [{"url": "caminho/imagem.jpg", "legenda": "Minhas férias 2024"}, ...]
--   - NÃO altera a estrutura da tabela (coluna permanece TEXT)
--   - Mantém backward compatibility com formato antigo:
--       ["image1.jpg", "image2.jpg"]
-- --------------------------------------------------------

-- FIM DA MIGRAÇÃO