package com.example.kanbanboard.taskService.Domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;
import java.util.Set;

@Document(collection="ZenKanban_Task")
public class Task {
    @Id
    @JsonProperty("taskId")
    private String taskId;
    @Indexed(unique = true)
    @NotBlank(message = "Task title must not be blank or wrong")
    private String taskTitle;
    private String description;
    @NotBlank(message = "❌ Status is required")
    private String status;
    @NotBlank(message = "❌ Priority is required")
    private String priority;
    @NotNull(message = "❌ Due date must not be null")
    private Date dueDate;

    private Date createdAt;
    private Date updateAt;
    @JsonProperty("isCompleted")
    private boolean isCompleted;
    @Indexed(unique = true)

    private String accessId;
    @Indexed(unique = true)
    @NotNull(message = "❌ Assigned user ID must not be null")
    private Set<String> assignedUserIds;
    //  private  assignedUser;

    private String boardId; // added boardId


    public Task(String taskId, String taskTitle, String description, String status, String priority, Date dueDate,
                Date createdAt, Date updateAt, boolean isCompleted, String accessId, Set<String> assignedUserIds, String boardId) {
        this.taskId = taskId;
        this.taskTitle = taskTitle;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.dueDate = dueDate;
        this.createdAt = createdAt;
        this.updateAt = updateAt;
        this.isCompleted = isCompleted;
        this.accessId = accessId;
        this.assignedUserIds = assignedUserIds;
        this.boardId = boardId;
    }

    public Task() {
    }

    public String getTaskId() {
        return taskId;
    }

    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }

    public String getTaskTitle() {
        return taskTitle;
    }

    public void setTaskTitle(String taskTitle) {
        this.taskTitle = taskTitle;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public Date getDueDate() {
        return dueDate;
    }

    public void setDueDate(Date dueDate) {
        this.dueDate = dueDate;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdateAt() {
        return updateAt;
    }

    public void setUpdateAt(Date updateAt) {
        this.updateAt = updateAt;
    }

    public boolean isCompleted() {
        return isCompleted;
    }

    public void setCompleted(boolean completed) {
        isCompleted = completed;
    }

    public String getAccessId() {
        return accessId;
    }

    public void setAccessId(String accessId) {
        this.accessId = accessId;
    }

    public Set<String> getAssignedUserIds() {
        return assignedUserIds;
    }

    public void setAssignedUserIds(Set<String> assignedUserIds) {
        this.assignedUserIds = assignedUserIds;
    }

    public String getBoardId() {
        return boardId;
    }

    public void setBoardId(String boardId) {
        this.boardId = boardId;
    }

    @Override
    public String toString() {
        return "Task{" +
                "taskId='" + taskId + '\'' +
                ", taskTitle='" + taskTitle + '\'' +
                ", description='" + description + '\'' +
                ", status='" + status + '\'' +
                ", priority='" + priority + '\'' +
                ", dueDate=" + dueDate +
                ", createdAt=" + createdAt +
                ", updateAt=" + updateAt +
                ", isCompleted=" + isCompleted +
                ", accessId='" + accessId + '\'' +
                ", assignedUserIds=" + assignedUserIds +
                ", boardId='" + boardId + '\'' +
                '}';
    }
}

