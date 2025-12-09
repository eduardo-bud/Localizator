module.exports = (sequelize, DataTypes) => {
  return sequelize.define('RetiradaMaterial', {
    id_retirada_material: { type: DataTypes.INTEGER, primaryKey: true },
    id_retirada: { type: DataTypes.INTEGER },
    id_material: { type: DataTypes.INTEGER },
    quantidade: { type: DataTypes.DOUBLE },
    fk_material_id_material: { type: DataTypes.INTEGER },
    fk_retiradas_id_retirada: { type: DataTypes.INTEGER },
  }, {
    tableName: 'retirada_material_retirada_material',
    timestamps: false,
  });
};
