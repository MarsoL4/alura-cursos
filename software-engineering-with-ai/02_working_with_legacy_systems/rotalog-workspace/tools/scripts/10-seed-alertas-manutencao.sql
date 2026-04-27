-- RotaLog - Seed: alertas de manutenção preventiva
-- Popula veículos elegíveis para manutenção preventiva (referência: 2026-04-04)
-- Critérios: quilometragem >= 50.000 km OU última manutenção concluída há > 6 meses
-- Executar após o script 09

SET search_path TO frotas;

-- DEF4G56 - VW Delivery 9.170 - 120.000 km (limite: 50.000 km)
INSERT INTO alertas_manutencao (veiculo_id, placa, modelo, quilometragem_atual, motivo_alerta, status_notificacao, data_criacao, data_atualizacao)
SELECT v.id, 'DEF4G56', 'VW Delivery 9.170', 120000, 'QUILOMETRAGEM_EXCEDIDA', 'PENDENTE', NOW(), NOW()
FROM veiculos v WHERE v.placa = 'DEF4G56' AND NOT EXISTS (
    SELECT 1 FROM alertas_manutencao a WHERE a.placa = 'DEF4G56' AND a.status_notificacao = 'PENDENTE'
);

-- VWX9Y01 - VW Constellation 17.280 - 95.000 km (limite: 50.000 km)
INSERT INTO alertas_manutencao (veiculo_id, placa, modelo, quilometragem_atual, motivo_alerta, status_notificacao, data_criacao, data_atualizacao)
SELECT v.id, 'VWX9Y01', 'VW Constellation 17.280', 95000, 'QUILOMETRAGEM_EXCEDIDA', 'PENDENTE', NOW(), NOW()
FROM veiculos v WHERE v.placa = 'VWX9Y01' AND NOT EXISTS (
    SELECT 1 FROM alertas_manutencao a WHERE a.placa = 'VWX9Y01' AND a.status_notificacao = 'PENDENTE'
);

-- BCD2E34 - Scania R450 - 78.000 km (limite: 50.000 km)
INSERT INTO alertas_manutencao (veiculo_id, placa, modelo, quilometragem_atual, motivo_alerta, status_notificacao, data_criacao, data_atualizacao)
SELECT v.id, 'BCD2E34', 'Scania R450', 78000, 'QUILOMETRAGEM_EXCEDIDA', 'PENDENTE', NOW(), NOW()
FROM veiculos v WHERE v.placa = 'BCD2E34' AND NOT EXISTS (
    SELECT 1 FROM alertas_manutencao a WHERE a.placa = 'BCD2E34' AND a.status_notificacao = 'PENDENTE'
);

-- FGH5I67 - Volvo FH 540 - 150.000 km (limite: 50.000 km)
INSERT INTO alertas_manutencao (veiculo_id, placa, modelo, quilometragem_atual, motivo_alerta, status_notificacao, data_criacao, data_atualizacao)
SELECT v.id, 'FGH5I67', 'Volvo FH 540', 150000, 'QUILOMETRAGEM_EXCEDIDA', 'PENDENTE', NOW(), NOW()
FROM veiculos v WHERE v.placa = 'FGH5I67' AND NOT EXISTS (
    SELECT 1 FROM alertas_manutencao a WHERE a.placa = 'FGH5I67' AND a.status_notificacao = 'PENDENTE'
);

-- ABC1D23 - Fiat Fiorino - última manutenção concluída em 2024-01-15 (> 6 meses sem revisão)
INSERT INTO alertas_manutencao (veiculo_id, placa, modelo, quilometragem_atual, motivo_alerta, status_notificacao, data_criacao, data_atualizacao)
SELECT v.id, 'ABC1D23', 'Fiat Fiorino', 45000, 'PRAZO_EXCEDIDO', 'PENDENTE', NOW(), NOW()
FROM veiculos v WHERE v.placa = 'ABC1D23' AND NOT EXISTS (
    SELECT 1 FROM alertas_manutencao a WHERE a.placa = 'ABC1D23' AND a.status_notificacao = 'PENDENTE'
);

-- GHI7J89 - Mercedes Sprinter - última manutenção concluída em 2024-02-28 (> 6 meses sem revisão)
INSERT INTO alertas_manutencao (veiculo_id, placa, modelo, quilometragem_atual, motivo_alerta, status_notificacao, data_criacao, data_atualizacao)
SELECT v.id, 'GHI7J89', 'Mercedes Sprinter', 32000, 'PRAZO_EXCEDIDO', 'PENDENTE', NOW(), NOW()
FROM veiculos v WHERE v.placa = 'GHI7J89' AND NOT EXISTS (
    SELECT 1 FROM alertas_manutencao a WHERE a.placa = 'GHI7J89' AND a.status_notificacao = 'PENDENTE'
);

-- JKL8M90 - Mercedes Actros 2651 - 42.000 km, sem manutenção concluída registrada
INSERT INTO alertas_manutencao (veiculo_id, placa, modelo, quilometragem_atual, motivo_alerta, status_notificacao, data_criacao, data_atualizacao)
SELECT v.id, 'JKL8M90', 'Mercedes Actros 2651', 42000, 'PRAZO_EXCEDIDO', 'PENDENTE', NOW(), NOW()
FROM veiculos v WHERE v.placa = 'JKL8M90' AND NOT EXISTS (
    SELECT 1 FROM alertas_manutencao a WHERE a.placa = 'JKL8M90' AND a.status_notificacao = 'PENDENTE'
);

-- NOP3Q45 - Renault Master - 15.000 km, sem manutenção concluída registrada
INSERT INTO alertas_manutencao (veiculo_id, placa, modelo, quilometragem_atual, motivo_alerta, status_notificacao, data_criacao, data_atualizacao)
SELECT v.id, 'NOP3Q45', 'Renault Master', 15000, 'PRAZO_EXCEDIDO', 'PENDENTE', NOW(), NOW()
FROM veiculos v WHERE v.placa = 'NOP3Q45' AND NOT EXISTS (
    SELECT 1 FROM alertas_manutencao a WHERE a.placa = 'NOP3Q45' AND a.status_notificacao = 'PENDENTE'
);

-- Verificação
SELECT a.id, a.placa, a.modelo, a.quilometragem_atual, a.motivo_alerta, a.status_notificacao, a.data_criacao
FROM alertas_manutencao a
ORDER BY a.motivo_alerta, a.quilometragem_atual DESC;
