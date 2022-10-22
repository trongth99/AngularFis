package com.fis.exception;

@SuppressWarnings("serial")
public class CheckException extends Exception{
	public CheckException(String errorMessage) {
		super(errorMessage);
	}
}
