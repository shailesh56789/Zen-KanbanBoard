package com.example.kanbanboard.taskService.Controller;

import com.example.kanbanboard.taskService.Domain.Task;
import com.example.kanbanboard.taskService.Exception.TaskAreadyAssignedException;
import com.example.kanbanboard.taskService.Service.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/task")
public class TaskController
{
    private ResponseEntity responseEntity;
    private TaskService taskService;

    @Autowired
    public TaskController(TaskService taskService)
    {
        this.taskService = taskService;

    }
    private String extractConstraintMessage(DataIntegrityViolationException e) {
        String msg = e.getRootCause().getMessage();
        if (msg.contains("task_title")) return "task title already exists";
        if (msg.contains("PRIMARY")) return "task ID already exists";
        return "Duplicate entry not allowed";
    }


    @PostMapping("/createtask")
    public ResponseEntity<?> createTask(@Valid @RequestBody Task task, BindingResult result) {
        if (result.hasErrors()) {
            String message = result.getFieldError().getDefaultMessage();
            return new ResponseEntity<>(message, HttpStatus.BAD_REQUEST);
        }
        try {
            taskService.createTask(task);
            return new ResponseEntity<>(task, HttpStatus.CREATED);

        } catch (TaskAreadyAssignedException e) {
            return new ResponseEntity<>("❌ Task already assigned.", HttpStatus.CONFLICT);

        } catch (DuplicateKeyException e) {
            String msg = e.getMostSpecificCause().getMessage().toLowerCase();

            if (msg.contains("tasktitle")) {
                return new ResponseEntity<>("❌ Task title already exists.", HttpStatus.CONFLICT);
            } else if (msg.contains("accessid")) {
                return new ResponseEntity<>("❌ Access ID already exists.", HttpStatus.CONFLICT);
            } else if (msg.contains("assigneduserid")) {
                return new ResponseEntity<>("❌ Assigned user already has a task.", HttpStatus.CONFLICT);
            } else if (msg.contains("taskid") || msg.contains("_id")) {
                return new ResponseEntity<>("❌ Task ID already exists.", HttpStatus.CONFLICT);
            } else {
                return new ResponseEntity<>("❌ Duplicate entry not allowed.", HttpStatus.CONFLICT);
            }

        }catch (DataIntegrityViolationException e) {
            String message = extractConstraintMessage(e);
            return new ResponseEntity<>(message, HttpStatus.CONFLICT);
        }
        catch (Exception e) {
            e.printStackTrace(); // Debugging purpose
            return new ResponseEntity<>("⚠️ Internal Error occurred.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @DeleteMapping("/delete/{taskId}")
    public ResponseEntity<String> deleteTask(@PathVariable("taskId") String taskId) {
        boolean deleted = taskService.removeTaskById(taskId);
        if (deleted) return ResponseEntity.ok("✅ Task deleted successfully");
        else return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ Task not found");
    }


    @PutMapping("/update")
    public ResponseEntity<?> updateTask(@RequestBody Task task) {
        // Check if id is valid (not zero or negative)
        if (task.getTaskId()==null) {
            return ResponseEntity.badRequest().body("Task ID is required for update.");
        }

        Task updatedTask = taskService.updateTask(task);
        if (updatedTask != null) {
            return ResponseEntity.ok(updatedTask);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found.");
        }
    }

    @GetMapping("/tasks")
    public ResponseEntity<?> getAllTasks()
    {
        try {
            responseEntity=new ResponseEntity(taskService.getAllTasks(),HttpStatus.OK);
        } catch (Exception e) {
            responseEntity= new ResponseEntity(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return responseEntity;
    }

    @PutMapping("/updatestatus/{taskId}")
    public ResponseEntity<?> updateTaskStatus(
            @PathVariable("taskId") String taskId,
            @RequestBody Map<String, String> statusUpdate
    ) {
        try {
            String newStatus = statusUpdate.get("status");
            Task updatedTask = taskService.updateTaskStatus(taskId, newStatus);
            return ResponseEntity.ok(updatedTask);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }



    @GetMapping("/taskbyboard/{boardId}")
    public ResponseEntity<List<Task>> getTasksByBoard(@PathVariable("boardId") String boardId) {
        List<Task> tasks = taskService.findByBoardId(boardId);
        return ResponseEntity.ok(tasks);
    }

}
