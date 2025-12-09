module.exports = (sequelize, DataTypes) => {
  return sequelize.define('AlertaMinimo', {
    id_alerta: { type: DataTypes.INTEGER, primaryKey: true },
    id_material: { type: DataTypes.INTEGER },
    quantidade_minima: { type: DataTypes.DOUBLE },
    enviado: { type: DataTypes.BOOLEAN },
    data_envio: { type: DataTypes.DATE },
    fk_material_id_material: { type: DataTypes.INTEGER },
  }, {
    tableName: 'alerta_minimo',
    timestamps: false,
  });
};
