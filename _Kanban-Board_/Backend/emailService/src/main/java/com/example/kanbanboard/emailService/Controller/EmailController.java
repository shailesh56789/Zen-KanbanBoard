package com.example.kanbanboard.emailService.Controller;

import com.example.kanbanboard.emailService.DTO.PasswordResetEmailRequest;
import com.example.kanbanboard.emailService.DTO.TaskAssignmentEmailRequest;
import com.example.kanbanboard.emailService.Service.IEmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/email")
public class EmailController
{
    @Autowired
    private final IEmailService emailService;

    public EmailController(IEmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/send-passwordreset")
    public ResponseEntity<Void> sendResetEmail(@RequestBody PasswordResetEmailRequest request)
    {
        emailService.sendPasswordResetEmail(request.getToEmail(), request.getToken());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/send-task-assignment")
    public void sendTaskAssignment(@RequestBody TaskAssignmentEmailRequest request) {
        emailService.sendTaskAssignmentEmail(request.getToEmail(), request.getTaskTitle());
    }
}
