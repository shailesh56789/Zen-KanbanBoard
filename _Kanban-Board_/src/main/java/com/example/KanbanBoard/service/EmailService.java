package com.example.KanbanBoard.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendTaskAssignmentEmail(String toEmail, String taskAccessId, String taskTitle)
    {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("You've Been Assigned a New Task: " + taskTitle);
        message.setText("Hello,\n\n"
                + "A new task has been assigned to you on ZenKanban.\n\n"
                + "📌 Task Title: " + taskTitle + "\n"
                + "🆔 Task Access ID: " + taskAccessId + "\n\n"
                + "Please log in to your ZenKanban dashboard to view and manage this task.\n\n"
                + "Stay productive!\n"
                + "— The ZenKanban Team");

        message.setFrom("zenkanban@gmail.com");
        mailSender.send(message);
    }


    public void sendPasswordResetEmail(String toEmail, String token)
    {
        String resetLink = "http://localhost:3000/reset-password?token=" + token;
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Reset Your ZenKanban Password");
        message.setText("Hi there,\n\n"
                + "We received a request to reset your ZenKanban account password.\n"
                + "To proceed, please click the secure link below:\n\n"
                + resetLink + "\n\n"
                + "If you didn’t make this request, you can safely ignore this email.\n\n"
                + "Thank you for using ZenKanban.\n"
                + "— The ZenKanban Team");

        message.setFrom("zenkanban@gmail.com");
        mailSender.send(message);
    }


}
