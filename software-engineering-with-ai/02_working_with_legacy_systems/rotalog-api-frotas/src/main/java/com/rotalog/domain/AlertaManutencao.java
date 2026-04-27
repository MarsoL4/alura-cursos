package com.rotalog.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "alertas_manutencao")
@Getter
@Setter
@NoArgsConstructor
public class AlertaManutencao {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "veiculo_id", nullable = false)
	private Long veiculoId;

	@Column(name = "placa", nullable = false)
	private String placa;

	@Column(name = "modelo")
	private String modelo;

	@Column(name = "quilometragem_atual")
	private Long quilometragemAtual;

	@Column(name = "motivo_alerta", nullable = false)
	private String motivoAlerta; // QUILOMETRAGEM_EXCEDIDA, PRAZO_EXCEDIDO

	@Column(name = "status_notificacao", nullable = false)
	private String statusNotificacao; // PENDENTE, ENVIADO, FALHA

	@Column(name = "erro_mensagem")
	private String erroMensagem;

	@Column(name = "data_criacao")
	private LocalDateTime dataCriacao;

	@Column(name = "data_atualizacao")
	private LocalDateTime dataAtualizacao;
}
