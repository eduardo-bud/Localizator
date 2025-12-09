module.exports = (sequelize, DataTypes) => {
  return sequelize.define('LogDelete', {
    id_exclusao: { type: DataTypes.INTEGER, primaryKey: true },
    id_usuario: { type: DataTypes.INTEGER },
    tipo_registro: { type: DataTypes.STRING },
    id_registro: { type: DataTypes.INTEGER },
    data_hora: { type: DataTypes.DATE },
    motivo: { type: DataTypes.STRING },
    backup_json: { type: DataTypes.TEXT },
    status: { type: DataTypes.BOOLEAN },
    fk_usuario_id_usuario: { type: DataTypes.INTEGER },
  }, {
    tableName: 'log_delete',
    timestamps: false,
  });
};
