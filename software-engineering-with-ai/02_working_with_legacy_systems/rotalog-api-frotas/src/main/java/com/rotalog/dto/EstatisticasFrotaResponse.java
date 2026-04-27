package com.rotalog.dto;

public class EstatisticasFrotaResponse {

	private final long total;
	private final long ativos;
	private final long inativos;
	private final long emManutencao;

	public EstatisticasFrotaResponse(long total, long ativos, long inativos, long emManutencao) {
		this.total = total;
		this.ativos = ativos;
		this.inativos = inativos;
		this.emManutencao = emManutencao;
	}

	public long getTotal() {
		return total;
	}

	public long getAtivos() {
		return ativos;
	}

	public long getInativos() {
		return inativos;
	}

	public long getEmManutencao() {
		return emManutencao;
	}
}
