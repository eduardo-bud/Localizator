const { Material } = require('./models');

const materiais = [
  {
    nome: "Parafuso M8 x 50mm",
    descricao: "Parafuso de aço inoxidável",
    categoria: "Parafusos",
    unidade_medida: "un",
    estoque_minimo: 100,
    estoque_atual: 500,
  },
  {
    nome: "Porca M8",
    descricao: "Porca de aço inoxidável",
    categoria: "Porcas",
    unidade_medida: "un",
    estoque_minimo: 100,
    estoque_atual: 300,
  },
  {
    nome: "Arruela Lisa M8",
    descricao: "Arruela de aço inoxidável",
    categoria: "Arruelas",
    unidade_medida: "un",
    estoque_minimo: 50,
    estoque_atual: 200,
  },
  {
    nome: "Corrente Aço 8mm",
    descricao: "Corrente de aço galvanizado",
    categoria: "Correntes",
    unidade_medida: "m",
    estoque_minimo: 10,
    estoque_atual: 50,
  },
  {
    nome: "Cabo Aço 6mm",
    descricao: "Cabo de aço para uso industrial",
    categoria: "Cabos",
    unidade_medida: "m",
    estoque_minimo: 5,
    estoque_atual: 100,
  },
  {
    nome: "Tubo PVC 50mm",
    descricao: "Tubo de PVC rígido",
    categoria: "Tubos",
    unidade_medida: "m",
    estoque_minimo: 5,
    estoque_atual: 30,
  },
  {
    nome: "Rolamento 6203",
    descricao: "Rolamento de esferas",
    categoria: "Rolamentos",
    unidade_medida: "un",
    estoque_minimo: 10,
    estoque_atual: 25,
  },
  {
    nome: "Lubrificante Industrial",
    descricao: "Óleo lubrificante multi-uso",
    categoria: "Lubrificantes",
    unidade_medida: "l",
    estoque_minimo: 10,
    estoque_atual: 50,
  },
];

async function seed() {
  try {
    console.log('Verificando materiais existentes...');
    const count = await Material.count();
    
    if (count === 0) {
      console.log('Inserindo materiais de teste...');
      for (const mat of materiais) {
        await Material.create(mat);
        console.log(`✓ ${mat.nome}`);
      }
      console.log('Materiais inseridos com sucesso!');
    } else {
      console.log(`Já existem ${count} materiais no banco`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Erro ao inserir materiais:', error);
    process.exit(1);
  }
}

seed();
