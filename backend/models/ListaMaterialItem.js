module.exports = (sequelize, DataTypes) => {
  return sequelize.define('ListaMaterialItem', {
    id_material: { type: DataTypes.INTEGER },
    quantidade_necessaria: { type: DataTypes.DOUBLE },
    observacao: { type: DataTypes.TEXT },
    id_item: { type: DataTypes.INTEGER, primaryKey: true },
    id_lista: { type: DataTypes.INTEGER },
    fk_projeto_lista_material_id_projeto: { type: DataTypes.INTEGER },
    fk_projeto_lista_material_id_lista: { type: DataTypes.INTEGER },
  }, {
    tableName: 'lista_material_item',
    timestamps: false,
  });
};
