const bcrypt = require('bcrypt');
const { Usuario } = require('../models');

// Listar todos os usuários
exports.listUsers = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ['id_usuario', 'nome_usuario', 'cargo', 'ativo', 'criado_em']
    });
    res.json(usuarios);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao listar usuários' });
  }
};

// Obter usuário por ID
exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findOne({
      where: { id_usuario: id },
      attributes: ['id_usuario', 'nome_usuario', 'cargo', 'ativo', 'criado_em']
    });
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(usuario);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao obter usuário' });
  }
};

// Criar novo usuário
exports.createUser = async (req, res) => {
  try {
    const { nome_usuario, senha, cargo } = req.body;

    // Validações
    if (!nome_usuario || !senha || !cargo) {
      return res.status(400).json({ error: 'Nome de usuário, senha e cargo são obrigatórios' });
    }

    // Verificar se usuário já existe
    const usuarioExistente = await Usuario.findOne({
      where: { nome_usuario }
    });

    if (usuarioExistente) {
      return res.status(400).json({ error: 'Usuário já existe' });
    }

    // Validar cargo
    if (!['administrador', 'funcionário'].includes(cargo)) {
      return res.status(400).json({ error: 'Cargo inválido. Use "administrador" ou "funcionário"' });
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Criar usuário
    const novoUsuario = await Usuario.create({
      nome_usuario,
      senha_hash: senhaHash,
      cargo,
      ativo: true,
      criado_em: new Date(),
      atualizado_em: new Date()
    });

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      usuario: {
        id_usuario: novoUsuario.id_usuario,
        nome_usuario: novoUsuario.nome_usuario,
        cargo: novoUsuario.cargo,
        ativo: novoUsuario.ativo
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
};

// Atualizar usuário
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome_usuario, cargo, ativo } = req.body;

    const usuario = await Usuario.findOne({
      where: { id_usuario: id }
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Validar cargo
    if (cargo && !['administrador', 'funcionário'].includes(cargo)) {
      return res.status(400).json({ error: 'Cargo inválido. Use "administrador" ou "funcionário"' });
    }

    // Verificar se nome_usuario já está em uso por outro usuário
    if (nome_usuario && nome_usuario !== usuario.nome_usuario) {
      const usuarioExistente = await Usuario.findOne({
        where: { nome_usuario }
      });
      if (usuarioExistente) {
        return res.status(400).json({ error: 'Nome de usuário já em uso' });
      }
    }

    await usuario.update({
      ...(nome_usuario && { nome_usuario }),
      ...(cargo && { cargo }),
      ...(ativo !== undefined && { ativo }),
      atualizado_em: new Date()
    });

    res.json({
      message: 'Usuário atualizado com sucesso',
      usuario: {
        id_usuario: usuario.id_usuario,
        nome_usuario: usuario.nome_usuario,
        cargo: usuario.cargo,
        ativo: usuario.ativo
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
};

// Deletar usuário
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findOne({
      where: { id_usuario: id }
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Não permitir deletar o primeiro usuário (admin)
    if (id === 1) {
      return res.status(400).json({ error: 'Não é possível deletar o usuário administrador padrão' });
    }

    await usuario.destroy();

    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
};
