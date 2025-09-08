package com.example.KanbanBoard.service;

import com.example.KanbanBoard.domain.Task;
import com.example.KanbanBoard.exception.TaskAreadyAssignedException;

import java.util.List;

public interface TaskService {

    Task createTask(Task task) throws TaskAreadyAssignedException;

    public boolean removeTaskById(String taskId);
    Task updateTask(Task task);


    Task updateTaskStatus(String taskId, String newStatus);


    public List<Task> getAllTasks();
    List<Task> filterByToDoStatusS(String status);
    List<Task> filterByResearchStatusS(String status);
    List<Task> filterByInProgressStatusS(String status);
    List<Task> filterByReviewStatusS(String status);
    List<Task> filterByCompletedStatusS(String status);

    List<Task> findByBoardId(String boardId);

  /*  Task createTask(Task task);
    Task getTaskById(String taskId);
    List<Task> getAllTasks();
    List<Task> getTasksByBoardId(String boardId);
    List<Task> getTasksByBoardIdAndStatus(String boardId, String status);
    List<Task> getTasksByAssignedUser(String userId);
    List<Task> getUserTasksByStatus(String userId, String status);
    Task updateTask(Task task);
    Task updateTaskStatus(String taskId, String status);
    Task assignTask(String taskId, String userId);
    Task unassignTask(String taskId);
    void deleteTask(String taskId);         */
}
