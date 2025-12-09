const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');
const moduleController = require('./controllers/module_controller');
const alertService = require('./services/alertService');
const materialController = require('./controllers/material_controller');
const retiradaController = require('./controllers/retirada_controller');
const authController = require('./controllers/auth_controller');
const usuarioController = require('./controllers/usuario_controller');
const { verifyToken, requireAdmin, rateLimit, securityLog } = require('./middleware/authMiddleware');

// Auto-seed database on startup - DISABLED
// Use: node setup-database.js para criar/atualizar banco
async function seedDatabaseOnStartup() {
  console.log('✅ Banco de dados iniciado.');
  console.log('💡 Para setup/reset do banco, execute: node setup-database.js');
}

const app = express();
const PORT = process.env.PORT || 3001;

// CORS: restrict to localhost in dev
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Security middleware
app.use(securityLog);
app.use(rateLimit(100, 15 * 60 * 1000)); // 100 requisições por 15 minutos

// Simple request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

app.get('/api/modules', moduleController.listModules);

// Rotas de autenticação
app.post('/api/auth/login', rateLimit(100, 1 * 60 * 1000), authController.login);
app.post('/api/auth/refresh', authController.refreshToken);

// Usuários CRUD - Protegidas por JWT e Admin
app.get('/api/usuarios', verifyToken, requireAdmin, usuarioController.listUsers);
app.get('/api/usuarios/:id', verifyToken, requireAdmin, usuarioController.getUser);
app.post('/api/usuarios', verifyToken, requireAdmin, usuarioController.createUser);
app.put('/api/usuarios/:id', verifyToken, requireAdmin, usuarioController.updateUser);
app.delete('/api/usuarios/:id', verifyToken, requireAdmin, usuarioController.deleteUser);

app.get('/api/alerts', async (req, res) => {
  try {
    const alerts = await alertService.getSystemAlerts();
    res.json(alerts);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao obter alertas' });
  }
});

// Materials CRUD - GET público, POST/PUT/DELETE protegido por Admin
app.get('/api/materials', materialController.listMaterials);
app.get('/api/materials/:id', materialController.getMaterial);
app.post('/api/materials', verifyToken, requireAdmin, materialController.createMaterial);
app.put('/api/materials/:id', verifyToken, requireAdmin, materialController.updateMaterial);
app.delete('/api/materials/:id', verifyToken, requireAdmin, materialController.deleteMaterial);

// Retiradas - Protegido por JWT (todos os usuários podem fazer retirada)
app.post('/api/retirada', verifyToken, retiradaController.createRetiradaSingle); // Rota singular para UI
app.post('/api/retiradas', verifyToken, retiradaController.createRetirada);
app.get('/api/retiradas', verifyToken, requireAdmin, retiradaController.listRetiradas); // Relatório admin
app.get('/api/retiradas/:id', verifyToken, retiradaController.getRetirada);
app.post('/api/materials/import/excel', verifyToken, requireAdmin, materialController.importExcel);

// Health and sync
app.get('/health', (req, res) => res.json({ ok: true }));

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
    
    // Auto-seed data if database is empty
    await seedDatabaseOnStartup();
    
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (e) {
    console.error('Failed to start server', e);
    process.exit(1);
  }
}

if (require.main === module) start();

module.exports = app;
