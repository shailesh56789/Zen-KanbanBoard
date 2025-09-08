package com.example.kanbanboard.taskService.Repository;

import com.example.kanbanboard.taskService.Domain.Task;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends MongoRepository<Task,String >
{
    List<Task> findByBoardId(String boardId);  //use to fetch task using boardId

    Optional<Task> findByTaskTitleAndBoardId(String taskTitle, String boardId);
}
