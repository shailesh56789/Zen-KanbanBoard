package com.example.KanbanBoard.service;

import com.example.KanbanBoard.domain.User;
import com.example.KanbanBoard.exception.NoUserRegisteredException;
import com.example.KanbanBoard.exception.UserAlreadyExistsException;
import com.example.KanbanBoard.exception.UserNotFoundException;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IUserService {
    public User saveUser(User user) throws UserAlreadyExistsException;
    List<User> getAllUsers() throws NoUserRegisteredException;
    boolean deleteAllUsers() throws NoUserRegisteredException;
    boolean deleteUser(String userEmail)throws UserNotFoundException;
    public User authenticateUser(User user) throws UserNotFoundException;
    public User findUserById(Long Id)throws UserNotFoundException;

    List<User> findUsersByTeamId(String teamId);
    List<User> findUsersByBoardId(@Param("boardId") int boardId);

    public void addBoardToUser(Long userId, int boardId) throws UserNotFoundException;
    public boolean removeBoardFromUser(Long userId, int boardId);

}
