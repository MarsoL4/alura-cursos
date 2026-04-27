package com.rotalog.dto;

public class AlertaManutencaoResponse {

	private Long veiculoId;
	private String placa;
	private String modelo;
	private Long quilometragemAtual;
	private Long quilometragemLimite;
	private Long quilometragemExcedida;

	public AlertaManutencaoResponse(
		Long veiculoId,
		String placa,
		String modelo,
		Long quilometragemAtual,
		Long quilometragemLimite,
		Long quilometragemExcedida
	) {
		this.veiculoId = veiculoId;
		this.placa = placa;
		this.modelo = modelo;
		this.quilometragemAtual = quilometragemAtual;
		this.quilometragemLimite = quilometragemLimite;
		this.quilometragemExcedida = quilometragemExcedida;
	}

	public Long getVeiculoId() { return veiculoId; }
	public String getPlaca() { return placa; }
	public String getModelo() { return modelo; }
	public Long getQuilometragemAtual() { return quilometragemAtual; }
	public Long getQuilometragemLimite() { return quilometragemLimite; }
	public Long getQuilometragemExcedida() { return quilometragemExcedida; }
}
