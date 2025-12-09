const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta-desenvolvimento';
const TOKEN_EXPIRY = '24h';
const REFRESH_TOKEN_EXPIRY = '7d';

// Gerar JWT token
exports.generateToken = (usuario) => {
  return jwt.sign(
    {
      id_usuario: usuario.id_usuario,
      nome_usuario: usuario.nome_usuario,
      cargo: usuario.cargo
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
};

// Gerar refresh token
exports.generateRefreshToken = (usuario) => {
  return jwt.sign(
    {
      id_usuario: usuario.id_usuario,
      tipo: 'refresh'
    },
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
};

// Middleware para verificar token
exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// Middleware para verificar se é admin
exports.requireAdmin = (req, res, next) => {
  if (!req.user || req.user.cargo !== 'administrador') {
    return res.status(403).json({ error: 'Acesso permitido apenas para administradores' });
  }
  next();
};

// Middleware para rate limiting
const requestCounts = new Map();

exports.rateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!requestCounts.has(ip)) {
      requestCounts.set(ip, []);
    }
    
    const timestamps = requestCounts.get(ip);
    const recentRequests = timestamps.filter(time => now - time < windowMs);
    
    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({ error: 'Muitas requisições. Tente novamente mais tarde.' });
    }
    
    recentRequests.push(now);
    requestCounts.set(ip, recentRequests);
    next();
  };
};

// Middleware para log de segurança
exports.securityLog = (req, res, next) => {
  console.log(`[SECURITY] ${new Date().toISOString()} | IP: ${req.ip} | ${req.method} ${req.path} | User: ${req.user?.id_usuario || 'anonymous'}`);
  next();
};
