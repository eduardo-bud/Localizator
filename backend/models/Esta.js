module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Esta', {
    fk_material_id_material: { type: DataTypes.INTEGER },
    fk_lista_material_item_id_item: { type: DataTypes.INTEGER },
    fk_pedido_item_id_pedido_item: { type: DataTypes.INTEGER },
  }, {
    tableName: 'esta',
    timestamps: false,
  });
};
