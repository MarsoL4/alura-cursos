package com.rotalog.service;

import com.rotalog.domain.AlertaManutencao;
import com.rotalog.domain.Veiculo;
import com.rotalog.repository.AlertaManutencaoRepository;
import com.rotalog.repository.ManutencaoRepository;
import com.rotalog.repository.VeiculoRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@SuppressWarnings("null")
class AlertaManutencaoServiceTest {

	@Mock
	private VeiculoRepository veiculoRepository;

	@Mock
	private ManutencaoRepository manutencaoRepository;

	@Mock
	private AlertaManutencaoRepository alertaRepository;

	@Mock
	private VeiculoManutencaoService veiculoManutencaoService;

	@Mock
	private NotificacaoClient notificacaoClient;

	@InjectMocks
	private AlertaManutencaoService alertaManutencaoService;

	@Captor
	private ArgumentCaptor<AlertaManutencao> alertaCaptor;

	@Captor
	private ArgumentCaptor<String> mensagemCaptor;

	private Veiculo veiculo(Long id, String placa, String modelo, Long quilometragem) {
		Veiculo v = new Veiculo();
		v.setId(id);
		v.setPlaca(placa);
		v.setModelo(modelo);
		v.setQuilometragem(quilometragem);
		v.setStatus("ATIVO");
		return v;
	}

	private AlertaManutencao alertaPendente(Long veiculoId, String placa, String motivo) {
		AlertaManutencao a = new AlertaManutencao();
		a.setId(1L);
		a.setVeiculoId(veiculoId);
		a.setPlaca(placa);
		a.setModelo("Modelo Teste");
		a.setQuilometragemAtual(60000L);
		a.setMotivoAlerta(motivo);
		a.setStatusNotificacao("PENDENTE");
		a.setDataCriacao(LocalDateTime.now());
		a.setDataAtualizacao(LocalDateTime.now());
		return a;
	}

	@Nested
	@DisplayName("verificarEGerarAlertas")
	class VerificarEGerarAlertas {

		@Test
		void whenVeiculoComQuilometragemExcedida_thenGeraAlertaComMotivoCorreto() {
			Veiculo v = veiculo(1L, "ABC1D23", "Fiat Fiorino", 60000L);
			when(veiculoRepository.findByStatus("ATIVO")).thenReturn(List.of(v));
			when(alertaRepository.existsByVeiculoIdAndStatusNotificacao(1L, "PENDENTE")).thenReturn(false);
			when(veiculoManutencaoService.quilometragemExcedida(v)).thenReturn(true);

			alertaManutencaoService.verificarEGerarAlertas();

			verify(alertaRepository).save(alertaCaptor.capture());
			assertThat(alertaCaptor.getValue().getMotivoAlerta()).isEqualTo("QUILOMETRAGEM_EXCEDIDA");
			assertThat(alertaCaptor.getValue().getStatusNotificacao()).isEqualTo("PENDENTE");
			assertThat(alertaCaptor.getValue().getPlaca()).isEqualTo("ABC1D23");
		}

		@Test
		void whenVeiculoComPrazoExcedido_thenGeraAlertaComMotivoCorreto() {
			Veiculo v = veiculo(2L, "GHI7J89", "Mercedes Sprinter", 32000L);
			LocalDateTime haSeteMeses = LocalDateTime.now().minusMonths(7);
			when(veiculoRepository.findByStatus("ATIVO")).thenReturn(List.of(v));
			when(alertaRepository.existsByVeiculoIdAndStatusNotificacao(2L, "PENDENTE")).thenReturn(false);
			when(veiculoManutencaoService.quilometragemExcedida(v)).thenReturn(false);
			when(manutencaoRepository.findDataUltimaManutencaoConcluida(2L)).thenReturn(haSeteMeses);
			when(veiculoManutencaoService.prazoExcedido(haSeteMeses)).thenReturn(true);

			alertaManutencaoService.verificarEGerarAlertas();

			verify(alertaRepository).save(alertaCaptor.capture());
			assertThat(alertaCaptor.getValue().getMotivoAlerta()).isEqualTo("PRAZO_EXCEDIDO");
		}

		@Test
		void whenVeiculoSemManutencaoConcluida_thenGeraAlertaPorPrazo() {
			Veiculo v = veiculo(3L, "NOP3Q45", "Renault Master", 15000L);
			when(veiculoRepository.findByStatus("ATIVO")).thenReturn(List.of(v));
			when(alertaRepository.existsByVeiculoIdAndStatusNotificacao(3L, "PENDENTE")).thenReturn(false);
			when(veiculoManutencaoService.quilometragemExcedida(v)).thenReturn(false);
			when(manutencaoRepository.findDataUltimaManutencaoConcluida(3L)).thenReturn(null);
			when(veiculoManutencaoService.prazoExcedido(null)).thenReturn(true);

			alertaManutencaoService.verificarEGerarAlertas();

			verify(alertaRepository).save(any(AlertaManutencao.class));
		}

		@Test
		void whenVeiculoJaPossuiAlertaPendente_thenNaoGeraNovoAlerta() {
			Veiculo v = veiculo(1L, "ABC1D23", "Fiat Fiorino", 60000L);
			when(veiculoRepository.findByStatus("ATIVO")).thenReturn(List.of(v));
			when(alertaRepository.existsByVeiculoIdAndStatusNotificacao(1L, "PENDENTE")).thenReturn(true);

			alertaManutencaoService.verificarEGerarAlertas();

			verify(alertaRepository, never()).save(any());
		}

		@Test
		void whenVeiculoDentroDoLimite_thenNaoGeraAlerta() {
			Veiculo v = veiculo(5L, "JKL8M90", "Mercedes Actros", 42000L);
			LocalDateTime haTresMeses = LocalDateTime.now().minusMonths(3);
			when(veiculoRepository.findByStatus("ATIVO")).thenReturn(List.of(v));
			when(alertaRepository.existsByVeiculoIdAndStatusNotificacao(5L, "PENDENTE")).thenReturn(false);
			when(veiculoManutencaoService.quilometragemExcedida(v)).thenReturn(false);
			when(manutencaoRepository.findDataUltimaManutencaoConcluida(5L)).thenReturn(haTresMeses);
			when(veiculoManutencaoService.prazoExcedido(haTresMeses)).thenReturn(false);

			alertaManutencaoService.verificarEGerarAlertas();

			verify(alertaRepository, never()).save(any());
		}

		@Test
		void whenSemVeiculosAtivos_thenNaoGeraAlertas() {
			when(veiculoRepository.findByStatus("ATIVO")).thenReturn(List.of());

			alertaManutencaoService.verificarEGerarAlertas();

			verify(alertaRepository, never()).save(any());
		}

		@Test
		void whenMultiplosVeiculosElegiveis_thenGeraAlertaParaCadaUm() {
			Veiculo v1 = veiculo(1L, "ABC1D23", "Fiat Fiorino", 60000L);
			Veiculo v2 = veiculo(2L, "DEF4G56", "VW Delivery", 120000L);
			when(veiculoRepository.findByStatus("ATIVO")).thenReturn(List.of(v1, v2));
			when(alertaRepository.existsByVeiculoIdAndStatusNotificacao(any(), anyString())).thenReturn(false);
			when(veiculoManutencaoService.quilometragemExcedida(any())).thenReturn(true);

			alertaManutencaoService.verificarEGerarAlertas();

			verify(alertaRepository, times(2)).save(any(AlertaManutencao.class));
		}
	}

	@Nested
	@DisplayName("processarAlertas")
	class ProcessarAlertas {

		@Test
		void whenNotificacaoEnviada_thenAtualizaStatusParaEnviado() {
			AlertaManutencao alerta = alertaPendente(1L, "ABC1D23", "QUILOMETRAGEM_EXCEDIDA");
			when(alertaRepository.findByStatusNotificacao("PENDENTE")).thenReturn(List.of(alerta));
			when(notificacaoClient.enviarNotificacao(anyString(), anyString(), anyString())).thenReturn("ENVIADO");
			when(veiculoManutencaoService.getLimiteQuilometragem()).thenReturn(50000L);

			alertaManutencaoService.processarAlertas();

			verify(alertaRepository).save(alertaCaptor.capture());
			assertThat(alertaCaptor.getValue().getStatusNotificacao()).isEqualTo("ENVIADO");
			assertThat(alertaCaptor.getValue().getErroMensagem()).isNull();
		}

		@Test
		void whenNotificacoesFora_thenAtualizaStatusParaFalha() {
			AlertaManutencao alerta = alertaPendente(1L, "ABC1D23", "QUILOMETRAGEM_EXCEDIDA");
			when(alertaRepository.findByStatusNotificacao("PENDENTE")).thenReturn(List.of(alerta));
			when(notificacaoClient.enviarNotificacao(anyString(), anyString(), anyString())).thenReturn("FALHA");
			when(veiculoManutencaoService.getLimiteQuilometragem()).thenReturn(50000L);

			alertaManutencaoService.processarAlertas();

			verify(alertaRepository).save(alertaCaptor.capture());
			assertThat(alertaCaptor.getValue().getStatusNotificacao()).isEqualTo("FALHA");
			assertThat(alertaCaptor.getValue().getErroMensagem()).isNotBlank();
		}

		@Test
		void whenAlertaPorPrazoExcedido_thenEnviaMensagemCorreta() {
			AlertaManutencao alerta = alertaPendente(2L, "GHI7J89", "PRAZO_EXCEDIDO");
			when(alertaRepository.findByStatusNotificacao("PENDENTE")).thenReturn(List.of(alerta));
			when(notificacaoClient.enviarNotificacao(anyString(), anyString(), anyString())).thenReturn("ENVIADO");
			when(veiculoManutencaoService.getLimiteMeses()).thenReturn(6);

			alertaManutencaoService.processarAlertas();

			verify(notificacaoClient).enviarNotificacao(anyString(), anyString(), mensagemCaptor.capture());
			assertThat(mensagemCaptor.getValue()).contains("GHI7J89").contains("meses");
		}

		@Test
		void whenAlertaPorQuilometragem_thenEnviaMensagemComKm() {
			AlertaManutencao alerta = alertaPendente(1L, "ABC1D23", "QUILOMETRAGEM_EXCEDIDA");
			when(alertaRepository.findByStatusNotificacao("PENDENTE")).thenReturn(List.of(alerta));
			when(notificacaoClient.enviarNotificacao(anyString(), anyString(), anyString())).thenReturn("ENVIADO");
			when(veiculoManutencaoService.getLimiteQuilometragem()).thenReturn(50000L);

			alertaManutencaoService.processarAlertas();

			verify(notificacaoClient).enviarNotificacao(anyString(), anyString(), mensagemCaptor.capture());
			assertThat(mensagemCaptor.getValue()).contains("ABC1D23").contains("km");
		}

		@Test
		void whenSemAlertas_thenNaoInterageComNotificacaoClient() {
			when(alertaRepository.findByStatusNotificacao("PENDENTE")).thenReturn(List.of());

			alertaManutencaoService.processarAlertas();

			verify(notificacaoClient, never()).enviarNotificacao(anyString(), anyString(), anyString());
		}

		@Test
		void whenMultiplosAlertas_thenProcessaTodos() {
			AlertaManutencao a1 = alertaPendente(1L, "ABC1D23", "QUILOMETRAGEM_EXCEDIDA");
			AlertaManutencao a2 = alertaPendente(2L, "DEF4G56", "QUILOMETRAGEM_EXCEDIDA");
			when(alertaRepository.findByStatusNotificacao("PENDENTE")).thenReturn(List.of(a1, a2));
			when(notificacaoClient.enviarNotificacao(anyString(), anyString(), anyString())).thenReturn("ENVIADO");
			when(veiculoManutencaoService.getLimiteQuilometragem()).thenReturn(50000L);

			alertaManutencaoService.processarAlertas();

			verify(notificacaoClient, times(2)).enviarNotificacao(anyString(), anyString(), anyString());
			verify(alertaRepository, times(2)).save(any(AlertaManutencao.class));
		}
	}

	@Nested
	@DisplayName("listarPorStatus")
	class ListarPorStatus {

		@Test
		void whenStatusFornecido_thenFiltrarPorStatus() {
			AlertaManutencao alerta = alertaPendente(1L, "ABC1D23", "QUILOMETRAGEM_EXCEDIDA");
			when(alertaRepository.findByStatusNotificacao("PENDENTE")).thenReturn(List.of(alerta));

			List<AlertaManutencao> resultado = alertaManutencaoService.listarPorStatus("PENDENTE");

			assertThat(resultado).hasSize(1);
			verify(alertaRepository).findByStatusNotificacao("PENDENTE");
		}

		@Test
		void whenStatusNulo_thenRetornaTodos() {
			AlertaManutencao a1 = alertaPendente(1L, "ABC1D23", "QUILOMETRAGEM_EXCEDIDA");
			AlertaManutencao a2 = alertaPendente(2L, "DEF4G56", "PRAZO_EXCEDIDO");
			a2.setStatusNotificacao("ENVIADO");
			when(alertaRepository.findAll()).thenReturn(List.of(a1, a2));

			List<AlertaManutencao> resultado = alertaManutencaoService.listarPorStatus(null);

			assertThat(resultado).hasSize(2);
			verify(alertaRepository).findAll();
		}

		@Test
		void whenStatusVazio_thenRetornaTodos() {
			when(alertaRepository.findAll()).thenReturn(List.of());

			List<AlertaManutencao> resultado = alertaManutencaoService.listarPorStatus("  ");

			verify(alertaRepository).findAll();
			assertThat(resultado).isEmpty();
		}

		@Test
		void whenStatusEmMinusculo_thenNormaliza() {
			when(alertaRepository.findByStatusNotificacao("ENVIADO")).thenReturn(List.of());

			alertaManutencaoService.listarPorStatus("enviado");

			verify(alertaRepository).findByStatusNotificacao("ENVIADO");
		}
	}
}
