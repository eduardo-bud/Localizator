module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Entrada', {
    id_entrada: { type: DataTypes.INTEGER, primaryKey: true },
    id_pedido_item: { type: DataTypes.INTEGER },
    data_entrada: { type: DataTypes.DATE },
    usuario_responsavel: { type: DataTypes.STRING },
    nota_fiscal: { type: DataTypes.STRING },
    fornecedor: { type: DataTypes.STRING },
    observacao: { type: DataTypes.TEXT },
    fk_endereco_id_endereco: { type: DataTypes.INTEGER },
    fk_usuario_id_usuario: { type: DataTypes.INTEGER },
    fk_projeto_lista_material_id_projeto: { type: DataTypes.INTEGER },
    fk_projeto_lista_material_id_lista: { type: DataTypes.INTEGER },
  }, {
    tableName: 'entradas',
    timestamps: false,
  });
};
