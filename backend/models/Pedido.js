module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Pedido', {
    status: { type: DataTypes.STRING },
    criado_em: { type: DataTypes.DATE },
    atualizado_em: { type: DataTypes.DATE },
    id_pedido: { type: DataTypes.INTEGER, primaryKey: true },
    id_lista_material: { type: DataTypes.INTEGER },
    fk_projeto_lista_material_id_projeto: { type: DataTypes.INTEGER },
    fk_projeto_lista_material_id_lista: { type: DataTypes.INTEGER },
  }, {
    tableName: 'pedido',
    timestamps: false,
  });
};
