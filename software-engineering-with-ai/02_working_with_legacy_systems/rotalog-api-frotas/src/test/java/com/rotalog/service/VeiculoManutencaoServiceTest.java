package com.rotalog.service;

import com.rotalog.domain.Veiculo;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

class VeiculoManutencaoServiceTest {

	private final VeiculoManutencaoService service = new VeiculoManutencaoService(50000L, 0.05, 500.0, 6);

	private Veiculo veiculoComQuilometragem(Long quilometragem) {
		Veiculo v = new Veiculo();
		v.setQuilometragem(quilometragem);
		return v;
	}

	@Nested
	@DisplayName("quilometragemExcedida")
	class QuilometragemExcedida {

		@Test
		void whenQuilometragemIgualAoLimite_thenRetornaTrue() {
			assertThat(service.quilometragemExcedida(veiculoComQuilometragem(50000L))).isTrue();
		}

		@Test
		void whenQuilometragemAcimaDoLimite_thenRetornaTrue() {
			assertThat(service.quilometragemExcedida(veiculoComQuilometragem(80000L))).isTrue();
		}

		@Test
		void whenQuilometragemAbaixoDoLimite_thenRetornaFalse() {
			assertThat(service.quilometragemExcedida(veiculoComQuilometragem(49999L))).isFalse();
		}

		@Test
		void whenQuilometragemNula_thenRetornaFalse() {
			assertThat(service.quilometragemExcedida(veiculoComQuilometragem(null))).isFalse();
		}
	}

	@Nested
	@DisplayName("prazoExcedido")
	class PrazoExcedido {

		@Test
		void whenDataNula_thenRetornaTrue() {
			assertThat(service.prazoExcedido(null)).isTrue();
		}

		@Test
		void whenUltimaManutencaoHaMaisDe6Meses_thenRetornaTrue() {
			LocalDateTime haSeteMeses = LocalDateTime.now().minusMonths(7);
			assertThat(service.prazoExcedido(haSeteMeses)).isTrue();
		}

		@Test
		void whenUltimaManutencaoExatamente6MesesAtras_thenRetornaTrue() {
			LocalDateTime exatos6Meses = LocalDateTime.now().minusMonths(6).minusDays(1);
			assertThat(service.prazoExcedido(exatos6Meses)).isTrue();
		}

		@Test
		void whenUltimaManutencaoHaMenosDe6Meses_thenRetornaFalse() {
			LocalDateTime haTresMeses = LocalDateTime.now().minusMonths(3);
			assertThat(service.prazoExcedido(haTresMeses)).isFalse();
		}

		@Test
		void whenUltimaManutencaoRecente_thenRetornaFalse() {
			LocalDateTime ontem = LocalDateTime.now().minusDays(1);
			assertThat(service.prazoExcedido(ontem)).isFalse();
		}
	}

	@Nested
	@DisplayName("calcularCustoManutencao")
	class CalcularCustoManutencao {

		@Test
		void whenQuilometragemZero_thenRetornaCustoBase() {
			assertThat(service.calcularCustoManutencao(0L)).isEqualTo(500.0);
		}

		@Test
		void whenQuilometragem10000_thenRetornaCalculoCorreto() {
			assertThat(service.calcularCustoManutencao(10000L)).isEqualTo(1000.0);
		}

		@Test
		void whenQuilometragem50000_thenRetornaCalculoCorreto() {
			assertThat(service.calcularCustoManutencao(50000L)).isEqualTo(3000.0);
		}
	}

	@Nested
	@DisplayName("getLimiteQuilometragem")
	class GetLimiteQuilometragem {

		@Test
		void whenConfiguradoCom50000_thenRetorna50000() {
			assertThat(service.getLimiteQuilometragem()).isEqualTo(50000L);
		}
	}

	@Nested
	@DisplayName("getLimiteMeses")
	class GetLimiteMeses {

		@Test
		void whenConfiguradoCom6_thenRetorna6() {
			assertThat(service.getLimiteMeses()).isEqualTo(6);
		}
	}
}
