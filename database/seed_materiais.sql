-- Seed data adicional com materiais para testes

-- Materiais com estoque baixo para gerar alertas
INSERT INTO material (id_material, nome, descricao, unidade, estoque_atual, estoque_minimo) VALUES
(1, 'Parafuso M4', 'Parafuso de aço inoxidável', 'Unidade', 5, 20),
(2, 'Porca M4', 'Porca de aço carbono', 'Unidade', 10, 15),
(3, 'Aruela Plana', 'Aruela para fixação', 'Pacote', 2, 10),
(4, 'Rebite Cego', 'Rebite de alumínio', 'Caixa', 8, 50),
(5, 'Óleo para Motor', 'Óleo sintético 5W30', 'Litro', 3, 5);

-- Pedidos para gerar alertas de pedidos pendentes
INSERT INTO pedido (id_pedido, descricao, data_criacao, data_entrega_prevista, status) VALUES
(1, 'Pedido de parafusos diversos', datetime('now'), datetime('now', '+7 days'), 'Pendente'),
(2, 'Pedido de porcas e arruelas', datetime('now', '-2 days'), datetime('now', '+5 days'), 'Processando'),
(3, 'Pedido de rebites', datetime('now', '-1 days'), datetime('now', '+10 days'), 'Pendente');
