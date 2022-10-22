package com.example.demo;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestApi {
	@Value("${AUTHEN_BASIC_SERVICE_LOCAL}")
	String AUTHEN_BASIC_SERVICE_LOCAL;
	
	@Value("${TEST}")
	String TEST;
	
	@GetMapping(value = "/")
	public String get() {
		
		return AUTHEN_BASIC_SERVICE_LOCAL+"-"+TEST;
	}
}
