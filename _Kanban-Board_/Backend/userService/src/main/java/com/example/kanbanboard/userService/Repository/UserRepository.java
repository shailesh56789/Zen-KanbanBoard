package com.example.kanbanboard.userService.Repository;

import com.example.kanbanboard.userService.Domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface UserRepository extends JpaRepository<User,Long>
{
    User findByUserName(String userName);
    User findByUserEmail(String userEmail);
    User findByUserId(Long userId);
    List<User> findByTeamId(String teamId);


    List<User> findByUserBoardsContains(@Param("boardId") int boardId);




}
