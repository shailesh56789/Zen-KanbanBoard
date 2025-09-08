package com.example.kanbanboard.emailService.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements IEmailService
{
    private final JavaMailSender mailSender;

    @Autowired
    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }



    public void sendTaskAssignmentEmail(String toEmail, String taskTitle) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("📝 New Task Assigned: " + taskTitle);

        message.setText("Hello,\n\n"
                + "You’ve been assigned a new task on ZenKanban!\n\n"
                + "📌 Task Title: " + taskTitle + "\n\n"
                + "To view and manage this task, please log in to your ZenKanban dashboard.\n\n"
                + "Let’s get things done — one task at a time.\n\n"
                + "Best regards,\n"
                + "The ZenKanban Team");

        message.setFrom("zenkanban@gmail.com");
        mailSender.send(message);
    }


    public void sendPasswordResetEmail(String toEmail, String token) {
        String resetLink = "http://localhost:3000/reset-password?token=" + token;
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("🔐 Reset Your ZenKanban Password");

        message.setText("Hi there,\n\n"
                + "We received a request to reset the password for your ZenKanban account.\n\n"
                + "To reset your password, please click the link below:\n"
                + resetLink + "\n\n"
                + "This link is valid for the next 5 minutes.\n"
                + "If you didn’t request a password reset, please ignore this email — your account is safe.\n\n"
                + "Need help? Just reply to this email or contact our support team.\n\n"
                + "Best,\n"
                + "The ZenKanban Support Team");

        message.setFrom("zenkanban@gmail.com");
        mailSender.send(message);
    }
}
