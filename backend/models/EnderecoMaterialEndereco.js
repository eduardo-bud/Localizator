module.exports = (sequelize, DataTypes) => {
  return sequelize.define('EnderecoMaterialEndereco', {
    id_endereco_material: { type: DataTypes.INTEGER, primaryKey: true },
    id_material: { type: DataTypes.INTEGER },
    id_endereco: { type: DataTypes.INTEGER },
    quantidade: { type: DataTypes.DOUBLE },
    atualizado_em: { type: DataTypes.DATE },
    id_subespaco: { type: DataTypes.INTEGER },
    cordenada_altura: { type: DataTypes.INTEGER },
    cordenada_largura: { type: DataTypes.INTEGER },
    capacidade: { type: DataTypes.DOUBLE },
    observacao: { type: DataTypes.TEXT },
    fk_material_id_material: { type: DataTypes.INTEGER },
  }, {
    tableName: 'endereco_material_endereco',
    timestamps: false,
  });
};
