const express = require('express');
const router = express.Router();
const EntregaService = require('../services/EntregaService');

router.get('/', async (req, res, next) => {
	try {
		const filtros = {};
		if (req.query.veiculo) filtros.veiculo = req.query.veiculo;
		if (req.query.status) filtros.status = req.query.status;
		if (req.query.motorista_id) filtros.motorista_id = req.query.motorista_id;

		const entregas = await EntregaService.listar(filtros);
		res.json(entregas);
	} catch (err) {
		next(err);
	}
});

router.get('/stats', async (_req, res, next) => {
	try {
		const stats = await EntregaService.obterEstatisticas();
		res.json(stats);
	} catch (err) {
		next(err);
	}
});

router.get('/pedido/:numeroPedido', async (req, res, next) => {
	try {
		const entrega = await EntregaService.buscarPorNumeroPedido(req.params.numeroPedido);
		res.json(entrega);
	} catch (err) {
		next(err);
	}
});

router.get('/:id', async (req, res, next) => {
	try {
		const entrega = await EntregaService.buscarPorId(req.params.id);
		res.json(entrega);
	} catch (err) {
		next(err);
	}
});

router.post('/', async (req, res, next) => {
	try {
		const entrega = await EntregaService.criar(req.body);
		res.status(201).json(entrega);
	} catch (err) {
		next(err);
	}
});

router.put('/:id', async (req, res, next) => {
	try {
		const entrega = await EntregaService.atualizar(req.params.id, req.body);
		res.json(entrega);
	} catch (err) {
		next(err);
	}
});

router.patch('/:id/status', async (req, res, next) => {
	try {
		const entrega = await EntregaService.atualizarStatus(req.params.id, req.body.status);
		res.json(entrega);
	} catch (err) {
		next(err);
	}
});

router.patch('/:id/atribuir', async (req, res, next) => {
	try {
		const entrega = await EntregaService.atribuir(req.params.id, req.body);
		res.json(entrega);
	} catch (err) {
		next(err);
	}
});

router.delete('/:id', async (req, res, next) => {
	try {
		const entrega = await EntregaService.cancelar(req.params.id);
		res.json({ message: 'Entrega cancelada', entrega });
	} catch (err) {
		next(err);
	}
});

module.exports = router;
