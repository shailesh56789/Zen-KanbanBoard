package com.example.KanbanBoard.repository;

import com.example.KanbanBoard.domain.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserRepository extends JpaRepository<User,Long>
{
    User findByUserName(String userName);
    User findByUserEmail(String userEmail);
    User findByUserId(Long userId);
    List<User> findByTeamId(String teamId);


    @Query("SELECT u FROM User u WHERE :boardId IN elements(u.userBoards)")
    List<User> findUsersByBoardId(@Param("boardId") int boardId);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM user_user_boards WHERE user_user_id = :userId AND user_boards = :boardId", nativeQuery = true)
    int removeBoardFromUserBoards(@Param("userId") Long userId, @Param("boardId") int boardId);


}
