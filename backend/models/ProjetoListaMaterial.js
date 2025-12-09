module.exports = (sequelize, DataTypes) => {
  return sequelize.define('ProjetoListaMaterial', {
    id_projeto: { type: DataTypes.INTEGER },
    nome: { type: DataTypes.STRING },
    descricao: { type: DataTypes.TEXT },
    ativo: { type: DataTypes.BOOLEAN },
    criado_em: { type: DataTypes.DATE },
    atualizado_em: { type: DataTypes.DATE },
    id_lista: { type: DataTypes.INTEGER, primaryKey: true },
  }, {
    tableName: 'projeto_lista_material',
    timestamps: false,
  });
};
