package com.rotalog.model;

public enum VeiculoStatus {
	ATIVO,
	INATIVO,
	MANUTENCAO;

	public static VeiculoStatus fromString(String value) {
		for (VeiculoStatus status : values()) {
			if (status.name().equalsIgnoreCase(value)) {
				return status;
			}
		}
		throw new IllegalArgumentException("Status inválido: " + value);
	}
}
