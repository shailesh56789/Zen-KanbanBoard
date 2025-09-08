package com.example.kanbanboard.taskService.Service;

import com.example.kanbanboard.taskService.Clients.EmailServiceClient;
import com.example.kanbanboard.taskService.Clients.UserServiceClient;
import com.example.kanbanboard.taskService.DTO.TaskAssignmentEmailRequest;
import com.example.kanbanboard.taskService.Domain.Task;
import com.example.kanbanboard.taskService.Exception.TaskAreadyAssignedException;
import com.example.kanbanboard.taskService.Exception.TaskNotFoundException;
import com.example.kanbanboard.taskService.Repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TaskServiceImpl implements TaskService
{
    private final EmailServiceClient emailServiceClient;
    private final UserServiceClient userServiceClient;
    private final TaskRepository taskRepository;

    @Autowired
    public TaskServiceImpl(EmailServiceClient emailServiceClient, UserServiceClient userServiceClient, TaskRepository taskRepository)
    {
        this.emailServiceClient = emailServiceClient;
        this.userServiceClient = userServiceClient;
        this.taskRepository = taskRepository;
    }





    @Override
    public Task createTask(Task task) throws TaskAreadyAssignedException
    {
        Optional<Task> existingTask = taskRepository.findByTaskTitleAndBoardId(
                task.getTaskTitle(), task.getBoardId().trim()
        );

        if (existingTask.isPresent()) {
            throw new TaskAreadyAssignedException("Task already exists");
        }

        task.setAccessId(UUID.randomUUID().toString());
        Task savedTask = taskRepository.save(task);

        for (String userId : task.getAssignedUserIds()) {
            try {// Convert String to Long
                String toEmail = userServiceClient.getUserEmail(Long.parseLong(userId)); // Fetch email from UserService

                TaskAssignmentEmailRequest emailRequest = TaskMapper.toEmailRequest(
                        toEmail,
                        savedTask.getTaskTitle()
                );
                emailServiceClient.sendTaskAssignmentEmail(emailRequest);

            } catch (NumberFormatException e) {
                System.err.println("Invalid userId format in task assignment: " + userId);
            } catch (Exception e) {
                System.err.println("Error sending task assignment email: " + e.getMessage());
            }
        }

        return savedTask;
    }




    @Override
    public boolean removeTaskById(String taskId)
    {
        Optional<Task> task = taskRepository.findById(taskId);
        if (task.isPresent()) {
            taskRepository.deleteById(taskId);
            return true;
        }
        return false;
    }




    @Override
    public Task updateTask(Task task) {
        String id = task.getTaskId();

        // Check if id is valid and exists in repository
        if (id == null || id.trim().isEmpty() || !taskRepository.existsById(id)) {
            return null;
        }

        return taskRepository.save(task);
    }
    @Override
    public Task updateTaskStatus(String taskId, String newStatus) throws TaskNotFoundException
    {
        Optional<Task> optionalTask = taskRepository.findById(taskId);

        if (optionalTask.isEmpty()) {
            throw new TaskNotFoundException("Task not found with ID: " + taskId);  // Or create custom exception
        }

        Task task = optionalTask.get();
        task.setStatus(newStatus);
        return taskRepository.save(task);  // Returns updated task
    }

    @Override
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @Override
    public List<Task> findByBoardId(String boardId){
        return taskRepository.findByBoardId(boardId);
    }


}
