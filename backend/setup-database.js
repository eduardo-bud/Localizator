#!/usr/bin/env node

/**
 * Script de Setup do Banco de Dados
 * 
 * Este script sincroniza o banco de dados com os modelos Sequelize
 * e popula dados iniciais de teste.
 * 
 * Uso:
 *   node setup-database.js
 */

const { sequelize } = require('./models');
const { Material } = require('./models');
const { Usuario } = require('./models');
const bcrypt = require('bcrypt');

async function setupDatabase() {
  try {
    console.log('🔄 Iniciando setup do banco de dados...\n');

    // 1. Sincronizar modelos com banco de dados
    console.log('📊 Sincronizando tabelas...');
    await sequelize.sync({ alter: true });
    console.log('✅ Tabelas sincronizadas com sucesso!\n');

    // 2. Verificar e criar usuários padrão
    console.log('👤 Verificando usuários padrão...');
    const usuariosParaCriar = [
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

    let usuariosCriados = 0;
    for (const usuario of usuariosParaCriar) {
      const existe = await Usuario.findOne({ where: { nome_usuario: usuario.nome_usuario } });
      if (!existe) {
        await Usuario.create(usuario);
        console.log(`  ✓ Usuário criado: ${usuario.nome_usuario}`);
        usuariosCriados++;
      } else {
        console.log(`  • Usuário já existe: ${usuario.nome_usuario}`);
      }
    }
    console.log(`✅ ${usuariosCriados} novo(s) usuário(s) criado(s)\n`);

    // 3. Verificar e criar materiais padrão
    console.log('📦 Verificando materiais padrão...');
    const materiaisParaCriar = [
      {
        codigo_material: 'MAT-001',
        nome: 'Parafuso M8 x 50mm',
        descricao: 'Parafuso de aço carbono M8 com 50mm de comprimento',
        categoria: 'Ferragens',
        unidade_medida: 'un',
        estoque_minimo: 100,
        estoque_atual: 500,
      },
      {
        codigo_material: 'MAT-002',
        nome: 'Porca M8',
        descricao: 'Porca de aço M8',
        categoria: 'Ferragens',
        unidade_medida: 'un',
        estoque_minimo: 100,
        estoque_atual: 300,
      },
      {
        codigo_material: 'MAT-003',
        nome: 'Arruela Lisa M8',
        descricao: 'Arruela lisa de aço M8',
        categoria: 'Ferragens',
        unidade_medida: 'un',
        estoque_minimo: 50,
        estoque_atual: 200,
      },
      {
        codigo_material: 'MAT-004',
        nome: 'Corrente Aço 8mm',
        descricao: 'Corrente de aço galvanizado 8mm',
        categoria: 'Cabos e Correntes',
        unidade_medida: 'm',
        estoque_minimo: 10,
        estoque_atual: 50,
      },
      {
        codigo_material: 'MAT-005',
        nome: 'Cabo Aço 6mm',
        descricao: 'Cabo de aço 6mm com revestimento',
        categoria: 'Cabos e Correntes',
        unidade_medida: 'm',
        estoque_minimo: 5,
        estoque_atual: 100,
      },
      {
        codigo_material: 'MAT-006',
        nome: 'Tubo PVC 50mm',
        descricao: 'Tubo de PVC rígido 50mm',
        categoria: 'Tubos',
        unidade_medida: 'm',
        estoque_minimo: 5,
        estoque_atual: 30,
      },
      {
        codigo_material: 'MAT-007',
        nome: 'Rolamento 6203',
        descricao: 'Rolamento de esfera 6203',
        categoria: 'Rolamentos',
        unidade_medida: 'un',
        estoque_minimo: 10,
        estoque_atual: 25,
      },
      {
        codigo_material: 'MAT-008',
        nome: 'Lubrificante Industrial',
        descricao: 'Óleo lubrificante para máquinas',
        categoria: 'Lubrificantes',
        unidade_medida: 'l',
        estoque_minimo: 10,
        estoque_atual: 50.5,
      },
    ];

    let materiaisCriados = 0;
    for (const material of materiaisParaCriar) {
      const existe = await Material.findOne({ where: { codigo_material: material.codigo_material } });
      if (!existe) {
        await Material.create({
          ...material,
          criado_em: new Date(),
          atualizado_em: new Date(),
        });
        console.log(`  ✓ Material criado: ${material.nome}`);
        materiaisCriados++;
      } else {
        console.log(`  • Material já existe: ${material.nome}`);
      }
    }
    console.log(`✅ ${materiaisCriados} novo(s) material(is) criado(s)\n`);

    console.log('✨ Setup do banco de dados concluído com sucesso!');
    console.log('\n📋 Credenciais padrão:');
    console.log('   Admin: admin / admin123');
    console.log('   Funcionário 1: funcionario1 / 123456');
    console.log('   Funcionário 2: funcionario2 / 123456');
    console.log('\n💡 Para mais informações, veja o README.md\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro durante o setup:', error);
    process.exit(1);
  }
}

setupDatabase();
