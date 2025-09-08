package com.example.kanbanboard.authenticationService.Controller;

import com.example.kanbanboard.authenticationService.Model.AuthenticationRequest;
import com.example.kanbanboard.authenticationService.Model.AuthenticationResponse;
import com.example.kanbanboard.authenticationService.Service.IAuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {
    @Autowired
    private IAuthenticationService authenticationService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthenticationRequest request) {
        try
        {
            AuthenticationResponse response = authenticationService.authenticate(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException ex) {
            // Custom message based on what was thrown inside the service
            if (ex.getMessage().contains("Invalid credentials")) {
                return ResponseEntity.status(404).body(ex.getMessage()); // Not Found
            } else if (ex.getMessage().contains("User service unavailable")) {
                return ResponseEntity.status(503).body(ex.getMessage()); // Service Unavailable
            } else {
                return ResponseEntity.status(500).body("Unexpected error: " + ex.getMessage()); // Internal Server Error
            }
        }
    }
}
