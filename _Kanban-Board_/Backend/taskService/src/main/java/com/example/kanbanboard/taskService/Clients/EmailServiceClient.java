package com.example.kanbanboard.taskService.Clients;

import com.example.kanbanboard.taskService.DTO.TaskAssignmentEmailRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@FeignClient(name = "zenkanbanboard-emailservice")
public interface EmailServiceClient
{
    @PostMapping("email/send-task-assignment")
    void sendTaskAssignmentEmail(@RequestBody TaskAssignmentEmailRequest request);
}
