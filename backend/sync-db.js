const { sequelize } = require('./models');

async function syncDatabase() {
  try {
    console.log('Sincronizando banco de dados...');
    await sequelize.sync({ alter: true }); // Use 'alter: true' para atualizar tabelas existentes
    console.log('✅ Banco de dados sincronizado com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao sincronizar banco de dados:', error);
    process.exit(1);
  }
}

syncDatabase();
