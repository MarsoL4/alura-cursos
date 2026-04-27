package com.rotalog.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class VeiculoStatusInvalidoException extends RuntimeException {

	public VeiculoStatusInvalidoException(String message) {
		super(message);
	}
}
