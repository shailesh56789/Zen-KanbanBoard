package com.example.kanbanboard.emailService.Service;

public interface IEmailService
{
    public void sendTaskAssignmentEmail(String toEmail, String taskTitle);
    void sendPasswordResetEmail(String toEmail, String token);
}
