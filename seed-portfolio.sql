-- Migracao + seed do portfolio (as 6 obras de src/data/portfolio.ts).
-- Rode UMA vez no phpMyAdmin, no banco camargogallo26.
-- Se rodar de novo, o ALTER falha com "Duplicate column name".

-- 1) Cidade, ano e slug. O slug alimenta /portfolio/<slug> (pagina de detalhe).
ALTER TABLE portfolio
  ADD COLUMN cidade varchar(120) DEFAULT NULL AFTER descricao,
  ADD COLUMN ano varchar(4) DEFAULT NULL AFTER cidade,
  ADD COLUMN slug varchar(191) DEFAULT NULL AFTER titulo,
  ADD UNIQUE KEY uq_portfolio_slug (slug);

-- 2) Usuario autor dos registros
SET @uid = (SELECT id FROM users WHERE username = 'admin_cg' LIMIT 1);

-- 3) As 6 obras atuais. data_obra = ano-01-01 apenas para ordenacao
--    (a home mostra as 5 primeiras por data_obra DESC, id ASC).
INSERT INTO portfolio (titulo, slug, descricao, cidade, ano, imagem, categoria, data_obra, status, user_id) VALUES
  ('Recuperação de Fachadas — Condomínio Solar', 'recuperacao-de-fachadas-condominio-solar', 'Tratamento de patologias em revestimentos cerâmicos com pintura e textura acrílica, elimina eflorescência e garante uniformidade na fachada.', 'São Paulo, SP', '2024', '/assets/hero-slide/trat-patologias-revestimentos-ceramicos.webp', NULL, '2024-01-01', 'concluido', @uid),
  ('Conversão de Fachadas Cerâmicas para Texturizadas', 'conversao-de-fachadas-ceramicas-para-texturizadas', 'Substituição de revestimentos degradados por sistema texturizado de longa durabilidade, com preparo adequado do substrato.', 'Campinas, SP', '2024', '/assets/hero-slide/substituicao-de-revestimentos.webp', NULL, '2024-01-01', 'concluido', @uid),
  ('Impermeabilização de Lajes e Reservatórios', 'impermeabilizacao-de-lajes-e-reservatorios', 'Aplicação de sistema de impermeabilização com mapeamento de trincas e recalibragem de caimentos em lajes e reservatórios.', 'Guarulhos, SP', '2023', '/assets/hero-slide/BKQWmuKTS8_HJe2p.webp', NULL, '2023-01-01', 'concluido', @uid),
  ('Recuperação Estrutural de Concreto Armado', 'recuperacao-estrutural-de-concreto-armado', 'Reforço e recuperação de elementos estruturais com diagnóstico prévio, seguindo os limites normativos da NR-35.', 'Barueri, SP', '2023', '/assets/hero-slide/trat-patologias-revestimentos-ceramicos.webp', NULL, '2023-01-01', 'concluido', @uid),
  ('Tratamento de Áreas com Som Cavo por Injeção', 'tratamento-de-areas-com-som-cavo-por-injecao', 'Injeção de materiais de preenchimento em sílios com cavidade, recuperando a estanqueidade sem quebra de chapéu.', 'Osasco, SP', '2022', '/assets/hero-slide/substituicao-de-revestimentos.webp', NULL, '2022-01-01', 'concluido', @uid),
  ('Sobreposição de Fachadas Cerâmicas com Textura Acrílica', 'sobreposicao-de-fachadas-ceramicas-com-textura-acrilica', 'Sobreposição de revestimento cerâmico com textura acrílica dispensando a remoção total, reduzindo prazo e custo de obra.', 'Santo André, SP', '2022', '/assets/hero-slide/BKQWmuKTS8_HJe2p.webp', NULL, '2022-01-01', 'concluido', @uid);
