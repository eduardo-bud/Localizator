module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Formato', {
    id_formato: { type: DataTypes.INTEGER, primaryKey: true },
    id_espaco: { type: DataTypes.INTEGER },
    distancia: { type: DataTypes.DOUBLE },
    angulo: { type: DataTypes.DOUBLE },
    fk_espaco_id_espaco: { type: DataTypes.INTEGER },
  }, {
    tableName: 'formato',
    timestamps: false,
  });
};
