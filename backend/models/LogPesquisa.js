module.exports = (sequelize, DataTypes) => {
  return sequelize.define('LogPesquisa', {
    id_pesquisa: { type: DataTypes.INTEGER, primaryKey: true },
    id_usuario: { type: DataTypes.INTEGER },
    campo_base: { type: DataTypes.STRING },
    valor_pesquisado: { type: DataTypes.STRING },
    tipo_dado: { type: DataTypes.STRING },
    data_hora: { type: DataTypes.DATE },
    fk_usuario_id_usuario: { type: DataTypes.INTEGER },
  }, {
    tableName: 'log_pesquisa',
    timestamps: false,
  });
};
