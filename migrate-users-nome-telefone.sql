-- Migration: adiciona nome e telefone à tabela users
-- Rode UMA vez no phpMyAdmin, no banco camargogallo26.
-- Se rodar de novo, o ALTER falha com "Duplicate column name".

ALTER TABLE users
  ADD COLUMN nome varchar(120) DEFAULT NULL AFTER username,
  ADD COLUMN telefone varchar(20) DEFAULT NULL AFTER email;

-- Backfill: usa o username como nome para registros antigos
UPDATE users SET nome = username WHERE nome IS NULL OR nome = '';
