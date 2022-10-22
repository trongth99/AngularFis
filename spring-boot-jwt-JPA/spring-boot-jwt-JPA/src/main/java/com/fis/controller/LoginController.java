package com.fis.controller;

import com.fis.common.StringUtils;
import com.fis.component.Language;
import com.fis.exception.ValidException;
import com.fis.model.UserObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import com.fis.service.JwtUserDetailsService;


import com.fis.config.JwtTokenUtil;
import com.fis.model.JwtRequest;
import com.fis.model.JwtResponse;
import com.fis.model.UserDTO;

@RestController
@CrossOrigin
public class LoginController {

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	@Autowired
	private JwtUserDetailsService userDetailsService;

	@Autowired
	private Language language;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@RequestMapping(value = "/login", method = RequestMethod.POST)
	public ResponseEntity<?> createAuthenticationToken(@RequestBody JwtRequest authenticationRequest) throws   ValidException {

		//authenticate(authenticationRequest.getUsername(), authenticationRequest.getPassword());

		//String userName = userDetailsService.loadUserByUsername(authenticationRequest.getUsername());
		if(StringUtils.isEmpty(authenticationRequest.getUsername()))
			throw new ValidException(language.getMessage("Username cannot be empty"));
		if(StringUtils.isEmpty(authenticationRequest.getPassword()))
			throw new ValidException(language.getMessage("Password cannot be empty"));

		UserDetails userDetails = userDetailsService.findUserName(authenticationRequest.getUsername());
		Boolean validatePassword = passwordEncoder.matches(authenticationRequest.getPassword(),userDetails.getPassword());
		if(!validatePassword){
			throw new ValidException(language.getMessage("password incorrect!!"));
		}

		UserObject infos = new UserObject();
		infos.setApiUserName("customer");
		infos.setApiPassWord("customer123");
		infos.setContainerId("VCB-POC_1.0.0-SNAPSHOT");
		infos.setProcessId("fisonboarding-template.VCBPOC");
		infos.setUserName(userDetails.getUsername());

		//final String token = jwtTokenUtil.generateToken(userDetails);
		final String token = jwtTokenUtil.generateToken2(infos);
		if(StringUtils.isEmpty(token)){
			throw new ValidException(language.getMessage("Đăng nhập thất bại"));
		}
		//authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authenticationRequest.getUsername(), authenticationRequest.getPassword()));
		return ResponseEntity.ok(new JwtResponse(token));
	}
	
	@RequestMapping(value = "/register", method = RequestMethod.POST)
	public ResponseEntity<?> saveUser(@RequestBody UserDTO user) throws Exception {
		return ResponseEntity.ok(userDetailsService.save(user));
	}

	private void authenticate(String username, String password) throws Exception {
		try {
			authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
		} catch (DisabledException e) {
			throw new Exception("USER_DISABLED", e);
		} catch (BadCredentialsException e) {
			throw new Exception("INVALID_CREDENTIALS", e);
		}
	}
}