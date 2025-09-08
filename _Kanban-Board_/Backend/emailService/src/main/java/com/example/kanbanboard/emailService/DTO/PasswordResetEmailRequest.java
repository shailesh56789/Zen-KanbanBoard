package com.example.kanbanboard.emailService.DTO;

public class PasswordResetEmailRequest
{
    private String toEmail;
    private String token;

    public String getToEmail() {
        return toEmail;
    }

    public void setToEmail(String toEmail) {
        this.toEmail = toEmail;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
