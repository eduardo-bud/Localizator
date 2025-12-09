module.exports = (sequelize, DataTypes) => {
  return sequelize.define('MaterialEntrada', {
    id_entrada_material: { type: DataTypes.INTEGER, primaryKey: true },
    id_entrada: { type: DataTypes.INTEGER },
    id_material: { type: DataTypes.INTEGER },
    quantidade: { type: DataTypes.DOUBLE },
    fk_material_id_material: { type: DataTypes.INTEGER },
    fk_entradas_id_entrada: { type: DataTypes.INTEGER },
  }, {
    tableName: 'material_entrada_material_entrada',
    timestamps: false,
  });
};
