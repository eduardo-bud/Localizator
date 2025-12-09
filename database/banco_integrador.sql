/* Schema cleaned and aligned with generated Sequelize models.
   Note: some original definitions had ambiguities/duplicates; this version
   uses single primary keys where appropriate and explicit foreign keys.
*/

CREATE TABLE projeto_lista_material (
  id_lista INTEGER PRIMARY KEY,
  id_projeto INTEGER,
  nome TEXT,
  descricao TEXT,
  ativo BOOLEAN,
  criado_em DATE,
  atualizado_em DATE
);

CREATE TABLE material (
  id_material INTEGER PRIMARY KEY,
  nome TEXT,
  descricao TEXT,
  categoria TEXT,
  unidade_medida TEXT,
  estoque_minimo REAL,
  estoque_atual REAL,
  criado_em DATE,
  atualizado_em DATE
);

CREATE TABLE lista_material_item (
  id_item INTEGER PRIMARY KEY,
  id_lista INTEGER,
  id_material INTEGER,
  quantidade_necessaria REAL,
  observacao TEXT,
  FOREIGN KEY (id_lista) REFERENCES projeto_lista_material(id_lista) ON DELETE CASCADE,
  FOREIGN KEY (id_material) REFERENCES material(id_material) ON DELETE SET NULL
);

CREATE TABLE espaco (
  id_espaco INTEGER PRIMARY KEY,
  nome TEXT,
  descricao TEXT,
  altura INTEGER,
  largura INTEGER,
  criado_em DATE,
  atualizado_em DATE
);

CREATE TABLE sub_espaco (
  id_espaco INTEGER PRIMARY KEY,
  nome TEXT,
  descricao TEXT,
  largura INTEGER,
  altura INTEGER,
  criado_em DATE,
  atualizado_em DATE,
  cordenada_altura INTEGER,
  cordenada_largura INTEGER,
  fk_espaco_id_espaco INTEGER,
  FOREIGN KEY (fk_espaco_id_espaco) REFERENCES espaco(id_espaco) ON DELETE CASCADE
);

CREATE TABLE entradas (
  id_entrada INTEGER PRIMARY KEY,
  id_pedido_item INTEGER,
  data_entrada DATE,
  usuario_responsavel TEXT,
  nota_fiscal TEXT,
  fornecedor TEXT,
  observacao TEXT,
  fk_endereco_id_endereco INTEGER,
  fk_usuario_id_usuario INTEGER,
  fk_projeto_lista_material_id_lista INTEGER,
  FOREIGN KEY (fk_usuario_id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
  FOREIGN KEY (fk_projeto_lista_material_id_lista) REFERENCES projeto_lista_material(id_lista) ON DELETE SET NULL
);

CREATE TABLE retiradas (
  id_retirada INTEGER PRIMARY KEY,
  data_retirada DATE,
  motivo TEXT,
  observacao TEXT,
  fk_usuario_id_usuario INTEGER,
  FOREIGN KEY (fk_usuario_id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

CREATE TABLE alerta_minimo (
  id_alerta INTEGER PRIMARY KEY,
  id_material INTEGER,
  quantidade_minima REAL,
  enviado BOOLEAN,
  data_envio DATE,
  fk_material_id_material INTEGER,
  FOREIGN KEY (fk_material_id_material) REFERENCES material(id_material) ON DELETE CASCADE
);

CREATE TABLE log_pesquisa (
  id_pesquisa INTEGER PRIMARY KEY,
  id_usuario INTEGER,
  campo_base TEXT,
  valor_pesquisado TEXT,
  tipo_dado TEXT,
  data_hora DATE,
  fk_usuario_id_usuario INTEGER,
  FOREIGN KEY (fk_usuario_id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

CREATE TABLE log_delete (
  id_exclusao INTEGER PRIMARY KEY,
  id_usuario INTEGER,
  tipo_registro TEXT,
  id_registro INTEGER,
  data_hora DATE,
  motivo TEXT,
  backup_json TEXT,
  status BOOLEAN,
  fk_usuario_id_usuario INTEGER,
  FOREIGN KEY (fk_usuario_id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

CREATE TABLE usuario (
  id_usuario INTEGER PRIMARY KEY,
  nome_usuario TEXT,
  senha_hash TEXT,
  cargo TEXT,
  ativo BOOLEAN,
  criado_em DATE,
  atualizado_em DATE
);

CREATE TABLE pedido (
  id_pedido INTEGER PRIMARY KEY,
  status TEXT,
  criado_em DATE,
  atualizado_em DATE,
  id_lista_material INTEGER,
  fk_projeto_lista_material_id_lista INTEGER,
  FOREIGN KEY (fk_projeto_lista_material_id_lista) REFERENCES projeto_lista_material(id_lista) ON DELETE CASCADE
);

CREATE TABLE pedido_item (
  id_pedido_item INTEGER PRIMARY KEY,
  id_pedido INTEGER,
  id_material INTEGER,
  quantidade_pedida REAL,
  quantidade_recebida REAL,
  observacao TEXT,
  fk_pedido_id_pedido INTEGER,
  FOREIGN KEY (fk_pedido_id_pedido) REFERENCES pedido(id_pedido) ON DELETE RESTRICT,
  FOREIGN KEY (id_material) REFERENCES material(id_material) ON DELETE SET NULL
);

CREATE TABLE material_entrada_material_entrada (
  id_entrada_material INTEGER PRIMARY KEY,
  id_entrada INTEGER,
  id_material INTEGER,
  quantidade REAL,
  fk_material_id_material INTEGER,
  fk_entradas_id_entrada INTEGER,
  FOREIGN KEY (fk_material_id_material) REFERENCES material(id_material),
  FOREIGN KEY (fk_entradas_id_entrada) REFERENCES entradas(id_entrada)
);

CREATE TABLE retirada_material_retirada_material (
  id_retirada_material INTEGER PRIMARY KEY,
  id_retirada INTEGER,
  id_material INTEGER,
  quantidade REAL,
  fk_material_id_material INTEGER,
  fk_retiradas_id_retirada INTEGER,
  FOREIGN KEY (fk_material_id_material) REFERENCES material(id_material),
  FOREIGN KEY (fk_retiradas_id_retirada) REFERENCES retiradas(id_retirada)
);

CREATE TABLE formato (
  id_formato INTEGER PRIMARY KEY,
  id_espaco INTEGER,
  distancia REAL,
  angulo REAL,
  fk_espaco_id_espaco INTEGER,
  FOREIGN KEY (fk_espaco_id_espaco) REFERENCES espaco(id_espaco) ON DELETE RESTRICT
);

CREATE TABLE endereco_material_endereco (
  id_endereco_material INTEGER,
  id_endereco INTEGER,
  id_material INTEGER,
  id_subespaco INTEGER,
  quantidade REAL,
  atualizado_em DATE,
  cordenada_altura INTEGER,
  cordenada_largura INTEGER,
  capacidade REAL,
  observacao TEXT,
  fk_material_id_material INTEGER,
  PRIMARY KEY (id_endereco_material, id_endereco),
  FOREIGN KEY (fk_material_id_material) REFERENCES material(id_material)
);

CREATE TABLE _contem_subespaco_interno (
  id_interno INTEGER PRIMARY KEY,
  id_subespaco INTEGER,
  id_subespaco_interno INTEGER
);

CREATE TABLE esta (
  fk_material_id_material INTEGER,
  fk_lista_material_item_id_item INTEGER,
  fk_pedido_item_id_pedido_item INTEGER,
  FOREIGN KEY (fk_material_id_material) REFERENCES material(id_material) ON DELETE RESTRICT,
  FOREIGN KEY (fk_lista_material_item_id_item) REFERENCES lista_material_item(id_item) ON DELETE SET NULL,
  FOREIGN KEY (fk_pedido_item_id_pedido_item) REFERENCES pedido_item(id_pedido_item) ON DELETE SET NULL
);

CREATE TABLE tem (
  fk_projeto_lista_material_id_lista INTEGER,
  fk_projeto_lista_material_id_projeto INTEGER,
  fk_sub_espaco_id_sub_espaco INTEGER,
  FOREIGN KEY (fk_projeto_lista_material_id_lista) REFERENCES projeto_lista_material(id_lista) ON DELETE SET NULL,
  FOREIGN KEY (fk_sub_espaco_id_sub_espaco) REFERENCES sub_espaco(id_espaco)
);
