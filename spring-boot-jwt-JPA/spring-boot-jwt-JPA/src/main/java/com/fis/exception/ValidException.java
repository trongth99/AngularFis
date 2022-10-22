package com.fis.exception;

@SuppressWarnings("serial")
public class ValidException extends Exception{
	public ValidException(String errorMessage) {
		super(errorMessage);
	}
}
