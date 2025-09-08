package com.example.kanbanboard.taskService.Exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code= HttpStatus.NOT_FOUND,reason = "Task is Already assigned to any another user")
public class TaskAreadyAssignedException extends Exception
{
    public TaskAreadyAssignedException(String message) {
        super(message);
    }
}