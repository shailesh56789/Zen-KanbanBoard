package com.example.kanbanboard.emailService.DTO;

public class TaskAssignmentEmailRequest
{
    private String toEmail;
    private String taskTitle;

    public String getToEmail() {
        return toEmail;
    }

    public void setToEmail(String toEmail) {
        this.toEmail = toEmail;
    }


    public String getTaskTitle() {
        return taskTitle;
    }

    public void setTaskTitle(String taskTitle) {
        this.taskTitle = taskTitle;
    }
}
