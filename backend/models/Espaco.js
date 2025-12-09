module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Espaco', {
    id_espaco: { type: DataTypes.INTEGER, primaryKey: true },
    nome: { type: DataTypes.STRING },
    descricao: { type: DataTypes.TEXT },
    altura: { type: DataTypes.INTEGER },
    largura: { type: DataTypes.INTEGER },
    criado_em: { type: DataTypes.DATE },
    atualizado_em: { type: DataTypes.DATE },
  }, {
    tableName: 'espaco',
    timestamps: false,
  });
};
