const bcrypt = require('bcrypt');
const { Usuario } = require('../models');
const { generateToken, generateRefreshToken } = require('../middleware/authMiddleware');

exports.login = async (req, res) => {
  try {
    const { nome_usuario, senha } = req.body;

    if (!nome_usuario || !senha) {
      return res.status(400).json({
        success: false,
        error: 'Nome de usuário e senha são obrigatórios'
      });
    }

    const usuario = await Usuario.findOne({
      where: { nome_usuario }
    });

    if (!usuario) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);

    if (!senhaValida) {
      return res.status(401).json({
        success: false,
        error: 'Senha incorreta'
      });
    }

    if (!usuario.ativo) {
      return res.status(403).json({
        success: false,
        error: 'Usuário inativo'
      });
    }

    // Gerar tokens
    const accessToken = generateToken(usuario);
    const refreshToken = generateRefreshToken(usuario);

    return res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
      expiresIn: 86400, // 24 horas em segundos
      usuario: {
        id_usuario: usuario.id_usuario,
        nome_usuario: usuario.nome_usuario,
        cargo: usuario.cargo
      }
    });
  } catch (error) {
    console.error('Auth login error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao fazer login',
      details: error.message
    });
  }
};

// Refresh token
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token não fornecido'
      });
    }

    const { verifyToken } = require('../middleware/authMiddleware');
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta-desenvolvimento';

    try {
      const decoded = jwt.verify(refreshToken, JWT_SECRET);
      
      const usuario = await Usuario.findOne({
        where: { id_usuario: decoded.id_usuario }
      });

      if (!usuario || !usuario.ativo) {
        return res.status(401).json({
          success: false,
          error: 'Usuário inválido ou inativo'
        });
      }

      const newAccessToken = generateToken(usuario);

      return res.status(200).json({
        success: true,
        accessToken: newAccessToken,
        expiresIn: 86400
      });
    } catch (tokenError) {
      return res.status(401).json({
        success: false,
        error: 'Refresh token expirado ou inválido'
      });
    }
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao renovar token'
    });
  }
};
