package com.example.kanbanboard.taskService.Service;

import com.example.kanbanboard.taskService.Domain.Task;
import com.example.kanbanboard.taskService.Exception.TaskAreadyAssignedException;
import com.example.kanbanboard.taskService.Exception.TaskNotFoundException;

import java.util.List;

public interface TaskService
{

    Task createTask(Task task) throws TaskAreadyAssignedException;
    public boolean removeTaskById(String taskId);
    Task updateTask(Task task);
    Task updateTaskStatus(String taskId, String newStatus) throws TaskNotFoundException;
    public List<Task> getAllTasks();
    List<Task> findByBoardId(String boardId);
}
