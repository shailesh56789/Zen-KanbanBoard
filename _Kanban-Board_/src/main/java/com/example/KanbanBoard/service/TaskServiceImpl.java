package com.example.KanbanBoard.service;

import com.example.KanbanBoard.domain.Task;
import com.example.KanbanBoard.domain.User;
import com.example.KanbanBoard.exception.TaskAreadyAssignedException;
import com.example.KanbanBoard.repository.TaskRepository;
import com.example.KanbanBoard.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TaskServiceImpl implements TaskService {


    private EmailService emailService;
    private TaskRepository taskRepository ;
    private UserRepository userRepository;

    @Autowired
    public TaskServiceImpl(TaskRepository taskRepository,EmailService emailService,UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.emailService=emailService;
        this.userRepository=userRepository;
    }


    @Override
    public Task createTask(Task task) throws TaskAreadyAssignedException {
        Optional<Task> existingTask = taskRepository.findByTaskTitleAndBoardId(
                task.getTaskTitle(), task.getBoardId().trim()
        );

        if (existingTask.isPresent()) {
            throw new TaskAreadyAssignedException("Task already exists");
        }

        task.setAccessId(UUID.randomUUID().toString());
        Task savedTask = taskRepository.save(task);

        // Send emails to all assigned users
        for (String userIdStr : task.getAssignedUserIds()) {
            try {
                Long userId = Long.parseLong(userIdStr); // Convert String to Long
                userRepository.findById(userId).ifPresent(user -> {
                    emailService.sendTaskAssignmentEmail(
                            user.getUserEmail(),
                            savedTask.getAccessId(),
                            savedTask.getTaskTitle()
                    );
                });
            } catch (NumberFormatException e) {
                // Handle invalid ID format
                System.err.println("Invalid userId in task assignment: " + userIdStr);
            }
        }

        return savedTask;
    }



    @Override
    public boolean removeTaskById(String taskId) {
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
    public Task updateTaskStatus(String taskId, String newStatus) {
        Optional<Task> optionalTask = taskRepository.findById(taskId);

        if (optionalTask.isEmpty()) {
            throw new RuntimeException("Task not found with ID: " + taskId);  // Or create custom exception
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
    public List<Task> filterByToDoStatusS(String status) {
        return taskRepository.findTasksWithToDoStatus(status);
    }

    @Override
    public List<Task> filterByResearchStatusS(String status) {
        return taskRepository.filterByResearchStatus(status);
    }

    @Override
    public List<Task> filterByInProgressStatusS(String status) {
        return taskRepository.filterByInProgressStatus(status);
    }

    @Override
    public List<Task> filterByReviewStatusS(String status) {
        return taskRepository.filterByReviewStatus(status);
    }

    @Override
    public List<Task> filterByCompletedStatusS(String status) {
        return taskRepository.filterByCompletedStatus(status);
    }

    @Override
    public List<Task> findByBoardId(String boardId){
        return taskRepository.findByBoardId(boardId);
    }


}
