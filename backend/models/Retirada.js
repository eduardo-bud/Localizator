module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Retirada', {
    id_retirada: { type: DataTypes.INTEGER, primaryKey: true },
    data_retirada: { type: DataTypes.DATE },
    motivo: { type: DataTypes.TEXT },
    observacao: { type: DataTypes.TEXT },
    fk_usuario_id_usuario: { type: DataTypes.INTEGER },
  }, {
    tableName: 'retiradas',
    timestamps: false,
  });
};
