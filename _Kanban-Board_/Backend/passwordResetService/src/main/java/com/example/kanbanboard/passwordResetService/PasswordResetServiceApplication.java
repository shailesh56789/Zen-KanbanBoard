package com.example.kanbanboard.passwordResetService;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableFeignClients
@SpringBootApplication
public class PasswordResetServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(PasswordResetServiceApplication.class, args);
	}

}
