module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Tem', {
    fk_projeto_lista_material_id_lista: { type: DataTypes.INTEGER },
    fk_sub_espaco_id_sub_espaco: { type: DataTypes.INTEGER },
    fk_projeto_lista_material_id_projeto: { type: DataTypes.INTEGER },
  }, {
    tableName: 'tem',
    timestamps: false,
  });
};
