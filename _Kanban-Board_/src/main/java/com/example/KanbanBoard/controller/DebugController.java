package com.example.KanbanBoard.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/debug")
public class DebugController {

    @GetMapping("/auth")
    public ResponseEntity<Map<String, Object>> checkAuth() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Map<String, Object> response = new HashMap<>();
        response.put("authenticated", auth != null && auth.isAuthenticated());
        response.put("principal", auth != null ? auth.getPrincipal().toString() : "null");
        response.put("authorities", auth != null ? auth.getAuthorities().toString() : "null");
        response.put("name", auth != null ? auth.getName() : "null");

        System.out.println("=== DEBUG CONTROLLER ===");
        System.out.println("Authentication: " + auth);
        System.out.println("Is authenticated: " + (auth != null && auth.isAuthenticated()));
        System.out.println("Principal: " + (auth != null ? auth.getPrincipal() : "null"));

        return ResponseEntity.ok(response);
    }

    @GetMapping("/simple")
    public ResponseEntity<String> simpleTest() {
        return ResponseEntity.ok("Debug endpoint working - authentication passed!");
    }
}