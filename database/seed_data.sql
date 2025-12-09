-- Seed data para tabela usuario com senhas hash bcrypt
-- Teste: adm / 12345 | funcionario / senha123

INSERT INTO usuario (id_usuario, nome_usuario, senha_hash, cargo, ativo, criado_em, atualizado_em) VALUES
(1, 'adm', '$2b$10$6viBi8QcWVmNB4JacIIhzujQDBn4VF0aAsshH/P09umLk5SQP9GqC', 'administrador', 1, datetime('now'), datetime('now')),
(2, 'funcionario', '$2b$10$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5YmMxSUFutQFm', 'funcionário', 1, datetime('now'), datetime('now'));

-- Senha 'adm': 12345
-- Senha 'funcionario': senha123
