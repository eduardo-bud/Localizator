const { Usuario } = require('./models');
const bcrypt = require('bcrypt');

const seedUsers = async () => {
  try {
    // Limpar usuários existentes (para teste)
    // await Usuario.destroy({ where: {} });

    // Criar usuários padrão
    const users = [
      {
        nome_usuario: 'admin',
        senha_hash: await bcrypt.hash('admin123', 10),
        cargo: 'administrador',
        ativo: true,
      },
      {
        nome_usuario: 'funcionario1',
        senha_hash: await bcrypt.hash('123456', 10),
        cargo: 'funcionário',
        ativo: true,
      },
      {
        nome_usuario: 'funcionario2',
        senha_hash: await bcrypt.hash('123456', 10),
        cargo: 'funcionário',
        ativo: true,
      },
    ];

    let created = 0;
    for (const user of users) {
      // Verificar se usuário já existe
      const exists = await Usuario.findOne({ where: { nome_usuario: user.nome_usuario } });
      if (!exists) {
        await Usuario.create(user);
        console.log(`✓ Usuário criado: ${user.nome_usuario}`);
        created++;
      } else {
        console.log(`✓ Usuário já existe: ${user.nome_usuario}`);
      }
    }

    console.log(`✓ ${created} novo(s) usuário(s) criado(s) com sucesso!`);
  } catch (error) {
    console.error('Erro ao fazer seed de usuários:', error);
  }
};

// Executar seed
if (require.main === module) {
  seedUsers().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = seedUsers;
