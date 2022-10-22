package com.fis.exception;

@SuppressWarnings("serial")
public class OcrException extends Exception{
	public OcrException(String errorMessage) {
		super(errorMessage);
	}
}
