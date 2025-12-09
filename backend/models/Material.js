module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Material', {
    id_material: { type: DataTypes.INTEGER, primaryKey: true },
    codigo_material: { type: DataTypes.STRING },
    nome: { type: DataTypes.STRING },
    descricao: { type: DataTypes.TEXT },
    categoria: { type: DataTypes.STRING },
    unidade_medida: { type: DataTypes.STRING },
    estoque_minimo: { type: DataTypes.DOUBLE },
    atualizado_em: { type: DataTypes.DATE },
    estoque_atual: { type: DataTypes.DOUBLE },
    criado_em: { type: DataTypes.DATE },
  }, {
    tableName: 'material',
    timestamps: false,
  });
};
