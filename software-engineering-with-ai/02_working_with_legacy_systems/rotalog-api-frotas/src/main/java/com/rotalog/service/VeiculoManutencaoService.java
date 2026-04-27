package com.rotalog.service;

import com.rotalog.domain.Veiculo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class VeiculoManutencaoService {

	private final long limiteQuilometragem;
	private final double custoPorKm;
	private final double custoBase;
	private final int limiteMeses;

	public VeiculoManutencaoService(
		@Value("${veiculo.manutencao.limite-quilometragem:50000}") long limiteQuilometragem,
		@Value("${veiculo.manutencao.custo-por-km:0.05}") double custoPorKm,
		@Value("${veiculo.manutencao.custo-base:500.0}") double custoBase,
		@Value("${veiculo.manutencao.limite-meses:6}") int limiteMeses
	) {
		this.limiteQuilometragem = limiteQuilometragem;
		this.custoPorKm = custoPorKm;
		this.custoBase = custoBase;
		this.limiteMeses = limiteMeses;
	}

	public boolean quilometragemExcedida(Veiculo veiculo) {
		return veiculo.getQuilometragem() != null && veiculo.getQuilometragem() >= limiteQuilometragem;
	}

	public boolean prazoExcedido(LocalDateTime dataUltimaManutencao) {
		if (dataUltimaManutencao == null) {
			return true;
		}
		return dataUltimaManutencao.isBefore(LocalDateTime.now().minusMonths(limiteMeses));
	}

	public boolean precisaDeManutencao(Veiculo veiculo) {
		return quilometragemExcedida(veiculo);
	}

	public void agendarManutencaoPreventiva(Veiculo veiculo, Long quilometragemLimite) {
	}

	public Double calcularCustoManutencao(Long quilometragem) {
		return custoBase + (quilometragem * custoPorKm);
	}

	public long getLimiteQuilometragem() {
		return limiteQuilometragem;
	}

	public int getLimiteMeses() {
		return limiteMeses;
	}
}
