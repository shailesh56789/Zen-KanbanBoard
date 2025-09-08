package com.example.KanbanBoard;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class KanbanBoardApplication
{



	public static void main(String[] args) {
		SpringApplication.run(KanbanBoardApplication.class, args);
	}

	@Bean
	public CommandLineRunner keepAlive() {
		return args -> {
			System.out.println("Task Service is running. Keeping app alive...");
			Thread.currentThread().join(); // Prevent exit
		};
	}


}
