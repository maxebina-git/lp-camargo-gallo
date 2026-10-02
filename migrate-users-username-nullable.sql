-- Migration: descontinua o campo username (login agora é o email).
-- O username era NOT NULL + UNIQUE; sem preenchimento, novos inserts
-- falham com "Duplicate entry '' for key 'username'".
-- Rode UMA vez no phpMyAdmin, no banco camargogallo26.

ALTER TABLE users
  MODIFY COLUMN username varchar(50) DEFAULT NULL,
  DROP INDEX username;
