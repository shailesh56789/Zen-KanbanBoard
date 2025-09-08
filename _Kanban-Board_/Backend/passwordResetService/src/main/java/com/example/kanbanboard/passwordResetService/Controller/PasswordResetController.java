package com.example.kanbanboard.passwordResetService.Controller;

import com.example.kanbanboard.passwordResetService.DTO.EmailRequest;
import com.example.kanbanboard.passwordResetService.DTO.PasswordResetRequest;
import com.example.kanbanboard.passwordResetService.Exception.InvalidInputException;
import com.example.kanbanboard.passwordResetService.Exception.UserNotFoundException;
import com.example.kanbanboard.passwordResetService.Service.IPasswordResetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/password-reset")
public class PasswordResetController
{
    private final IPasswordResetService passwordResetService;

    public PasswordResetController(IPasswordResetService passwordResetService) {
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/create-token")
    public ResponseEntity<String> createToken(@RequestBody EmailRequest emailRequest) {
        String email = emailRequest.getUserEmail();
        if (email == null || email.isEmpty()) {
            throw new InvalidInputException("Email can't be Empty");
        }
        try {
            String token = passwordResetService.createPasswordResetToken(email);
            return ResponseEntity.ok("Reset token created. Check your email.");
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage()); // Not Found
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Something went wrong: " + e.getMessage());
        }
    }


    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody PasswordResetRequest passwordResetRequest)
    {
        String token = passwordResetRequest.getToken();
        String newPassword = passwordResetRequest.getNewPassword();


        passwordResetService.resetPassword(token, newPassword);
        return ResponseEntity.ok("Password Reset Successfully!!!");

    }
}
