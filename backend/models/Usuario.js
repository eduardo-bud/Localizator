module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Usuario', {
    id_usuario: { type: DataTypes.INTEGER, primaryKey: true },
    nome_usuario: { type: DataTypes.STRING },
    senha_hash: { type: DataTypes.STRING },
    cargo: { type: DataTypes.STRING },
    ativo: { type: DataTypes.BOOLEAN },
    criado_em: { type: DataTypes.DATE },
    atualizado_em: { type: DataTypes.DATE },
  }, {
    tableName: 'usuario',
    timestamps: false,
  });
};
