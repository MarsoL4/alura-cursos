package com.rotalog.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class VeiculoNotFoundException extends RuntimeException {

	public VeiculoNotFoundException(String message) {
		super(message);
	}
}
