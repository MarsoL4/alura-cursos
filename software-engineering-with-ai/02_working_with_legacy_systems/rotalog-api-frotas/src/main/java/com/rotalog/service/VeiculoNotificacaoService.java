package com.rotalog.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class VeiculoNotificacaoService {

	private static final String DESTINATARIO_GESTOR = "gestor@rotalog.com";

	private final NotificacaoClient notificacaoClient;

	public VeiculoNotificacaoService(NotificacaoClient notificacaoClient) {
		this.notificacaoClient = notificacaoClient;
	}

	public void notificarNovoVeiculo(String placa, String modelo) {
		try {
			notificacaoClient.enviarNotificacao(
				"NOVO_VEICULO",
				DESTINATARIO_GESTOR,
				"Novo veículo cadastrado: " + placa + " - " + modelo
			);
		} catch (Exception e) {
			log.error("Erro ao enviar notificação de novo veículo: {}", e.getMessage());
		}
	}

	public void notificarAlertaManutencao(String placa, Long quilometragem) {
		try {
			notificacaoClient.enviarNotificacao(
				"ALERTA_MANUTENCAO",
				DESTINATARIO_GESTOR,
				"Veículo " + placa + " atingiu " + quilometragem + " km. Agendar manutenção preventiva."
			);
		} catch (Exception e) {
			log.error("Falha ao enviar alerta de manutenção: {}", e.getMessage());
		}
	}

	public void notificarManutencaoAgendada(String placa, Long quilometragemLimite) {
		try {
			notificacaoClient.enviarNotificacao(
				"MANUTENCAO_AGENDADA",
				DESTINATARIO_GESTOR,
				"Manutenção preventiva agendada para veículo " + placa + " em " + quilometragemLimite + " km"
			);
		} catch (Exception e) {
			log.error("Falha ao notificar agendamento de manutenção: {}", e.getMessage());
		}
	}

	public void notificarVeiculoDesativado(String placa) {
		try {
			notificacaoClient.enviarNotificacao(
				"VEICULO_DESATIVADO",
				DESTINATARIO_GESTOR,
				"Veículo " + placa + " foi desativado"
			);
		} catch (Exception e) {
			log.error("Falha ao notificar desativação: {}", e.getMessage());
		}
	}
}
