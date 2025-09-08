package com.example.kanbanboard.taskService.Service;

import com.example.kanbanboard.taskService.DTO.TaskAssignmentEmailRequest;

public class TaskMapper
{
    public static TaskAssignmentEmailRequest toEmailRequest(String toEmail, String taskTitle)
    {
        TaskAssignmentEmailRequest dto = new TaskAssignmentEmailRequest();
        dto.setToEmail(toEmail);
        dto.setTaskTitle(taskTitle);
        return dto;
    }
}
