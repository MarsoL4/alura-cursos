const request = require('supertest');
const express = require('express');

jest.mock('../services/EntregaService');

const EntregaService = require('../services/EntregaService');

function buildApp() {
	const app = express();
	app.use(express.json());
	app.use((req, res, next) => {
		req.user = { id: 1, nome: 'Test', role: 'admin' };
		next();
	});
	const entregasRouter = require('./entregas');
	app.use('/api/entregas', entregasRouter);
	app.use((err, req, res, next) => {
		res.status(err.status || 500).json({ error: err.message || 'Erro interno do servidor' });
	});
	return app;
}

let app;

beforeAll(() => {
	app = buildApp();
});

beforeEach(() => {
	jest.clearAllMocks();
});

describe('entregas routes', () => {
	describe('GET /api/entregas', () => {
		describe('when no filters are provided', () => {
			it('whenNoFilters_thenReturnsAllEntregas', async () => {
				// Arrange
				const fakeEntregas = [{ id: 1, numero_pedido: 'PED-001' }];
				EntregaService.listar.mockResolvedValue(fakeEntregas);

				// Act
				const res = await request(app).get('/api/entregas');

				// Assert
				expect(res.status).toBe(200);
				expect(res.body).toEqual(fakeEntregas);
				expect(EntregaService.listar).toHaveBeenCalledWith({});
			});
		});

		describe('when query filters are provided', () => {
			it('whenFiltersProvided_thenPassesFiltersToService', async () => {
				// Arrange
				EntregaService.listar.mockResolvedValue([]);

				// Act
				await request(app).get('/api/entregas?veiculo=ABC1234&status=pendente&motorista_id=5');

				// Assert
				expect(EntregaService.listar).toHaveBeenCalledWith({
					veiculo: 'ABC1234',
					status: 'pendente',
					motorista_id: '5',
				});
			});
		});

		describe('when service throws', () => {
			it('whenServiceError_thenReturns500', async () => {
				// Arrange
				EntregaService.listar.mockRejectedValue(new Error('DB error'));

				// Act
				const res = await request(app).get('/api/entregas');

				// Assert
				expect(res.status).toBe(500);
			});
		});
	});

	describe('GET /api/entregas/stats', () => {
		describe('when stats are returned successfully', () => {
			it('whenStatsReturned_thenReturns200WithStats', async () => {
				// Arrange
				const fakeStats = { total: 10, por_status: [], gerado_em: new Date().toISOString() };
				EntregaService.obterEstatisticas.mockResolvedValue(fakeStats);

				// Act
				const res = await request(app).get('/api/entregas/stats');

				// Assert
				expect(res.status).toBe(200);
				expect(res.body).toEqual(fakeStats);
			});
		});

		describe('when service throws', () => {
			it('whenServiceError_thenReturns500', async () => {
				// Arrange
				EntregaService.obterEstatisticas.mockRejectedValue(new Error('DB error'));

				// Act
				const res = await request(app).get('/api/entregas/stats');

				// Assert
				expect(res.status).toBe(500);
			});
		});
	});

	describe('GET /api/entregas/:id', () => {
		describe('when entrega exists', () => {
			it('whenEntregaFound_thenReturns200WithEntrega', async () => {
				// Arrange
				const fakeEntrega = { id: 1, numero_pedido: 'PED-001' };
				EntregaService.buscarPorId.mockResolvedValue(fakeEntrega);

				// Act
				const res = await request(app).get('/api/entregas/1');

				// Assert
				expect(res.status).toBe(200);
				expect(res.body).toEqual(fakeEntrega);
				expect(EntregaService.buscarPorId).toHaveBeenCalledWith('1');
			});
		});

		describe('when entrega does not exist', () => {
			it('whenEntregaNotFound_thenReturns404', async () => {
				// Arrange
				const err = new Error('Entrega não encontrada');
				err.status = 404;
				EntregaService.buscarPorId.mockRejectedValue(err);

				// Act
				const res = await request(app).get('/api/entregas/999');

				// Assert
				expect(res.status).toBe(404);
				expect(res.body).toEqual({ error: 'Entrega não encontrada' });
			});
		});

		describe('when service throws generic error', () => {
			it('whenServiceError_thenReturns500', async () => {
				// Arrange
				EntregaService.buscarPorId.mockRejectedValue(new Error('DB error'));

				// Act
				const res = await request(app).get('/api/entregas/1');

				// Assert
				expect(res.status).toBe(500);
			});
		});
	});

	describe('GET /api/entregas/pedido/:numeroPedido', () => {
		describe('when pedido exists', () => {
			it('whenPedidoFound_thenReturns200WithEntrega', async () => {
				// Arrange
				const fakeEntrega = { id: 1, numero_pedido: 'PED-123' };
				EntregaService.buscarPorNumeroPedido.mockResolvedValue(fakeEntrega);

				// Act
				const res = await request(app).get('/api/entregas/pedido/PED-123');

				// Assert
				expect(res.status).toBe(200);
				expect(res.body).toEqual(fakeEntrega);
				expect(EntregaService.buscarPorNumeroPedido).toHaveBeenCalledWith('PED-123');
			});
		});

		describe('when pedido does not exist', () => {
			it('whenPedidoNotFound_thenReturns404', async () => {
				// Arrange
				const err = new Error('Pedido não encontrado');
				err.status = 404;
				EntregaService.buscarPorNumeroPedido.mockRejectedValue(err);

				// Act
				const res = await request(app).get('/api/entregas/pedido/INEXISTENTE');

				// Assert
				expect(res.status).toBe(404);
				expect(res.body).toEqual({ error: 'Pedido não encontrado' });
			});
		});

		describe('when service throws generic error', () => {
			it('whenServiceError_thenReturns500', async () => {
				// Arrange
				EntregaService.buscarPorNumeroPedido.mockRejectedValue(new Error('DB error'));

				// Act
				const res = await request(app).get('/api/entregas/pedido/PED-123');

				// Assert
				expect(res.status).toBe(500);
			});
		});
	});

	describe('POST /api/entregas', () => {
		const validBody = {
			origem_endereco: 'Rua A, 100',
			destino_endereco: 'Rua B, 200',
		};

		describe('when valid body is provided', () => {
			it('whenValidBody_thenCreatesAndReturns201', async () => {
				// Arrange
				const fakeEntrega = { id: 1, numero_pedido: 'PED-uuid', status: 'PENDENTE' };
				EntregaService.criar.mockResolvedValue(fakeEntrega);

				// Act
				const res = await request(app).post('/api/entregas').send(validBody);

				// Assert
				expect(res.status).toBe(201);
				expect(res.body).toEqual(fakeEntrega);
				expect(EntregaService.criar).toHaveBeenCalledWith(validBody);
			});
		});

		describe('when service throws 400', () => {
			it('whenServiceThrows400_thenReturns400', async () => {
				// Arrange
				const err = new Error('Endereços de origem e destino são obrigatórios');
				err.status = 400;
				EntregaService.criar.mockRejectedValue(err);

				// Act
				const res = await request(app).post('/api/entregas').send({});

				// Assert
				expect(res.status).toBe(400);
				expect(res.body).toEqual({ error: 'Endereços de origem e destino são obrigatórios' });
			});
		});

		describe('when service throws generic error', () => {
			it('whenServiceError_thenReturns500', async () => {
				// Arrange
				EntregaService.criar.mockRejectedValue(new Error('DB error'));

				// Act
				const res = await request(app).post('/api/entregas').send(validBody);

				// Assert
				expect(res.status).toBe(500);
			});
		});
	});

	describe('PUT /api/entregas/:id', () => {
		describe('when entrega exists and body has fields to update', () => {
			it('whenValidUpdate_thenReturns200WithUpdatedEntrega', async () => {
				// Arrange
				const fakeEntrega = { id: 1, origem_endereco: 'Rua C, 999' };
				EntregaService.atualizar.mockResolvedValue(fakeEntrega);

				// Act
				const res = await request(app)
					.put('/api/entregas/1')
					.send({ origem_endereco: 'Rua C, 999' });

				// Assert
				expect(res.status).toBe(200);
				expect(res.body).toEqual(fakeEntrega);
				expect(EntregaService.atualizar).toHaveBeenCalledWith('1', { origem_endereco: 'Rua C, 999' });
			});
		});

		describe('when entrega does not exist', () => {
			it('whenEntregaNotFound_thenReturns404', async () => {
				// Arrange
				const err = new Error('Entrega não encontrada');
				err.status = 404;
				EntregaService.atualizar.mockRejectedValue(err);

				// Act
				const res = await request(app)
					.put('/api/entregas/999')
					.send({ origem_endereco: 'Rua C' });

				// Assert
				expect(res.status).toBe(404);
				expect(res.body).toEqual({ error: 'Entrega não encontrada' });
			});
		});

		describe('when service throws generic error', () => {
			it('whenServiceError_thenReturns500', async () => {
				// Arrange
				EntregaService.atualizar.mockRejectedValue(new Error('DB error'));

				// Act
				const res = await request(app)
					.put('/api/entregas/1')
					.send({ origem_endereco: 'Rua C' });

				// Assert
				expect(res.status).toBe(500);
			});
		});
	});

	describe('PATCH /api/entregas/:id/status', () => {
		describe('when status transition is valid', () => {
			it('whenValidStatus_thenReturns200WithUpdatedEntrega', async () => {
				// Arrange
				const fakeEntrega = { id: 1, status: 'EM_TRANSITO' };
				EntregaService.atualizarStatus.mockResolvedValue(fakeEntrega);

				// Act
				const res = await request(app)
					.patch('/api/entregas/1/status')
					.send({ status: 'EM_TRANSITO' });

				// Assert
				expect(res.status).toBe(200);
				expect(res.body).toEqual(fakeEntrega);
				expect(EntregaService.atualizarStatus).toHaveBeenCalledWith('1', 'EM_TRANSITO');
			});
		});

		describe('when status is invalid', () => {
			it('whenInvalidStatus_thenReturns400', async () => {
				// Arrange
				const err = new Error('Status inválido');
				err.status = 400;
				err.statusValidos = ['PENDENTE', 'ATRIBUIDA', 'EM_TRANSITO', 'ENTREGUE', 'CANCELADA'];
				EntregaService.atualizarStatus.mockRejectedValue(err);

				// Act
				const res = await request(app)
					.patch('/api/entregas/1/status')
					.send({ status: 'INVALIDO' });

				// Assert
				expect(res.status).toBe(400);
			});
		});

		describe('when entrega does not exist', () => {
			it('whenEntregaNotFound_thenReturns404', async () => {
				// Arrange
				const err = new Error('Entrega não encontrada');
				err.status = 404;
				EntregaService.atualizarStatus.mockRejectedValue(err);

				// Act
				const res = await request(app)
					.patch('/api/entregas/999/status')
					.send({ status: 'ENTREGUE' });

				// Assert
				expect(res.status).toBe(404);
				expect(res.body).toEqual({ error: 'Entrega não encontrada' });
			});
		});

		describe('when service throws generic error', () => {
			it('whenServiceError_thenReturns500', async () => {
				// Arrange
				EntregaService.atualizarStatus.mockRejectedValue(new Error('DB error'));

				// Act
				const res = await request(app)
					.patch('/api/entregas/1/status')
					.send({ status: 'ENTREGUE' });

				// Assert
				expect(res.status).toBe(500);
			});
		});
	});

	describe('PATCH /api/entregas/:id/atribuir', () => {
		describe('when valid assignment data is provided', () => {
			it('whenValidAtribuir_thenReturns200WithUpdatedEntrega', async () => {
				// Arrange
				const fakeEntrega = { id: 1, status: 'ATRIBUIDA', veiculo_placa: 'ABC1234' };
				EntregaService.atribuir.mockResolvedValue(fakeEntrega);

				// Act
				const res = await request(app)
					.patch('/api/entregas/1/atribuir')
					.send({ veiculo_placa: 'ABC1234', motorista_id: 10 });

				// Assert
				expect(res.status).toBe(200);
				expect(res.body).toEqual(fakeEntrega);
				expect(EntregaService.atribuir).toHaveBeenCalledWith('1', {
					veiculo_placa: 'ABC1234',
					motorista_id: 10,
				});
			});
		});

		describe('when required fields are missing', () => {
			it('whenVeiculoMissing_thenReturns400', async () => {
				// Arrange
				const err = new Error('Placa do veículo e ID do motorista são obrigatórios');
				err.status = 400;
				EntregaService.atribuir.mockRejectedValue(err);

				// Act
				const res = await request(app)
					.patch('/api/entregas/1/atribuir')
					.send({ motorista_id: 10 });

				// Assert
				expect(res.status).toBe(400);
				expect(res.body).toEqual({ error: 'Placa do veículo e ID do motorista são obrigatórios' });
			});
		});

		describe('when entrega does not exist', () => {
			it('whenEntregaNotFound_thenReturns404', async () => {
				// Arrange
				const err = new Error('Entrega não encontrada');
				err.status = 404;
				EntregaService.atribuir.mockRejectedValue(err);

				// Act
				const res = await request(app)
					.patch('/api/entregas/999/atribuir')
					.send({ veiculo_placa: 'ABC1234', motorista_id: 10 });

				// Assert
				expect(res.status).toBe(404);
				expect(res.body).toEqual({ error: 'Entrega não encontrada' });
			});
		});

		describe('when service throws generic error', () => {
			it('whenServiceError_thenReturns500', async () => {
				// Arrange
				EntregaService.atribuir.mockRejectedValue(new Error('DB error'));

				// Act
				const res = await request(app)
					.patch('/api/entregas/1/atribuir')
					.send({ veiculo_placa: 'ABC1234', motorista_id: 10 });

				// Assert
				expect(res.status).toBe(500);
			});
		});
	});

	describe('DELETE /api/entregas/:id', () => {
		describe('when entrega exists and can be cancelled', () => {
			it('whenEntregaCancelled_thenReturns200WithMessage', async () => {
				// Arrange
				const fakeEntrega = { id: 1, status: 'CANCELADA' };
				EntregaService.cancelar.mockResolvedValue(fakeEntrega);

				// Act
				const res = await request(app).delete('/api/entregas/1');

				// Assert
				expect(res.status).toBe(200);
				expect(res.body.message).toBe('Entrega cancelada');
				expect(res.body.entrega).toEqual(fakeEntrega);
				expect(EntregaService.cancelar).toHaveBeenCalledWith('1');
			});
		});

		describe('when entrega does not exist', () => {
			it('whenEntregaNotFound_thenReturns404', async () => {
				// Arrange
				const err = new Error('Entrega não encontrada');
				err.status = 404;
				EntregaService.cancelar.mockRejectedValue(err);

				// Act
				const res = await request(app).delete('/api/entregas/999');

				// Assert
				expect(res.status).toBe(404);
				expect(res.body).toEqual({ error: 'Entrega não encontrada' });
			});
		});

		describe('when entrega is already delivered', () => {
			it('whenEntregaAlreadyDelivered_thenReturns400', async () => {
				// Arrange
				const err = new Error('Não é possível cancelar uma entrega já entregue');
				err.status = 400;
				EntregaService.cancelar.mockRejectedValue(err);

				// Act
				const res = await request(app).delete('/api/entregas/1');

				// Assert
				expect(res.status).toBe(400);
				expect(res.body).toEqual({ error: 'Não é possível cancelar uma entrega já entregue' });
			});
		});

		describe('when service throws generic error', () => {
			it('whenServiceError_thenReturns500', async () => {
				// Arrange
				EntregaService.cancelar.mockRejectedValue(new Error('DB error'));

				// Act
				const res = await request(app).delete('/api/entregas/1');

				// Assert
				expect(res.status).toBe(500);
			});
		});
	});
});
