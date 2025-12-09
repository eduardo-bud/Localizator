module.exports = (sequelize, DataTypes) => {
  return sequelize.define('SubEspaco', {
    id_espaco: { type: DataTypes.INTEGER, primaryKey: true },
    nome: { type: DataTypes.STRING },
    descricao: { type: DataTypes.TEXT },
    largura: { type: DataTypes.INTEGER },
    altura: { type: DataTypes.INTEGER },
    criado_em: { type: DataTypes.DATE },
    atualizado_em: { type: DataTypes.DATE },
    cordenada_altura: { type: DataTypes.INTEGER },
    cordenada_largura: { type: DataTypes.INTEGER },
    fk_espaco_id_espaco: { type: DataTypes.INTEGER },
  }, {
    tableName: 'sub_espaco',
    timestamps: false,
  });
};
