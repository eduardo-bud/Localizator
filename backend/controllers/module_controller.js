const modules = [
  { id: 'space', title: 'Visualização de Espaço', description: 'Visualizar e gerenciar espaços' },
  { id: 'stock', title: 'Estoque', description: 'Gerenciar inventário e produtos' },
  { id: 'entries', title: 'Entradas', description: 'Registrar entradas de materiais' },
  { id: 'materials', title: 'Cadastro / Edição de Materiais', description: 'Gerenciar cadastro de materiais' },
  { id: 'accounts', title: 'Cadastro / Edição de Contas e Acessos', description: 'Gerenciar usuários e permissões' },
  { id: 'unit-withdrawal', title: 'Retirada Unitária', description: 'Retirada individual de itens' },
  { id: 'list-withdrawal', title: 'Retirada por Lista', description: 'Retirada múltipla de itens' },
  { id: 'report', title: 'Relatório', description: 'Visualizar relatórios e análises' },
  { id: 'order', title: 'Pedido', description: 'Gerenciar pedidos e solicitações' }
];

function listModules(req, res) {
  res.json(modules);
}

module.exports = { listModules };
