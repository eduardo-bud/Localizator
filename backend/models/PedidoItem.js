module.exports = (sequelize, DataTypes) => {
  return sequelize.define('PedidoItem', {
    id_pedido_item: { type: DataTypes.INTEGER, primaryKey: true },
    id_pedido: { type: DataTypes.INTEGER },
    quantidade_pedida: { type: DataTypes.DOUBLE },
    quantidade_recebida: { type: DataTypes.DOUBLE },
    observacao: { type: DataTypes.TEXT },
    fk_pedido_id_pedido: { type: DataTypes.INTEGER },
  }, {
    tableName: 'pedido_item',
    timestamps: false,
  });
};
