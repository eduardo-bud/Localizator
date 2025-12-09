module.exports = (sequelize, DataTypes) => {
  return sequelize.define('ContemSubespacoInterno', {
    id_interno: { type: DataTypes.INTEGER, primaryKey: true },
    id_subespaço: { type: DataTypes.INTEGER },
    id_subespaço_interno: { type: DataTypes.INTEGER },
  }, {
    tableName: '_contem_subespaco_interno',
    timestamps: false,
  });
};
