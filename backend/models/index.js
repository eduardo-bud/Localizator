const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const DataTypes = Sequelize.DataTypes;

const models = {
  Material: require('./Material')(sequelize, DataTypes),
  ProjetoListaMaterial: require('./ProjetoListaMaterial')(sequelize, DataTypes),
  ListaMaterialItem: require('./ListaMaterialItem')(sequelize, DataTypes),
  Espaco: require('./Espaco')(sequelize, DataTypes),
  SubEspaco: require('./SubEspaco')(sequelize, DataTypes),
  Entrada: require('./Entrada')(sequelize, DataTypes),
  Retirada: require('./Retirada')(sequelize, DataTypes),
  AlertaMinimo: require('./AlertaMinimo')(sequelize, DataTypes),
  LogPesquisa: require('./LogPesquisa')(sequelize, DataTypes),
  LogDelete: require('./LogDelete')(sequelize, DataTypes),
  Usuario: require('./Usuario')(sequelize, DataTypes),
  Pedido: require('./Pedido')(sequelize, DataTypes),
  PedidoItem: require('./PedidoItem')(sequelize, DataTypes),
  MaterialEntrada: require('./MaterialEntrada')(sequelize, DataTypes),
  RetiradaMaterial: require('./RetiradaMaterial')(sequelize, DataTypes),
  Formato: require('./Formato')(sequelize, DataTypes),
  EnderecoMaterialEndereco: require('./EnderecoMaterialEndereco')(sequelize, DataTypes),
  ContemSubespacoInterno: require('./ContemSubespacoInterno')(sequelize, DataTypes),
  Esta: require('./Esta')(sequelize, DataTypes),
  Tem: require('./Tem')(sequelize, DataTypes),
};

Object.keys(models).forEach((name) => {
  if (models[name].associate) {
    models[name].associate(models);
  }
});

module.exports = { sequelize, Sequelize, ...models };
