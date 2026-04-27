package com.rotalog.service;

import com.rotalog.domain.Veiculo;
import com.rotalog.dto.EstatisticasFrotaResponse;
import com.rotalog.exception.PlacaDuplicadaException;
import com.rotalog.exception.ResourceNotFoundException;
import com.rotalog.exception.VeiculoNotFoundException;
import com.rotalog.exception.VeiculoStatusInvalidoException;
import com.rotalog.exception.VeiculoValidacaoException;
import com.rotalog.repository.VeiculoRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class VeiculoServiceTest {

	@Mock
	private VeiculoRepository veiculoRepository;

	@Mock
	private VeiculoNotificacaoService veiculoNotificacaoService;

	@Mock
	private VeiculoManutencaoService veiculoManutencaoService;

	@InjectMocks
	private VeiculoService veiculoService;

	private Veiculo veiculoComId(Long id, String placa, String modelo, String status, Long quilometragem) {
		Veiculo v = new Veiculo();
		v.setId(id);
		v.setPlaca(placa);
		v.setModelo(modelo);
		v.setStatus(status);
		v.setQuilometragem(quilometragem);
		return v;
	}

	@Nested
	@DisplayName("listarTodos")
	class ListarTodos {

		@Test
		void whenRepositoryReturnsVeiculos_thenReturnsList() {
			List<Veiculo> lista = List.of(
				veiculoComId(1L, "ABC1234", "Fiat Ducato", "ATIVO", 10000L),
				veiculoComId(2L, "XYZ5678", "Mercedes Sprinter", "ATIVO", 20000L)
			);
			when(veiculoRepository.findAll()).thenReturn(lista);

			List<Veiculo> resultado = veiculoService.listarTodos();

			assertThat(resultado).hasSize(2);
			assertThat(resultado).isEqualTo(lista);
		}

		@Test
		void whenRepositoryReturnsEmpty_thenReturnsEmptyList() {
			when(veiculoRepository.findAll()).thenReturn(List.of());

			List<Veiculo> resultado = veiculoService.listarTodos();

			assertThat(resultado).isEmpty();
		}
	}

	@Nested
	@DisplayName("buscarPorId")
	class BuscarPorId {

		@Test
		void whenVeiculoExists_thenReturnsVeiculo() {
			Veiculo veiculo = veiculoComId(1L, "ABC1234", "Fiat Ducato", "ATIVO", 0L);
			when(veiculoRepository.findById(1L)).thenReturn(Optional.of(veiculo));

			Veiculo resultado = veiculoService.buscarPorId(1L);

			assertThat(resultado.getId()).isEqualTo(1L);
			assertThat(resultado.getPlaca()).isEqualTo("ABC1234");
		}

		@Test
		void whenVeiculoNotFound_thenThrowsResourceNotFoundException() {
			when(veiculoRepository.findById(99L)).thenReturn(Optional.empty());

			assertThatThrownBy(() -> veiculoService.buscarPorId(99L))
				.isInstanceOf(ResourceNotFoundException.class)
				.hasMessageContaining("99");
		}
	}

	@Nested
	@DisplayName("buscarPorPlaca")
	class BuscarPorPlaca {

		@Test
		void whenPlacaExists_thenReturnsVeiculo() {
			Veiculo veiculo = veiculoComId(1L, "ABC1234", "Fiat Ducato", "ATIVO", 0L);
			when(veiculoRepository.findByPlaca("ABC1234")).thenReturn(Optional.of(veiculo));

			Veiculo resultado = veiculoService.buscarPorPlaca("ABC1234");

			assertThat(resultado.getPlaca()).isEqualTo("ABC1234");
		}

		@Test
		void whenPlacaNotFound_thenThrowsVeiculoNotFoundException() {
			when(veiculoRepository.findByPlaca("ZZZ9999")).thenReturn(Optional.empty());

			assertThatThrownBy(() -> veiculoService.buscarPorPlaca("ZZZ9999"))
				.isInstanceOf(VeiculoNotFoundException.class)
				.hasMessageContaining("ZZZ9999");
		}
	}

	@Nested
	@DisplayName("registrarVeiculo")
	class RegistrarVeiculo {

		@Test
		void whenDadosValidos_thenSalvaERetornaVeiculo() {
			when(veiculoRepository.findByPlaca("abc1234")).thenReturn(Optional.empty());
			Veiculo salvo = veiculoComId(1L, "ABC1234", "Fiat Ducato", "ATIVO", 0L);
			when(veiculoRepository.save(any(Veiculo.class))).thenReturn(salvo);

			Veiculo resultado = veiculoService.registrarVeiculo("abc1234", "Fiat Ducato", 2022);

			assertThat(resultado.getPlaca()).isEqualTo("ABC1234");
			assertThat(resultado.getStatus()).isEqualTo("ATIVO");
			verify(veiculoRepository).save(any(Veiculo.class));
		}

		@Test
		void whenDadosValidos_thenEnviaNotificacao() {
			when(veiculoRepository.findByPlaca("abc1234")).thenReturn(Optional.empty());
			Veiculo salvo = veiculoComId(1L, "ABC1234", "Fiat Ducato", "ATIVO", 0L);
			when(veiculoRepository.save(any(Veiculo.class))).thenReturn(salvo);

			veiculoService.registrarVeiculo("abc1234", "Fiat Ducato", 2022);

			verify(veiculoNotificacaoService).notificarNovoVeiculo(anyString(), anyString());
		}

		@Test
		void whenPlacaNula_thenThrowsVeiculoValidacaoException() {
			assertThatThrownBy(() -> veiculoService.registrarVeiculo(null, "Fiat Ducato", 2022))
				.isInstanceOf(VeiculoValidacaoException.class)
				.hasMessageContaining("Placa");
		}

		@Test
		void whenPlacaVazia_thenThrowsVeiculoValidacaoException() {
			assertThatThrownBy(() -> veiculoService.registrarVeiculo("", "Fiat Ducato", 2022))
				.isInstanceOf(VeiculoValidacaoException.class)
				.hasMessageContaining("Placa");
		}

		@Test
		void whenPlacaComTamanhoErrado_thenThrowsVeiculoValidacaoException() {
			assertThatThrownBy(() -> veiculoService.registrarVeiculo("ABC123", "Fiat Ducato", 2022))
				.isInstanceOf(VeiculoValidacaoException.class)
				.hasMessageContaining("7 caracteres");
		}

		@Test
		void whenPlacaJaExistente_thenThrowsPlacaDuplicadaException() {
			Veiculo existente = veiculoComId(1L, "ABC1234", "Fiat Ducato", "ATIVO", 0L);
			when(veiculoRepository.findByPlaca("ABC1234")).thenReturn(Optional.of(existente));

			assertThatThrownBy(() -> veiculoService.registrarVeiculo("ABC1234", "Fiat Ducato", 2022))
				.isInstanceOf(PlacaDuplicadaException.class)
				.hasMessageContaining("ABC1234");
		}

		@Test
		void whenModeloNulo_thenThrowsVeiculoValidacaoException() {
			when(veiculoRepository.findByPlaca("ABC1234")).thenReturn(Optional.empty());

			assertThatThrownBy(() -> veiculoService.registrarVeiculo("ABC1234", null, 2022))
				.isInstanceOf(VeiculoValidacaoException.class)
				.hasMessageContaining("Modelo");
		}

		@Test
		void whenModeloVazio_thenThrowsVeiculoValidacaoException() {
			when(veiculoRepository.findByPlaca("ABC1234")).thenReturn(Optional.empty());

			assertThatThrownBy(() -> veiculoService.registrarVeiculo("ABC1234", "", 2022))
				.isInstanceOf(VeiculoValidacaoException.class)
				.hasMessageContaining("Modelo");
		}

		@Test
		void whenAnoFabricacaoNulo_thenThrowsVeiculoValidacaoException() {
			when(veiculoRepository.findByPlaca("ABC1234")).thenReturn(Optional.empty());

			assertThatThrownBy(() -> veiculoService.registrarVeiculo("ABC1234", "Fiat Ducato", null))
				.isInstanceOf(VeiculoValidacaoException.class)
				.hasMessageContaining("Ano");
		}

		@Test
		void whenAnoFabricacaoMenorQue1900_thenThrowsVeiculoValidacaoException() {
			when(veiculoRepository.findByPlaca("ABC1234")).thenReturn(Optional.empty());

			assertThatThrownBy(() -> veiculoService.registrarVeiculo("ABC1234", "Fiat Ducato", 1899))
				.isInstanceOf(VeiculoValidacaoException.class)
				.hasMessageContaining("Ano");
		}

		@Test
		void whenAnoFabricacaoMaiorQue2100_thenThrowsVeiculoValidacaoException() {
			when(veiculoRepository.findByPlaca("ABC1234")).thenReturn(Optional.empty());

			assertThatThrownBy(() -> veiculoService.registrarVeiculo("ABC1234", "Fiat Ducato", 2101))
				.isInstanceOf(VeiculoValidacaoException.class)
				.hasMessageContaining("Ano");
		}

		@Test
		void whenDadosValidos_thenPlacaSalvaEmMaiusculo() {
			when(veiculoRepository.findByPlaca("abc1234")).thenReturn(Optional.empty());
			when(veiculoRepository.save(any(Veiculo.class))).thenAnswer(inv -> inv.getArgument(0));

			Veiculo resultado = veiculoService.registrarVeiculo("abc1234", "Fiat Ducato", 2022);

			assertThat(resultado.getPlaca()).isEqualTo("ABC1234");
		}
	}

	@Nested
	@DisplayName("atualizarVeiculo")
	class AtualizarVeiculo {

		@Test
		void whenVeiculoExistsEDadosValidos_thenAtualiza() {
			Veiculo veiculo = veiculoComId(1L, "ABC1234", "Fiat Ducato", "ATIVO", 10000L);
			when(veiculoRepository.findById(1L)).thenReturn(Optional.of(veiculo));
			when(veiculoRepository.save(any(Veiculo.class))).thenAnswer(inv -> inv.getArgument(0));

			Veiculo resultado = veiculoService.atualizarVeiculo(1L, "Fiat Toro", 2023, 15000L);

			assertThat(resultado.getModelo()).isEqualTo("Fiat Toro");
			assertThat(resultado.getAnoFabricacao()).isEqualTo(2023);
			assertThat(resultado.getQuilometragem()).isEqualTo(15000L);
		}

		@Test
		void whenModeloNulo_thenNaoAlteraModelo() {
			Veiculo veiculo = veiculoComId(1L, "ABC1234", "Fiat Ducato", "ATIVO", 10000L);
			when(veiculoRepository.findById(1L)).thenReturn(Optional.of(veiculo));
			when(veiculoRepository.save(any(Veiculo.class))).thenAnswer(inv -> inv.getArgument(0));

			Veiculo resultado = veiculoService.atualizarVeiculo(1L, null, null, null);

			assertThat(resultado.getModelo()).isEqualTo("Fiat Ducato");
		}

		@Test
		void whenModeloVazio_thenNaoAlteraModelo() {
			Veiculo veiculo = veiculoComId(1L, "ABC1234", "Fiat Ducato", "ATIVO", 10000L);
			when(veiculoRepository.findById(1L)).thenReturn(Optional.of(veiculo));
			when(veiculoRepository.save(any(Veiculo.class))).thenAnswer(inv -> inv.getArgument(0));

			Veiculo resultado = veiculoService.atualizarVeiculo(1L, "", null, null);

			assertThat(resultado.getModelo()).isEqualTo("Fiat Ducato");
		}

		@Test
		void whenQuilometragemMenorQueAtual_thenAindaAtualizaComAviso() {
			Veiculo veiculo = veiculoComId(1L, "ABC1234", "Fiat Ducato", "ATIVO", 50000L);
			when(veiculoRepository.findById(1L)).thenReturn(Optional.of(veiculo));
			when(veiculoRepository.save(any(Veiculo.class))).thenAnswer(inv -> inv.getArgument(0));

			Veiculo resultado = veiculoService.atualizarVeiculo(1L, null, null, 1000L);

			assertThat(resultado.getQuilometragem()).isEqualTo(1000L);
		}

		@Test
		void whenVeiculoNaoEncontrado_thenThrowsResourceNotFoundException() {
			when(veiculoRepository.findById(99L)).thenReturn(Optional.empty());

			assertThatThrownBy(() -> veiculoService.atualizarVeiculo(99L, "Modelo", 2020, 0L))
				.isInstanceOf(ResourceNotFoundException.class);
		}
	}

	@Nested
	@DisplayName("atualizarQuilometragem")
	class AtualizarQuilometragem {

		@Test
		void whenQuilometragemValida_thenAtualiza() {
			Veiculo veiculo = veiculoComId(1L, "ABC1234", "Fiat Ducato", "ATIVO", 10000L);
			when(veiculoRepository.findById(1L)).thenReturn(Optional.of(veiculo));
			when(veiculoRepository.save(any(Veiculo.class))).thenAnswer(inv -> inv.getArgument(0));
			when(veiculoManutencaoService.precisaDeManutencao(any(Veiculo.class))).thenReturn(false);

			Veiculo resultado = veiculoService.atualizarQuilometragem(1L, 20000L);

			assertThat(resultado.getQuilometragem()).isEqualTo(20000L);
		}

		@Test
		void whenQuilometragemNegativa_thenThrowsVeiculoValidacaoException() {
			Veiculo veiculo = veiculoComId(1L, "ABC1234", "Fiat Ducato", "ATIVO", 10000L);
			when(veiculoRepository.findById(1L)).thenReturn(Optional.of(veiculo));

			assertThatThrownBy(() -> veiculoService.atualizarQuilometragem(1L, -1L))
				.isInstanceOf(VeiculoValidacaoException.class)
				.hasMessageContaining("negativa");
		}

		@Test
		void whenQuilometragemAtingeThresholdManutencao_thenEnviaNotificacao() {
			Veiculo veiculo = veiculoComId(1L, "ABC1234", "Fiat Ducato", "ATIVO", 49000L);
			when(veiculoRepository.findById(1L)).thenReturn(Optional.of(veiculo));
			when(veiculoRepository.save(any(Veiculo.class))).thenAnswer(inv -> inv.getArgument(0));
			when(veiculoManutencaoService.precisaDeManutencao(any(Veiculo.class))).thenReturn(true);

			veiculoService.atualizarQuilometragem(1L, 50000L);

			verify(veiculoNotificacaoService).notificarAlertaManutencao(anyString(), anyLong());
		}

		@Test
		void whenQuilometragemAbaixoDoThreshold_thenNaoEnviaNotificacao() {
			Veiculo veiculo = veiculoComId(1L, "ABC1234", "Fiat Ducato", "ATIVO", 0L);
			when(veiculoRepository.findById(1L)).thenReturn(Optional.of(veiculo));
			when(veiculoRepository.save(any(Veiculo.class))).thenAnswer(inv -> inv.getArgument(0));
			when(veiculoManutencaoService.precisaDeManutencao(any(Veiculo.class))).thenReturn(false);

			veiculoService.atualizarQuilometragem(1L, 49999L);

			verify(veiculoNotificacaoService, never()).notificarAlertaManutencao(anyString(), anyLong());
		}

		@Test
		void whenVeiculoNaoEncontrado_thenThrowsResourceNotFoundException() {
			when(veiculoRepository.findById(99L)).thenReturn(Optional.empty());

			assertThatThrownBy(() -> veiculoService.atualizarQuilometragem(99L, 10000L))
				.isInstanceOf(ResourceNotFoundException.class);
		}
	}

	@Nested
	@DisplayName("obterVeiculosPorStatus")
	class ObterVeiculosPorStatus {

		@Test
		void whenStatusAtivo_thenRetornaVeiculos() {
			List<Veiculo> ativos = List.of(veiculoComId(1L, "ABC1234", "Fiat Ducato", "ATIVO", 0L));
			when(veiculoRepository.findByStatus("ATIVO")).thenReturn(ativos);

			List<Veiculo> resultado = veiculoService.obterVeiculosPorStatus("ATIVO");

			assertThat(resultado).hasSize(1);
		}

		@Test
		void whenStatusInativo_thenRetornaVeiculos() {
			List<Veiculo> inativos = List.of(veiculoComId(2L, "XYZ5678", "Mercedes Sprinter", "INATIVO", 0L));
			when(veiculoRepository.findByStatus("INATIVO")).thenReturn(inativos);

			List<Veiculo> resultado = veiculoService.obterVeiculosPorStatus("INATIVO");

			assertThat(resultado).hasSize(1);
		}

		@Test
		void whenStatusManutencao_thenRetornaVeiculos() {
			List<Veiculo> manutencao = List.of(veiculoComId(3L, "DEF3456", "Renault Master", "MANUTENCAO", 0L));
			when(veiculoRepository.findByStatus("MANUTENCAO")).thenReturn(manutencao);

			List<Veiculo> resultado = veiculoService.obterVeiculosPorStatus("MANUTENCAO");

			assertThat(resultado).hasSize(1);
		}

		@Test
		void whenStatusInvalido_thenThrowsVeiculoStatusInvalidoException() {
			assertThatThrownBy(() -> veiculoService.obterVeiculosPorStatus("INVALIDO"))
				.isInstanceOf(VeiculoStatusInvalidoException.class)
				.hasMessageContaining("Status inválido");
		}
	}

	@Nested
	@DisplayName("agendarManutencaoPreventiva")
	class AgendarManutencaoPreventiva {

		@Test
		void whenVeiculoExiste_thenEnviaNotificacao() {
			Veiculo veiculo = veiculoComId(1L, "ABC1234", "Fiat Ducato", "ATIVO", 10000L);
			when(veiculoRepository.findById(1L)).thenReturn(Optional.of(veiculo));

			veiculoService.agendarManutencaoPreventiva(1L, 20000L);

			verify(veiculoNotificacaoService).notificarManutencaoAgendada(anyString(), anyLong());
		}

		@Test
		void whenVeiculoNaoEncontrado_thenThrowsResourceNotFoundException() {
			when(veiculoRepository.findById(99L)).thenReturn(Optional.empty());

			assertThatThrownBy(() -> veiculoService.agendarManutencaoPreventiva(99L, 20000L))
				.isInstanceOf(ResourceNotFoundException.class);
		}
	}

	@Nested
	@DisplayName("calcularCustoManutencao")
	class CalcularCustoManutencao {

		@Test
		void whenQuilometragemZero_thenRetornaCustoBase() {
			when(veiculoManutencaoService.calcularCustoManutencao(0L)).thenReturn(500.0);

			Double resultado = veiculoService.calcularCustoManutencao("Fiat Ducato", 0L);

			assertThat(resultado).isEqualTo(500.0);
		}

		@Test
		void whenQuilometragemPositiva_thenCalculaCorretamente() {
			when(veiculoManutencaoService.calcularCustoManutencao(10000L)).thenReturn(500.0 + 10000L * 0.05);

			Double resultado = veiculoService.calcularCustoManutencao("Fiat Ducato", 10000L);

			assertThat(resultado).isEqualTo(500.0 + 10000L * 0.05);
		}

		@Test
		void whenModelos_thenRetornaOMesmoCalculo() {
			when(veiculoManutencaoService.calcularCustoManutencao(5000L)).thenReturn(750.0);

			Double resultadoA = veiculoService.calcularCustoManutencao("Fiat Ducato", 5000L);
			Double resultadoB = veiculoService.calcularCustoManutencao("Mercedes Sprinter", 5000L);

			assertThat(resultadoA).isEqualTo(resultadoB);
		}
	}

	@Nested
	@DisplayName("precisaDeManutencao")
	class PrecisaDeManutencao {

		@Test
		void whenQuilometragemIgualAoLimite_thenRetornaTrue() {
			Veiculo veiculo = veiculoComId(1L, "ABC1234", "Fiat Ducato", "ATIVO", 50000L);
			when(veiculoRepository.findById(1L)).thenReturn(Optional.of(veiculo));
			when(veiculoManutencaoService.precisaDeManutencao(veiculo)).thenReturn(true);

			Boolean resultado = veiculoService.precisaDeManutencao(1L);

			assertThat(resultado).isTrue();
		}

		@Test
		void whenQuilometragemAcimaDoLimite_thenRetornaTrue() {
			Veiculo veiculo = veiculoComId(1L, "ABC1234", "Fiat Ducato", "ATIVO", 60000L);
			when(veiculoRepository.findById(1L)).thenReturn(Optional.of(veiculo));
			when(veiculoManutencaoService.precisaDeManutencao(veiculo)).thenReturn(true);

			Boolean resultado = veiculoService.precisaDeManutencao(1L);

			assertThat(resultado).isTrue();
		}

		@Test
		void whenQuilometragemAbaixoDoLimite_thenRetornaFalse() {
			Veiculo veiculo = veiculoComId(1L, "ABC1234", "Fiat Ducato", "ATIVO", 49999L);
			when(veiculoRepository.findById(1L)).thenReturn(Optional.of(veiculo));
			when(veiculoManutencaoService.precisaDeManutencao(veiculo)).thenReturn(false);

			Boolean resultado = veiculoService.precisaDeManutencao(1L);

			assertThat(resultado).isFalse();
		}

		@Test
		void whenQuilometragemNula_thenRetornaFalse() {
			Veiculo veiculo = veiculoComId(1L, "ABC1234", "Fiat Ducato", "ATIVO", null);
			when(veiculoRepository.findById(1L)).thenReturn(Optional.of(veiculo));
			when(veiculoManutencaoService.precisaDeManutencao(veiculo)).thenReturn(false);

			Boolean resultado = veiculoService.precisaDeManutencao(1L);

			assertThat(resultado).isFalse();
		}

		@Test
		void whenVeiculoNaoEncontrado_thenThrowsResourceNotFoundException() {
			when(veiculoRepository.findById(99L)).thenReturn(Optional.empty());

			assertThatThrownBy(() -> veiculoService.precisaDeManutencao(99L))
				.isInstanceOf(ResourceNotFoundException.class);
		}
	}

	@Nested
	@DisplayName("desativarVeiculo")
	class DesativarVeiculo {

		@Test
		void whenVeiculoExiste_thenDefineStatusInativo() {
			Veiculo veiculo = veiculoComId(1L, "ABC1234", "Fiat Ducato", "ATIVO", 10000L);
			when(veiculoRepository.findById(1L)).thenReturn(Optional.of(veiculo));
			when(veiculoRepository.save(any(Veiculo.class))).thenAnswer(inv -> inv.getArgument(0));

			Veiculo resultado = veiculoService.desativarVeiculo(1L);

			assertThat(resultado.getStatus()).isEqualTo("INATIVO");
		}

		@Test
		void whenVeiculoExiste_thenEnviaNotificacao() {
			Veiculo veiculo = veiculoComId(1L, "ABC1234", "Fiat Ducato", "ATIVO", 10000L);
			when(veiculoRepository.findById(1L)).thenReturn(Optional.of(veiculo));
			when(veiculoRepository.save(any(Veiculo.class))).thenAnswer(inv -> inv.getArgument(0));

			veiculoService.desativarVeiculo(1L);

			verify(veiculoNotificacaoService).notificarVeiculoDesativado(anyString());
		}

		@Test
		void whenVeiculoNaoEncontrado_thenThrowsResourceNotFoundException() {
			when(veiculoRepository.findById(99L)).thenReturn(Optional.empty());

			assertThatThrownBy(() -> veiculoService.desativarVeiculo(99L))
				.isInstanceOf(ResourceNotFoundException.class);
		}
	}

	@Nested
	@DisplayName("reativarVeiculo")
	class ReativarVeiculo {

		@Test
		void whenVeiculoExiste_thenDefineStatusAtivo() {
			Veiculo veiculo = veiculoComId(1L, "ABC1234", "Fiat Ducato", "INATIVO", 10000L);
			when(veiculoRepository.findById(1L)).thenReturn(Optional.of(veiculo));
			when(veiculoRepository.save(any(Veiculo.class))).thenAnswer(inv -> inv.getArgument(0));

			Veiculo resultado = veiculoService.reativarVeiculo(1L);

			assertThat(resultado.getStatus()).isEqualTo("ATIVO");
		}

		@Test
		void whenVeiculoNaoEncontrado_thenThrowsResourceNotFoundException() {
			when(veiculoRepository.findById(99L)).thenReturn(Optional.empty());

			assertThatThrownBy(() -> veiculoService.reativarVeiculo(99L))
				.isInstanceOf(ResourceNotFoundException.class);
		}
	}

	@Nested
	@DisplayName("obterEstatisticasFrota")
	class ObterEstatisticasFrota {

		@Test
		void whenRepositoryRetornaDados_thenRetornaEstatisticasCorretas() {
			when(veiculoRepository.count()).thenReturn(10L);
			when(veiculoRepository.countByStatus("ATIVO")).thenReturn(2L);
			when(veiculoRepository.countByStatus("INATIVO")).thenReturn(1L);
			when(veiculoRepository.countByStatus("MANUTENCAO")).thenReturn(0L);

			EstatisticasFrotaResponse resultado = veiculoService.obterEstatisticasFrota();

			assertThat(resultado.getTotal()).isEqualTo(10L);
			assertThat(resultado.getAtivos()).isEqualTo(2L);
			assertThat(resultado.getInativos()).isEqualTo(1L);
			assertThat(resultado.getEmManutencao()).isEqualTo(0L);
		}

		@Test
		void whenFrotaVazia_thenRetornaZeros() {
			when(veiculoRepository.count()).thenReturn(0L);
			when(veiculoRepository.countByStatus("ATIVO")).thenReturn(0L);
			when(veiculoRepository.countByStatus("INATIVO")).thenReturn(0L);
			when(veiculoRepository.countByStatus("MANUTENCAO")).thenReturn(0L);

			EstatisticasFrotaResponse resultado = veiculoService.obterEstatisticasFrota();

			assertThat(resultado.getTotal()).isZero();
			assertThat(resultado.getAtivos()).isZero();
			assertThat(resultado.getInativos()).isZero();
			assertThat(resultado.getEmManutencao()).isZero();
		}
	}

	@Nested
	@DisplayName("sincronizarComSistemaExterno")
	class SincronizarComSistemaExterno {

		@Test
		void whenChamado_thenNaoLancaExcecao() {
			veiculoService.sincronizarComSistemaExterno();
		}
	}
}
