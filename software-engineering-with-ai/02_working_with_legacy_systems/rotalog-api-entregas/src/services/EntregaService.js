const { Op, fn, col, literal } = require('sequelize');
const { Entrega, Rastreamento } = require('../models');
const logger = require('../config/logger');

const TRANSICOES_VALIDAS = {
	PENDENTE: ['ATRIBUIDA', 'CANCELADA'],
	ATRIBUIDA: ['EM_TRANSITO', 'CANCELADA'],
	EM_TRANSITO: ['ENTREGUE', 'CANCELADA'],
	ENTREGUE: [],
	CANCELADA: [],
};

function calcularDistanciaHaversine(latA, lngA, latB, lngB) {
	const R = 6371;
	const dLat = ((latB - latA) * Math.PI) / 180;
	const dLng = ((lngB - lngA) * Math.PI) / 180;
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos((latA * Math.PI) / 180) *
			Math.cos((latB * Math.PI) / 180) *
			Math.sin(dLng / 2) *
			Math.sin(dLng / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c;
}

function erroNaoEncontrado(mensagem) {
	const err = new Error(mensagem);
	err.status = 404;
	return err;
}

function erroBadRequest(mensagem) {
	const err = new Error(mensagem);
	err.status = 400;
	return err;
}

async function listar(filtros = {}) {
	const where = {};

	if (filtros.veiculo) {
		where.veiculo_placa = filtros.veiculo;
	}
	if (filtros.status) {
		where.status = filtros.status.toUpperCase();
	}
	if (filtros.motorista_id) {
		where.motorista_id = filtros.motorista_id;
	}

	return Entrega.findAll({
		where,
		order: [['data_criacao', 'DESC']],
		include: [
			{
				model: Rastreamento,
				as: 'rastreamentos',
				limit: 5,
				order: [['data_evento', 'DESC']],
			},
		],
	});
}

async function buscarPorId(id) {
	const entrega = await Entrega.findByPk(id, {
		include: [
			{
				model: Rastreamento,
				as: 'rastreamentos',
				order: [['data_evento', 'DESC']],
			},
		],
	});

	if (!entrega) {
		throw erroNaoEncontrado('Entrega não encontrada');
	}

	return entrega;
}

async function buscarPorNumeroPedido(numero) {
	const entrega = await Entrega.findOne({
		where: { numero_pedido: numero },
	});

	if (!entrega) {
		throw erroNaoEncontrado('Pedido não encontrado');
	}

	return entrega;
}

async function obterEstatisticas() {
	const stats = await Entrega.findAll({
		attributes: [
			'status',
			[fn('COUNT', col('id')), 'total'],
			[fn('COALESCE', fn('AVG', col('distancia_km')), 0), 'distancia_media'],
			[fn('COALESCE', fn('AVG', col('peso_kg')), 0), 'peso_medio'],
		],
		group: ['status'],
		raw: true,
	});

	const total = stats.reduce((acc, s) => acc + parseInt(s.total), 0);

	return {
		total,
		por_status: stats,
		gerado_em: new Date().toISOString(),
	};
}

async function criar(dados) {
	const { origem_endereco, destino_endereco, peso_kg, observacoes,
		origem_lat, origem_lng, destino_lat, destino_lng } = dados;

	if (!origem_endereco || !destino_endereco) {
		throw erroBadRequest('Endereços de origem e destino são obrigatórios');
	}

	const numeroPedido = 'PED-' + crypto.randomUUID();

	let distanciaKm = null;
	if (origem_lat && origem_lng && destino_lat && destino_lng) {
		distanciaKm = calcularDistanciaHaversine(
			parseFloat(origem_lat),
			parseFloat(origem_lng),
			parseFloat(destino_lat),
			parseFloat(destino_lng)
		);
	}

	const tempoEstimado = distanciaKm ? Math.ceil(distanciaKm * 2) : null;

	const entrega = await Entrega.create({
		numero_pedido: numeroPedido,
		origem_endereco,
		destino_endereco,
		origem_lat: origem_lat || null,
		origem_lng: origem_lng || null,
		destino_lat: destino_lat || null,
		destino_lng: destino_lng || null,
		peso_kg: peso_kg || null,
		distancia_km: distanciaKm,
		tempo_estimado_minutos: tempoEstimado,
		status: 'PENDENTE',
		observacoes: observacoes || null,
		data_criacao: new Date(),
		data_atualizacao: new Date(),
	});

	await Rastreamento.create({
		entrega_id: entrega.id,
		evento: 'PEDIDO_CRIADO',
		descricao: 'Pedido de entrega criado: ' + numeroPedido,
		data_evento: new Date(),
	});

	logger.info('Entrega criada', { numero_pedido: numeroPedido });

	return entrega;
}

async function atualizar(id, dados) {
	const entrega = await Entrega.findByPk(id);

	if (!entrega) {
		throw erroNaoEncontrado('Entrega não encontrada');
	}

	const { origem_endereco, destino_endereco, peso_kg, observacoes } = dados;

	if (origem_endereco) entrega.origem_endereco = origem_endereco;
	if (destino_endereco) entrega.destino_endereco = destino_endereco;
	if (peso_kg !== undefined) entrega.peso_kg = peso_kg;
	if (observacoes !== undefined) entrega.observacoes = observacoes;
	entrega.data_atualizacao = new Date();

	await entrega.save();
	return entrega;
}

async function atualizarStatus(id, status) {
	const statusValidos = ['PENDENTE', 'ATRIBUIDA', 'EM_TRANSITO', 'ENTREGUE', 'CANCELADA'];

	if (!statusValidos.includes(status)) {
		const err = erroBadRequest('Status inválido');
		err.statusValidos = statusValidos;
		throw err;
	}

	const entrega = await Entrega.findByPk(id);

	if (!entrega) {
		throw erroNaoEncontrado('Entrega não encontrada');
	}

	const statusAnterior = entrega.status;
	const transicoesPermitidas = TRANSICOES_VALIDAS[statusAnterior] || [];

	if (!transicoesPermitidas.includes(status)) {
		throw erroBadRequest(
			`Transição de status inválida: ${statusAnterior} -> ${status}`
		);
	}

	entrega.status = status;
	entrega.data_atualizacao = new Date();

	if (status === 'EM_TRANSITO') {
		entrega.data_coleta = new Date();
	}
	if (status === 'ENTREGUE') {
		entrega.data_entrega = new Date();
	}

	await entrega.save();

	await Rastreamento.create({
		entrega_id: entrega.id,
		evento: 'STATUS_ALTERADO',
		descricao: `Status alterado de ${statusAnterior} para ${status}`,
		data_evento: new Date(),
	});

	logger.info('Status atualizado', {
		numero_pedido: entrega.numero_pedido,
		de: statusAnterior,
		para: status,
	});

	return entrega;
}

async function atribuir(id, dados) {
	const { veiculo_placa, motorista_id, motorista_nome, veiculo_modelo } = dados;

	if (!veiculo_placa || !motorista_id) {
		throw erroBadRequest('Placa do veículo e ID do motorista são obrigatórios');
	}

	const entrega = await Entrega.findByPk(id);

	if (!entrega) {
		throw erroNaoEncontrado('Entrega não encontrada');
	}

	entrega.veiculo_placa = veiculo_placa;
	entrega.motorista_id = motorista_id;
	entrega.motorista_nome = motorista_nome || null;
	entrega.veiculo_modelo = veiculo_modelo || null;
	entrega.status = 'ATRIBUIDA';
	entrega.data_atualizacao = new Date();

	await entrega.save();

	await Rastreamento.create({
		entrega_id: entrega.id,
		evento: 'ENTREGA_ATRIBUIDA',
		descricao: `Atribuída ao veículo ${veiculo_placa} e motorista #${motorista_id}`,
		data_evento: new Date(),
	});

	logger.info('Entrega atribuída', {
		numero_pedido: entrega.numero_pedido,
		veiculo_placa,
	});

	return entrega;
}

async function cancelar(id) {
	const entrega = await Entrega.findByPk(id);

	if (!entrega) {
		throw erroNaoEncontrado('Entrega não encontrada');
	}

	if (entrega.status === 'ENTREGUE') {
		throw erroBadRequest('Não é possível cancelar uma entrega já entregue');
	}

	entrega.status = 'CANCELADA';
	entrega.data_atualizacao = new Date();

	await entrega.save();

	await Rastreamento.create({
		entrega_id: entrega.id,
		evento: 'ENTREGA_CANCELADA',
		descricao: 'Entrega cancelada',
		data_evento: new Date(),
	});

	return entrega;
}

module.exports = {
	listar,
	buscarPorId,
	buscarPorNumeroPedido,
	obterEstatisticas,
	criar,
	atualizar,
	atualizarStatus,
	atribuir,
	cancelar,
};
