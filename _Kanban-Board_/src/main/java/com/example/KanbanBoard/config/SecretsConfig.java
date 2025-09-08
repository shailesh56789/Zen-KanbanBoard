package com.example.KanbanBoard.config;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@PropertySource(value = "file:config/application-secrets.properties", ignoreResourceNotFound = true)
public class SecretsConfig {
}
