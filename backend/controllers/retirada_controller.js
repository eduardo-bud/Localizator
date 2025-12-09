const { Retirada, RetiradaMaterial, Material, Usuario } = require('../models');
const { Op } = require('sequelize');

// Criar retirada
async function createRetirada(req, res) {
	try {
		const { materiais, motivo, observacao } = req.body;
		const id_usuario = req.user.id_usuario;

		// Validação
		if (!materiais || !Array.isArray(materiais) || materiais.length === 0) {
			return res.status(400).json({ error: 'Materiais obrigatórios' });
		}

		// Validar todos os materiais existem
		for (const item of materiais) {
			const material = await Material.findByPk(item.id_material);
			if (!material) {
				return res.status(404).json({ error: `Material ${item.id_material} não encontrado` });
			}
			if (material.estoque_atual < item.quantidade) {
				return res.status(400).json({ error: `Estoque insuficiente para ${material.nome}` });
			}
		}

		// Criar retirada
		const retirada = await Retirada.create({
			data_retirada: new Date(),
			motivo: motivo?.trim() || '',
			observacao: observacao?.trim() || '',
			fk_usuario_id_usuario: id_usuario
		});

		// Criar itens de retirada e atualizar estoque
		for (const item of materiais) {
			await RetiradaMaterial.create({
				id_retirada: retirada.id_retirada,
				id_material: item.id_material,
				quantidade: item.quantidade,
				fk_material_id_material: item.id_material,
				fk_retiradas_id_retirada: retirada.id_retirada
			});

			// Atualizar estoque
			const material = await Material.findByPk(item.id_material);
			await material.update({
				estoque_atual: material.estoque_atual - item.quantidade,
				atualizado_em: new Date()
			});
		}

		res.status(201).json({
			success: true,
			id_retirada: retirada.id_retirada,
			message: 'Retirada realizada com sucesso!'
		});
	} catch (e) {
		console.error('Erro ao criar retirada:', e);
		res.status(500).json({ error: 'Erro ao realizar retirada' });
	}
}

// Listar retiradas com filtros
async function listRetiradas(req, res) {
	try {
		const { dataInicio, dataFim, usuario, material } = req.query;
		const where = {};

		if (dataInicio || dataFim) {
			where.data_retirada = {};
			if (dataInicio) where.data_retirada[Op.gte] = new Date(dataInicio);
			if (dataFim) {
				const fim = new Date(dataFim);
				fim.setHours(23, 59, 59, 999);
				where.data_retirada[Op.lte] = fim;
			}
		}

		if (usuario) where.fk_usuario_id_usuario = usuario;

		const retiradas = await Retirada.findAll({
			where,
			include: [
				{
					model: RetiradaMaterial,
					as: 'retiradas',
					include: [{ model: Material, as: 'material' }]
				},
				{ model: Usuario, as: 'usuario', attributes: ['id_usuario', 'nome_usuario'] }
			],
			order: [['data_retirada', 'DESC']],
			limit: 500
		});

		// Filtrar por material se necessário
		let resultado = retiradas;
		if (material) {
			resultado = retiradas.filter(r =>
				r.retiradas?.some(rm => rm.id_material == material)
			);
		}

		res.json(resultado);
	} catch (e) {
		console.error('Erro ao listar retiradas:', e);
		res.status(500).json({ error: 'Erro ao listar retiradas' });
	}
}

// Obter retirada por ID
async function getRetirada(req, res) {
	try {
		const retirada = await Retirada.findByPk(req.params.id, {
			include: [
				{
					model: RetiradaMaterial,
					as: 'retiradas',
					include: [{ model: Material, as: 'material' }]
				},
				{ model: Usuario, as: 'usuario', attributes: ['id_usuario', 'nome_usuario'] }
			]
		});

		if (!retirada) {
			return res.status(404).json({ error: 'Retirada não encontrada' });
		}

		res.json(retirada);
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: 'Erro ao obter retirada' });
	}
}

// Aceita um único material (para compatibilidade com UI)
async function createRetiradaSingle(req, res) {
	try {
		const { id_material, quantidade, motivo, observacao } = req.body;
		const id_usuario = req.user.id_usuario;

		// Validação
		if (!id_material || !quantidade) {
			return res.status(400).json({ message: 'Material e quantidade obrigatórios' });
		}

		if (quantidade <= 0) {
			return res.status(400).json({ message: 'Quantidade deve ser maior que zero' });
		}

		// Validar material existe
		const material = await Material.findByPk(id_material);
		if (!material) {
			return res.status(404).json({ message: 'Material não encontrado' });
		}

		if (material.estoque_atual < quantidade) {
			return res.status(400).json({ message: `Estoque insuficiente. Disponível: ${material.estoque_atual}` });
		}

		// Criar retirada
		const retirada = await Retirada.create({
			data_retirada: new Date(),
			motivo: motivo?.trim() || '',
			observacao: observacao?.trim() || '',
			fk_usuario_id_usuario: id_usuario
		});

		// Criar item de retirada
		await RetiradaMaterial.create({
			id_retirada: retirada.id_retirada,
			id_material: id_material,
			quantidade: quantidade,
			fk_material_id_material: id_material,
			fk_retiradas_id_retirada: retirada.id_retirada
		});

		// Atualizar estoque
		await material.update({
			estoque_atual: material.estoque_atual - quantidade,
			atualizado_em: new Date()
		});

		res.status(201).json({
			success: true,
			id_retirada: retirada.id_retirada,
			message: 'Retirada realizada com sucesso!'
		});
	} catch (e) {
		console.error('Erro ao criar retirada:', e);
		res.status(500).json({ message: 'Erro ao processar retirada. Tente novamente.' });
	}
}

module.exports = {
	createRetirada,
	createRetiradaSingle,
	listRetiradas,
	getRetirada
};
