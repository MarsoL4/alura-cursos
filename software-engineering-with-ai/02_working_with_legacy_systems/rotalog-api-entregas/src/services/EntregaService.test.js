jest.mock('../models', () => ({
	Entrega: {
		findAll: jest.fn(),
		findByPk: jest.fn(),
		findOne: jest.fn(),
		create: jest.fn(),
	},
	Rastreamento: {
		create: jest.fn(),
	},
}));

jest.mock('../config/logger', () => ({
	info: jest.fn(),
	warn: jest.fn(),
	error: jest.fn(),
}));

const { Entrega, Rastreamento } = require('../models');
const EntregaService = require('./EntregaService');

beforeEach(() => {
	jest.clearAllMocks();
});

describe('EntregaService', () => {
	describe('listar', () => {
		describe('when no filters are provided', () => {
			it('whenNoFilters_thenCallsFindAllWithEmptyWhere', async () => {
				// Arrange
				Entrega.findAll.mockResolvedValue([]);

				// Act
				await EntregaService.listar({});

				// Assert
				const args = Entrega.findAll.mock.calls[0][0];
				expect(args.where).toEqual({});
			});
		});

		describe('when all filters are provided', () => {
			it('whenAllFilters_thenBuildsWhereCorrectly', async () => {
				// Arrange
				Entrega.findAll.mockResolvedValue([]);

				// Act
				await EntregaService.listar({ veiculo: 'ABC1234', status: 'pendente', motorista_id: '5' });

				// Assert
				const args = Entrega.findAll.mock.calls[0][0];
				expect(args.where.veiculo_placa).toBe('ABC1234');
				expect(args.where.status).toBe('PENDENTE');
				expect(args.where.motorista_id).toBe('5');
			});
		});

		describe('when database throws', () => {
			it('whenFindAllThrows_thenPropagatesError', async () => {
				// Arrange
				Entrega.findAll.mockRejectedValue(new Error('DB error'));

				// Act & Assert
				await expect(EntregaService.listar({})).rejects.toThrow('DB error');
			});
		});
	});

	describe('buscarPorId', () => {
		describe('when entrega exists', () => {
			it('whenEntregaFound_thenReturnsEntrega', async () => {
				// Arrange
				const fakeEntrega = { id: 1, numero_pedido: 'PED-001' };
				Entrega.findByPk.mockResolvedValue(fakeEntrega);

				// Act
				const result = await EntregaService.buscarPorId(1);

				// Assert
				expect(result).toEqual(fakeEntrega);
				expect(Entrega.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
			});
		});

		describe('when entrega does not exist', () => {
			it('whenEntregaNotFound_thenThrows404', async () => {
				// Arrange
				Entrega.findByPk.mockResolvedValue(null);

				// Act & Assert
				const err = await EntregaService.buscarPorId(999).catch(e => e);
				expect(err.status).toBe(404);
				expect(err.message).toBe('Entrega não encontrada');
			});
		});
	});

	describe('buscarPorNumeroPedido', () => {
		describe('when pedido exists', () => {
			it('whenPedidoFound_thenReturnsEntrega', async () => {
				// Arrange
				const fakeEntrega = { id: 1, numero_pedido: 'PED-123' };
				Entrega.findOne.mockResolvedValue(fakeEntrega);

				// Act
				const result = await EntregaService.buscarPorNumeroPedido('PED-123');

				// Assert
				expect(result).toEqual(fakeEntrega);
				expect(Entrega.findOne).toHaveBeenCalledWith({ where: { numero_pedido: 'PED-123' } });
			});
		});

		describe('when pedido does not exist', () => {
			it('whenPedidoNotFound_thenThrows404', async () => {
				// Arrange
				Entrega.findOne.mockResolvedValue(null);

				// Act & Assert
				const err = await EntregaService.buscarPorNumeroPedido('NAOEXISTE').catch(e => e);
				expect(err.status).toBe(404);
				expect(err.message).toBe('Pedido não encontrado');
			});
		});
	});

	describe('obterEstatisticas', () => {
		describe('when stats are returned', () => {
			it('whenStatsReturned_thenCalculatesTotalCorrectly', async () => {
				// Arrange
				Entrega.findAll.mockResolvedValue([
					{ status: 'PENDENTE', total: '3' },
					{ status: 'ENTREGUE', total: '7' },
				]);

				// Act
				const result = await EntregaService.obterEstatisticas();

				// Assert
				expect(result.total).toBe(10);
				expect(result.por_status).toHaveLength(2);
				expect(result.gerado_em).toBeDefined();
			});
		});

		describe('when no stats exist', () => {
			it('whenNoStats_thenReturnsZeroTotal', async () => {
				// Arrange
				Entrega.findAll.mockResolvedValue([]);

				// Act
				const result = await EntregaService.obterEstatisticas();

				// Assert
				expect(result.total).toBe(0);
				expect(result.por_status).toHaveLength(0);
			});
		});

		describe('when database throws', () => {
			it('whenFindAllThrows_thenPropagatesError', async () => {
				// Arrange
				Entrega.findAll.mockRejectedValue(new Error('DB error'));

				// Act & Assert
				await expect(EntregaService.obterEstatisticas()).rejects.toThrow('DB error');
			});
		});
	});

	describe('criar', () => {
		const dadosValidos = {
			origem_endereco: 'Rua A, 100',
			destino_endereco: 'Rua B, 200',
			peso_kg: 5,
		};

		describe('when required fields are present without coordinates', () => {
			it('whenValidDataNoCoords_thenCreatesEntregaWithNullDistancia', async () => {
				// Arrange
				const fakeEntrega = { id: 1, numero_pedido: 'PED-uuid', status: 'PENDENTE' };
				Entrega.create.mockResolvedValue(fakeEntrega);
				Rastreamento.create.mockResolvedValue({});

				// Act
				const result = await EntregaService.criar(dadosValidos);

				// Assert
				expect(result).toEqual(fakeEntrega);
				const createArgs = Entrega.create.mock.calls[0][0];
				expect(createArgs.status).toBe('PENDENTE');
				expect(createArgs.numero_pedido).toMatch(/^PED-/);
				expect(createArgs.distancia_km).toBeNull();
				expect(createArgs.tempo_estimado_minutos).toBeNull();
			});

			it('whenValidData_thenCreatesRastreamentoInicial', async () => {
				// Arrange
				const fakeEntrega = { id: 42, numero_pedido: 'PED-uuid' };
				Entrega.create.mockResolvedValue(fakeEntrega);
				Rastreamento.create.mockResolvedValue({});

				// Act
				await EntregaService.criar(dadosValidos);

				// Assert
				expect(Rastreamento.create).toHaveBeenCalledTimes(1);
				const rastrArgs = Rastreamento.create.mock.calls[0][0];
				expect(rastrArgs.entrega_id).toBe(42);
				expect(rastrArgs.evento).toBe('PEDIDO_CRIADO');
			});
		});

		describe('when coordinates are provided', () => {
			it('whenCoordsProvided_thenCalculatesDistanciaHaversine', async () => {
				// Arrange
				const fakeEntrega = { id: 1, numero_pedido: 'PED-uuid' };
				Entrega.create.mockResolvedValue(fakeEntrega);
				Rastreamento.create.mockResolvedValue({});

				// Act
				await EntregaService.criar({
					...dadosValidos,
					origem_lat: -23.5505,
					origem_lng: -46.6333,
					destino_lat: -23.5615,
					destino_lng: -46.6559,
				});

				// Assert
				const createArgs = Entrega.create.mock.calls[0][0];
				expect(createArgs.distancia_km).not.toBeNull();
				expect(createArgs.distancia_km).toBeGreaterThan(0);
				expect(createArgs.tempo_estimado_minutos).not.toBeNull();
			});
		});

		describe('when required fields are missing', () => {
			it('whenOrigemMissing_thenThrows400', async () => {
				// Act & Assert
				const err = await EntregaService.criar({ destino_endereco: 'Rua B' }).catch(e => e);
				expect(err.status).toBe(400);
				expect(err.message).toBe('Endereços de origem e destino são obrigatórios');
			});

			it('whenDestinoMissing_thenThrows400', async () => {
				// Act & Assert
				const err = await EntregaService.criar({ origem_endereco: 'Rua A' }).catch(e => e);
				expect(err.status).toBe(400);
				expect(err.message).toBe('Endereços de origem e destino são obrigatórios');
			});

			it('whenBothMissing_thenThrows400', async () => {
				// Act & Assert
				const err = await EntregaService.criar({}).catch(e => e);
				expect(err.status).toBe(400);
			});
		});

		describe('when numero_pedido uses randomUUID', () => {
			it('whenCreating_thenNumeroPedidoUsesUUIDFormat', async () => {
				// Arrange
				Entrega.create.mockResolvedValue({ id: 1, numero_pedido: 'PED-uuid' });
				Rastreamento.create.mockResolvedValue({});

				// Act
				await EntregaService.criar(dadosValidos);

				// Assert
				const createArgs = Entrega.create.mock.calls[0][0];
				expect(createArgs.numero_pedido).toMatch(
					/^PED-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
				);
			});
		});

		describe('when database throws', () => {
			it('whenCreateThrows_thenPropagatesError', async () => {
				// Arrange
				Entrega.create.mockRejectedValue(new Error('unique constraint'));

				// Act & Assert
				await expect(EntregaService.criar(dadosValidos)).rejects.toThrow('unique constraint');
			});
		});
	});

	describe('atualizar', () => {
		describe('when entrega exists', () => {
			it('whenValidUpdate_thenSavesAndReturnsEntrega', async () => {
				// Arrange
				const fakeEntrega = {
					id: 1,
					origem_endereco: 'Rua A',
					destino_endereco: 'Rua B',
					peso_kg: 5,
					observacoes: null,
					data_atualizacao: null,
					save: jest.fn().mockResolvedValue(true),
				};
				Entrega.findByPk.mockResolvedValue(fakeEntrega);

				// Act
				const result = await EntregaService.atualizar(1, {
					origem_endereco: 'Rua C',
					peso_kg: 10,
					observacoes: 'Fragil',
				});

				// Assert
				expect(result.origem_endereco).toBe('Rua C');
				expect(result.peso_kg).toBe(10);
				expect(result.observacoes).toBe('Fragil');
				expect(fakeEntrega.save).toHaveBeenCalledTimes(1);
			});
		});

		describe('when entrega does not exist', () => {
			it('whenEntregaNotFound_thenThrows404', async () => {
				// Arrange
				Entrega.findByPk.mockResolvedValue(null);

				// Act & Assert
				const err = await EntregaService.atualizar(999, {}).catch(e => e);
				expect(err.status).toBe(404);
				expect(err.message).toBe('Entrega não encontrada');
			});
		});
	});

	describe('atualizarStatus', () => {
		describe('when transition is valid', () => {
			it('whenPENDENTEtoATRIBUIDA_thenUpdatesStatus', async () => {
				// Arrange
				const fakeEntrega = {
					id: 1,
					numero_pedido: 'PED-001',
					status: 'PENDENTE',
					data_atualizacao: null,
					data_coleta: null,
					data_entrega: null,
					save: jest.fn().mockResolvedValue(true),
				};
				Entrega.findByPk.mockResolvedValue(fakeEntrega);
				Rastreamento.create.mockResolvedValue({});

				// Act
				const result = await EntregaService.atualizarStatus(1, 'ATRIBUIDA');

				// Assert
				expect(result.status).toBe('ATRIBUIDA');
				expect(fakeEntrega.save).toHaveBeenCalledTimes(1);
				expect(Rastreamento.create).toHaveBeenCalledTimes(1);
			});

			it('whenATRIBUIDAtoEM_TRANSITO_thenSetsDataColeta', async () => {
				// Arrange
				const fakeEntrega = {
					id: 1,
					numero_pedido: 'PED-001',
					status: 'ATRIBUIDA',
					data_atualizacao: null,
					data_coleta: null,
					data_entrega: null,
					save: jest.fn().mockResolvedValue(true),
				};
				Entrega.findByPk.mockResolvedValue(fakeEntrega);
				Rastreamento.create.mockResolvedValue({});

				// Act
				await EntregaService.atualizarStatus(1, 'EM_TRANSITO');

				// Assert
				expect(fakeEntrega.data_coleta).not.toBeNull();
			});

			it('whenEM_TRANSITOtoENTREGUE_thenSetsDataEntrega', async () => {
				// Arrange
				const fakeEntrega = {
					id: 1,
					numero_pedido: 'PED-001',
					status: 'EM_TRANSITO',
					data_atualizacao: null,
					data_coleta: null,
					data_entrega: null,
					save: jest.fn().mockResolvedValue(true),
				};
				Entrega.findByPk.mockResolvedValue(fakeEntrega);
				Rastreamento.create.mockResolvedValue({});

				// Act
				await EntregaService.atualizarStatus(1, 'ENTREGUE');

				// Assert
				expect(fakeEntrega.data_entrega).not.toBeNull();
			});

			it('whenAnyStatustoCANCELADA_thenAllowed', async () => {
				// Arrange
				const fakeEntrega = {
					id: 1,
					numero_pedido: 'PED-001',
					status: 'EM_TRANSITO',
					data_atualizacao: null,
					data_coleta: null,
					data_entrega: null,
					save: jest.fn().mockResolvedValue(true),
				};
				Entrega.findByPk.mockResolvedValue(fakeEntrega);
				Rastreamento.create.mockResolvedValue({});

				// Act
				const result = await EntregaService.atualizarStatus(1, 'CANCELADA');

				// Assert
				expect(result.status).toBe('CANCELADA');
			});
		});

		describe('when status is not in valid set', () => {
			it('whenInvalidStatus_thenThrows400WithoutCallingDB', async () => {
				// Act & Assert
				const err = await EntregaService.atualizarStatus(1, 'FORA_DO_MAPA').catch(e => e);
				expect(err.status).toBe(400);
				expect(err.message).toBe('Status inválido');
				expect(Entrega.findByPk).not.toHaveBeenCalled();
			});
		});

		describe('when transition is invalid', () => {
			it('whenENTREGUEtoPENDENTE_thenThrows400', async () => {
				// Arrange
				const fakeEntrega = {
					id: 1,
					numero_pedido: 'PED-001',
					status: 'ENTREGUE',
					save: jest.fn(),
				};
				Entrega.findByPk.mockResolvedValue(fakeEntrega);

				// Act & Assert
				const err = await EntregaService.atualizarStatus(1, 'PENDENTE').catch(e => e);
				expect(err.status).toBe(400);
				expect(err.message).toContain('ENTREGUE -> PENDENTE');
				expect(fakeEntrega.save).not.toHaveBeenCalled();
			});

			it('whenCANCELADAtoEM_TRANSITO_thenThrows400', async () => {
				// Arrange
				const fakeEntrega = {
					id: 1,
					numero_pedido: 'PED-001',
					status: 'CANCELADA',
					save: jest.fn(),
				};
				Entrega.findByPk.mockResolvedValue(fakeEntrega);

				// Act & Assert
				const err = await EntregaService.atualizarStatus(1, 'EM_TRANSITO').catch(e => e);
				expect(err.status).toBe(400);
				expect(err.message).toContain('CANCELADA -> EM_TRANSITO');
			});

			it('whenPENDENTEtoENTREGUE_thenThrows400', async () => {
				// Arrange
				const fakeEntrega = { id: 1, status: 'PENDENTE', save: jest.fn() };
				Entrega.findByPk.mockResolvedValue(fakeEntrega);

				// Act & Assert
				const err = await EntregaService.atualizarStatus(1, 'ENTREGUE').catch(e => e);
				expect(err.status).toBe(400);
			});
		});

		describe('when entrega does not exist', () => {
			it('whenEntregaNotFound_thenThrows404', async () => {
				// Arrange
				Entrega.findByPk.mockResolvedValue(null);

				// Act & Assert
				const err = await EntregaService.atualizarStatus(999, 'ATRIBUIDA').catch(e => e);
				expect(err.status).toBe(404);
				expect(err.message).toBe('Entrega não encontrada');
			});
		});
	});

	describe('atribuir', () => {
		describe('when valid data is provided', () => {
			it('whenValidAtribuir_thenSetsVeiculoAndMotoristAndStatus', async () => {
				// Arrange
				const fakeEntrega = {
					id: 1,
					numero_pedido: 'PED-001',
					status: 'PENDENTE',
					veiculo_placa: null,
					motorista_id: null,
					motorista_nome: null,
					veiculo_modelo: null,
					data_atualizacao: null,
					save: jest.fn().mockResolvedValue(true),
				};
				Entrega.findByPk.mockResolvedValue(fakeEntrega);
				Rastreamento.create.mockResolvedValue({});

				// Act
				const result = await EntregaService.atribuir(1, {
					veiculo_placa: 'ABC1234',
					motorista_id: 10,
					motorista_nome: 'Carlos',
					veiculo_modelo: 'VW Gol',
				});

				// Assert
				expect(result.veiculo_placa).toBe('ABC1234');
				expect(result.motorista_id).toBe(10);
				expect(result.motorista_nome).toBe('Carlos');
				expect(result.veiculo_modelo).toBe('VW Gol');
				expect(result.status).toBe('ATRIBUIDA');
				expect(Rastreamento.create).toHaveBeenCalledTimes(1);
			});

			it('whenOptionalFieldsMissing_thenSetsNullForThem', async () => {
				// Arrange
				const fakeEntrega = {
					id: 1,
					numero_pedido: 'PED-001',
					status: 'PENDENTE',
					veiculo_placa: null,
					motorista_id: null,
					motorista_nome: 'old',
					veiculo_modelo: 'old',
					data_atualizacao: null,
					save: jest.fn().mockResolvedValue(true),
				};
				Entrega.findByPk.mockResolvedValue(fakeEntrega);
				Rastreamento.create.mockResolvedValue({});

				// Act
				await EntregaService.atribuir(1, { veiculo_placa: 'XYZ9999', motorista_id: 5 });

				// Assert
				expect(fakeEntrega.motorista_nome).toBeNull();
				expect(fakeEntrega.veiculo_modelo).toBeNull();
			});
		});

		describe('when required fields are missing', () => {
			it('whenVeiculoPlacarMissing_thenThrows400', async () => {
				// Act & Assert
				const err = await EntregaService.atribuir(1, { motorista_id: 10 }).catch(e => e);
				expect(err.status).toBe(400);
				expect(err.message).toBe('Placa do veículo e ID do motorista são obrigatórios');
				expect(Entrega.findByPk).not.toHaveBeenCalled();
			});

			it('whenMotoristaIdMissing_thenThrows400', async () => {
				// Act & Assert
				const err = await EntregaService.atribuir(1, { veiculo_placa: 'ABC1234' }).catch(e => e);
				expect(err.status).toBe(400);
				expect(Entrega.findByPk).not.toHaveBeenCalled();
			});
		});

		describe('when entrega does not exist', () => {
			it('whenEntregaNotFound_thenThrows404', async () => {
				// Arrange
				Entrega.findByPk.mockResolvedValue(null);

				// Act & Assert
				const err = await EntregaService.atribuir(999, { veiculo_placa: 'ABC1234', motorista_id: 10 }).catch(e => e);
				expect(err.status).toBe(404);
				expect(err.message).toBe('Entrega não encontrada');
			});
		});
	});

	describe('cancelar', () => {
		describe('when entrega can be cancelled', () => {
			it('whenEntregaPENDENTE_thenCancelsSuccessfully', async () => {
				// Arrange
				const fakeEntrega = {
					id: 1,
					status: 'PENDENTE',
					data_atualizacao: null,
					save: jest.fn().mockResolvedValue(true),
				};
				Entrega.findByPk.mockResolvedValue(fakeEntrega);
				Rastreamento.create.mockResolvedValue({});

				// Act
				const result = await EntregaService.cancelar(1);

				// Assert
				expect(result.status).toBe('CANCELADA');
				expect(fakeEntrega.save).toHaveBeenCalledTimes(1);
				expect(Rastreamento.create).toHaveBeenCalledTimes(1);
				const rastrArgs = Rastreamento.create.mock.calls[0][0];
				expect(rastrArgs.evento).toBe('ENTREGA_CANCELADA');
			});

			it('whenEntregaEM_TRANSITO_thenCancelsSuccessfully', async () => {
				// Arrange
				const fakeEntrega = {
					id: 1,
					status: 'EM_TRANSITO',
					data_atualizacao: null,
					save: jest.fn().mockResolvedValue(true),
				};
				Entrega.findByPk.mockResolvedValue(fakeEntrega);
				Rastreamento.create.mockResolvedValue({});

				// Act
				const result = await EntregaService.cancelar(1);

				// Assert
				expect(result.status).toBe('CANCELADA');
			});
		});

		describe('when entrega is already delivered', () => {
			it('whenEntregaENTREGUE_thenThrows400', async () => {
				// Arrange
				const fakeEntrega = { id: 1, status: 'ENTREGUE' };
				Entrega.findByPk.mockResolvedValue(fakeEntrega);

				// Act & Assert
				const err = await EntregaService.cancelar(1).catch(e => e);
				expect(err.status).toBe(400);
				expect(err.message).toBe('Não é possível cancelar uma entrega já entregue');
				expect(Rastreamento.create).not.toHaveBeenCalled();
			});
		});

		describe('when entrega does not exist', () => {
			it('whenEntregaNotFound_thenThrows404', async () => {
				// Arrange
				Entrega.findByPk.mockResolvedValue(null);

				// Act & Assert
				const err = await EntregaService.cancelar(999).catch(e => e);
				expect(err.status).toBe(404);
				expect(err.message).toBe('Entrega não encontrada');
			});
		});

		describe('when database throws', () => {
			it('whenFindByPkThrows_thenPropagatesError', async () => {
				// Arrange
				Entrega.findByPk.mockRejectedValue(new Error('DB error'));

				// Act & Assert
				await expect(EntregaService.cancelar(1)).rejects.toThrow('DB error');
			});
		});
	});
});
