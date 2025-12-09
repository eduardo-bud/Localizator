const { Material } = require('../models');
const { Op } = require('sequelize');

async function listMaterials(req, res) {
	try {
		const { search, categoria, order = 'nome', sort = 'ASC' } = req.query;
		
		const where = {};
		
		if (search) {
			where[Op.or] = [
				{ nome: { [Op.iLike]: `%${search}%` } },
				{ descricao: { [Op.iLike]: `%${search}%` } }
			];
		}
		
		if (categoria && categoria !== 'todos') {
			where.categoria = categoria;
		}
		
		const items = await Material.findAll({
			where,
			order: [[order, sort]],
			attributes: [
				'id_material',
				'codigo_material',
				'nome',
				'descricao',
				'categoria',
				'unidade_medida',
				'estoque_minimo',
				'estoque_atual',
				'criado_em',
				'atualizado_em'
			]
		});
		
		res.json(items);
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: 'Erro ao listar materiais' });
	}
}

async function getMaterial(req, res) {
	try {
		const id = req.params.id;
		const item = await Material.findByPk(id);
		if (!item) return res.status(404).json({ error: 'Material não encontrado' });
		res.json(item);
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: 'Erro ao obter material' });
	}
}

async function createMaterial(req, res) {
	try {
		const body = req.body;
		
		// Validação de campos obrigatórios
		if (!body.nome || body.nome.trim() === '') {
			return res.status(400).json({ error: 'Nome é obrigatório' });
		}
		
		// Validações de tipo
		if (isNaN(body.estoque_minimo) || isNaN(body.estoque_atual)) {
			return res.status(400).json({ error: 'Estoques devem ser números' });
		}
		
		const created = await Material.create({
			codigo_material: body.codigo_material?.trim() || '',
			nome: body.nome.trim(),
			descricao: body.descricao?.trim() || '',
			categoria: body.categoria?.trim() || '',
			unidade_medida: body.unidade_medida || 'UN',
			estoque_minimo: parseFloat(body.estoque_minimo) || 0,
			estoque_atual: parseFloat(body.estoque_atual) || 0,
			criado_em: new Date(),
			atualizado_em: new Date()
		});
		
		res.status(201).json(created);
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: 'Erro ao criar material', details: e.message });
	}
}

async function updateMaterial(req, res) {
	try {
		const id = req.params.id;
		const body = req.body;
		
		if (!id) {
			return res.status(400).json({ error: 'ID é obrigatório' });
		}
		
		const item = await Material.findByPk(id);
		if (!item) {
			return res.status(404).json({ error: 'Material não encontrado' });
		}
		
		// Validação de campos
		if (body.nome && body.nome.trim() === '') {
			return res.status(400).json({ error: 'Nome não pode estar vazio' });
		}
		
		if (body.estoque_minimo !== undefined && isNaN(body.estoque_minimo)) {
			return res.status(400).json({ error: 'Estoque mínimo deve ser um número' });
		}
		
		if (body.estoque_atual !== undefined && isNaN(body.estoque_atual)) {
			return res.status(400).json({ error: 'Estoque atual deve ser um número' });
		}
		
		// Preparar dados para atualização
		const updateData = {
			...body,
			atualizado_em: new Date()
		};
		
		// Trimagem de strings
		if (updateData.nome) updateData.nome = updateData.nome.trim();
		if (updateData.descricao) updateData.descricao = updateData.descricao.trim();
		if (updateData.categoria) updateData.categoria = updateData.categoria.trim();
		
		await item.update(updateData);
		res.json(item);
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: 'Erro ao atualizar material', details: e.message });
	}
}

async function deleteMaterial(req, res) {
	try {
		const id = req.params.id;
		
		if (!id) {
			return res.status(400).json({ error: 'ID é obrigatório' });
		}
		
		const item = await Material.findByPk(id);
		if (!item) {
			return res.status(404).json({ error: 'Material não encontrado' });
		}
		
		await item.destroy();
		res.json({ success: true, message: 'Material deletado com sucesso' });
	} catch (e) {
		console.error(e);
		
		// Verificar se é erro de constraint (foreign key)
		if (e.name === 'SequelizeForeignKeyConstraintError') {
			return res.status(409).json({ 
				error: 'Não é possível deletar este material pois ele está vinculado a pedidos' 
			});
		}
		
		res.status(500).json({ error: 'Erro ao excluir material', details: e.message });
	}
}

// Importação em lote via Excel
async function importExcel(req, res) {
	try {
		const { materiais } = req.body;
		
		if (!Array.isArray(materiais) || materiais.length === 0) {
			return res.status(400).json({ error: 'Nenhum material para importar' });
		}
		
		// Validar cada material
		const materiaisValidos = [];
		const erros = [];
		
		for (let i = 0; i < materiais.length; i++) {
			const m = materiais[i];
			const errosItem = [];
			
			if (!m.nome || m.nome.trim() === '') {
				errosItem.push('Nome é obrigatório');
			}
			
			if (m.estoque_minimo !== undefined && isNaN(m.estoque_minimo)) {
				errosItem.push('Estoque mínimo deve ser um número');
			}
			
			if (m.estoque_atual !== undefined && isNaN(m.estoque_atual)) {
				errosItem.push('Estoque atual deve ser um número');
			}
			
			if (errosItem.length > 0) {
				erros.push({ linha: i + 2, erros: errosItem });
			} else {
				materiaisValidos.push({
					nome: m.nome.trim(),
					descricao: m.descricao?.trim() || '',
					categoria: m.categoria?.trim() || '',
					unidade_medida: m.unidade_medida || 'UN',
					estoque_minimo: parseFloat(m.estoque_minimo) || 0,
					estoque_atual: parseFloat(m.estoque_atual) || 0,
					criado_em: new Date(),
					atualizado_em: new Date()
				});
			}
		}
		
		// Se houver erros e nenhum válido, retornar
		if (materiaisValidos.length === 0 && erros.length > 0) {
			return res.status(400).json({
				error: 'Nenhum material válido para importar',
				erros
			});
		}
		
		// Importar os materiais válidos
		let importados = 0;
		const materiaisErro = [];
		
		for (const m of materiaisValidos) {
			try {
				await Material.create(m);
				importados++;
			} catch (e) {
				materiaisErro.push({
					nome: m.nome,
					erro: e.message
				});
			}
		}
		
		res.json({
			importados,
			total: materiais.length,
			erros: erros.length > 0 ? erros : undefined,
			errosImportacao: materiaisErro.length > 0 ? materiaisErro : undefined
		});
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: 'Erro ao importar materiais', details: e.message });
	}
}

module.exports = {
	listMaterials,
	getMaterial,
	createMaterial,
	updateMaterial,
	deleteMaterial,
	importExcel,
};

