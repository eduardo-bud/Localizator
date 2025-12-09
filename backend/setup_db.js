const { sequelize } = require('./models');

async function setupDatabase() {
  try {
    console.log('🔄 Sincronizando database...');
    
    // Sync models com database
    await sequelize.sync({ force: true });
    console.log('✅ Modelos sincronizados');

    // Importar modelos
    const { Usuario, Material, Pedido } = require('./models');
    const bcrypt = require('bcrypt');

    // Inserir usuários
    console.log('📝 Adicionando usuários...');
    const senhaHashAdm = await bcrypt.hash('12345', 10);
    const senhaHashFunc = await bcrypt.hash('senha123', 10);
    await Usuario.create({
      id_usuario: 1,
      nome_usuario: 'adm',
      senha_hash: senhaHashAdm,
      cargo: 'administrador',
      ativo: true,
    });

    await Usuario.create({
      id_usuario: 2,
      nome_usuario: 'funcionario',
      senha_hash: senhaHashFunc,
      cargo: 'funcionário',
      ativo: true,
    });
    console.log('✅ Usuários criados');

    // Inserir materiais com estoque baixo
    console.log('📦 Adicionando materiais...');
    await Material.create({
      id_material: 1,
      nome: 'Parafuso M4',
      descricao: 'Parafuso de aço inoxidável',
      unidade: 'Unidade',
      estoque_atual: 5,
      estoque_minimo: 20,
    });

    await Material.create({
      id_material: 2,
      nome: 'Porca M4',
      descricao: 'Porca de aço carbono',
      unidade: 'Unidade',
      estoque_atual: 10,
      estoque_minimo: 15,
    });

    await Material.create({
      id_material: 3,
      nome: 'Aruela Plana',
      descricao: 'Aruela para fixação',
      unidade: 'Pacote',
      estoque_atual: 2,
      estoque_minimo: 10,
    });

    await Material.create({
      id_material: 4,
      nome: 'Óleo para Motor',
      descricao: 'Óleo sintético 5W30',
      unidade: 'Litro',
      estoque_atual: 3,
      estoque_minimo: 5,
    });
    console.log('✅ Materiais criados');

    // Inserir pedidos
    console.log('📋 Adicionando pedidos...');
    await Pedido.create({
      id_pedido: 1,
      descricao: 'Pedido de parafusos diversos',
      data_criacao: new Date(),
      data_entrega_prevista: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'Pendente',
    });

    await Pedido.create({
      id_pedido: 2,
      descricao: 'Pedido de porcas e arruelas',
      data_criacao: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      data_entrega_prevista: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      status: 'Processando',
    });

    await Pedido.create({
      id_pedido: 3,
      descricao: 'Pedido de materiais em geral',
      data_criacao: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      data_entrega_prevista: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      status: 'Pendente',
    });
    console.log('✅ Pedidos criados');

    console.log('\n✨ Database pronto para testes!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao setup database:', error);
    process.exit(1);
  }
}

setupDatabase();
