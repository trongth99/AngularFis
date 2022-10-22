package com.fis.exception;

@SuppressWarnings("serial")
public class NotCheckException extends Exception{
	public NotCheckException(String errorMessage) {
		super(errorMessage);
	}
}
