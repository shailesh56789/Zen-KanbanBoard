package com.example.KanbanBoard.repository;

import com.example.KanbanBoard.domain.Task;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends MongoRepository<Task,String> {


    @Query("{ 'status' : ?0 }")
   List<Task> findTasksWithToDoStatus(String status);
    @Query("{ 'status' : '?0' }")
    List<Task> filterByResearchStatus(String Status);

    @Query("{ 'status' : '?0' }")
    List<Task> filterByInProgressStatus(String status);

  //  @Query("{ 'status' : 'REVIEW' }")   //research this content
  @Query("{ 'status' : '?0' }")
    List<Task> filterByReviewStatus(String status);

    @Query("{ 'status' : '?0' }")
    List<Task> filterByCompletedStatus(String status);

    //@Query("{ 'taskTitle' : { $regex: ?0, $options: 'i' } }")      //to avoid duplicate entry
   // Optional<Task> findByTaskTitle(String taskTitle);

    List<Task> findByBoardId(String boardId);  //use to fetch task using boardId



    Optional<Task> findByTaskTitleAndBoardId(String taskTitle, String boardId);
}
