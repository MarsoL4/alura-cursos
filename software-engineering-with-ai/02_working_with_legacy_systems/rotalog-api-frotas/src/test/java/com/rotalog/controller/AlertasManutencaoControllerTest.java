package com.rotalog.controller;

import com.rotalog.domain.AlertaManutencao;
import com.rotalog.service.AlertaManutencaoService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AlertasManutencaoControllerTest {

	@Mock
	private AlertaManutencaoService alertaManutencaoService;

	@InjectMocks
	private AlertasManutencaoController controller;

	private AlertaManutencao alerta(Long id, String placa, String motivo, String status) {
		AlertaManutencao a = new AlertaManutencao();
		a.setId(id);
		a.setVeiculoId(1L);
		a.setPlaca(placa);
		a.setModelo("Modelo Teste");
		a.setQuilometragemAtual(60000L);
		a.setMotivoAlerta(motivo);
		a.setStatusNotificacao(status);
		a.setDataCriacao(LocalDateTime.now());
		a.setDataAtualizacao(LocalDateTime.now());
		return a;
	}

	@Nested
	@DisplayName("GET /alertas-manutencao")
	class Listar {

		@Test
		void whenSemFiltro_thenRetornaTodosOsAlertas() {
			List<AlertaManutencao> alertas = List.of(
				alerta(1L, "ABC1D23", "QUILOMETRAGEM_EXCEDIDA", "ENVIADO"),
				alerta(2L, "DEF4G56", "PRAZO_EXCEDIDO", "PENDENTE")
			);
			when(alertaManutencaoService.listarPorStatus(null)).thenReturn(alertas);

			ResponseEntity<List<AlertaManutencao>> response = controller.listar(null);

			assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
			assertThat(response.getBody()).hasSize(2);
			verify(alertaManutencaoService).listarPorStatus(null);
		}

		@Test
		void whenFiltrandoPorStatusPendente_thenRetornaApenasPendentes() {
			List<AlertaManutencao> pendentes = List.of(
				alerta(2L, "DEF4G56", "PRAZO_EXCEDIDO", "PENDENTE")
			);
			when(alertaManutencaoService.listarPorStatus("PENDENTE")).thenReturn(pendentes);

			ResponseEntity<List<AlertaManutencao>> response = controller.listar("PENDENTE");

			List<AlertaManutencao> body = response.getBody();
			assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
			assertThat(body).isNotNull().hasSize(1);
			assertThat(body.get(0).getStatusNotificacao()).isEqualTo("PENDENTE");
			verify(alertaManutencaoService).listarPorStatus("PENDENTE");
		}

		@Test
		void whenFiltrandoPorStatusEnviado_thenRetornaApenasEnviados() {
			List<AlertaManutencao> enviados = List.of(
				alerta(1L, "ABC1D23", "QUILOMETRAGEM_EXCEDIDA", "ENVIADO")
			);
			when(alertaManutencaoService.listarPorStatus("ENVIADO")).thenReturn(enviados);

			ResponseEntity<List<AlertaManutencao>> response = controller.listar("ENVIADO");

			List<AlertaManutencao> body = response.getBody();
			assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
			assertThat(body).isNotNull().hasSize(1);
			assertThat(body.get(0).getStatusNotificacao()).isEqualTo("ENVIADO");
		}

		@Test
		void whenFiltrandoPorStatusFalha_thenRetornaApenasFalhas() {
			List<AlertaManutencao> falhas = List.of(
				alerta(3L, "VWX9Y01", "QUILOMETRAGEM_EXCEDIDA", "FALHA")
			);
			when(alertaManutencaoService.listarPorStatus("FALHA")).thenReturn(falhas);

			ResponseEntity<List<AlertaManutencao>> response = controller.listar("FALHA");

			List<AlertaManutencao> body = response.getBody();
			assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
			assertThat(body).isNotNull().hasSize(1);
			assertThat(body.get(0).getStatusNotificacao()).isEqualTo("FALHA");
		}

		@Test
		void whenSemAlertasCadastrados_thenRetornaListaVazia() {
			when(alertaManutencaoService.listarPorStatus(null)).thenReturn(List.of());

			ResponseEntity<List<AlertaManutencao>> response = controller.listar(null);

			assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
			assertThat(response.getBody()).isEmpty();
		}

		@Test
		void whenBodyContemDadosCorretos_thenRetornaAtributosEsperados() {
			AlertaManutencao alerta = alerta(1L, "ABC1D23", "QUILOMETRAGEM_EXCEDIDA", "ENVIADO");
			when(alertaManutencaoService.listarPorStatus(null)).thenReturn(List.of(alerta));

			ResponseEntity<List<AlertaManutencao>> response = controller.listar(null);

			List<AlertaManutencao> responseBody = response.getBody();
			assertThat(responseBody).isNotNull();
			AlertaManutencao body = responseBody.get(0);
			assertThat(body.getId()).isEqualTo(1L);
			assertThat(body.getPlaca()).isEqualTo("ABC1D23");
			assertThat(body.getMotivoAlerta()).isEqualTo("QUILOMETRAGEM_EXCEDIDA");
		}
	}

	@Nested
	@DisplayName("POST /alertas-manutencao/verificar")
	class Verificar {

		@Test
		void whenChamado_thenRetorna200() {
			ResponseEntity<Void> response = controller.verificar();

			assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
		}

		@Test
		void whenChamado_thenExecutaVerificacaoEProcessamento() {
			controller.verificar();

			verify(alertaManutencaoService).verificarEGerarAlertas();
			verify(alertaManutencaoService).processarAlertas();
		}
	}
}
