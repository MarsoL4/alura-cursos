-- RotaLog - Alertas de Manutenção Preventiva

CREATE TABLE IF NOT EXISTS alertas_manutencao (
    id BIGSERIAL PRIMARY KEY,
    veiculo_id BIGINT NOT NULL,
    placa VARCHAR(7) NOT NULL,
    modelo VARCHAR(100),
    quilometragem_atual BIGINT,
    motivo_alerta VARCHAR(30) NOT NULL,
    status_notificacao VARCHAR(20) NOT NULL DEFAULT 'PENDENTE',
    erro_mensagem TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
