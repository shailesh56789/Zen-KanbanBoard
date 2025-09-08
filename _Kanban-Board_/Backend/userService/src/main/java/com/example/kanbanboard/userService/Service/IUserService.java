package com.example.kanbanboard.userService.Service;

import com.example.kanbanboard.userService.DTO.UserBoardsDTO;
import com.example.kanbanboard.userService.Domain.User;
import com.example.kanbanboard.userService.DTO.UserDTO;
import com.example.kanbanboard.userService.DTO.UserRequestDTO;
import com.example.kanbanboard.userService.Exception.BoardNotFoundException;
import com.example.kanbanboard.userService.Exception.NoUserRegisteredException;
import com.example.kanbanboard.userService.Exception.UserAlreadyExistsException;
import com.example.kanbanboard.userService.Exception.UserNotFoundException;

import java.util.List;

public interface IUserService
{

    UserDTO saveUser(UserRequestDTO userRequestDTO) throws UserAlreadyExistsException;
    List<UserDTO> getAllUsers() throws NoUserRegisteredException;
    boolean deleteAllUsers() throws NoUserRegisteredException;
    boolean deleteUser(String userEmail) throws UserNotFoundException;
    UserDTO authenticateUser(UserRequestDTO userRequestDTO) throws UserNotFoundException;
    UserDTO findUserById(Long Id) throws UserNotFoundException;
    List<UserDTO> findUsersByTeamId(String teamId);
    List<UserDTO> findUsersByBoardId(int boardId);
    User findByUserEmail(String email)throws UserNotFoundException;
    boolean removeBoardFromUser(Long userId, int boardId) throws UserNotFoundException, BoardNotFoundException;
    void addBoardToUser(Long userId, int boardId) throws UserNotFoundException, BoardNotFoundException;
    boolean resetPasswordWithUserId(Long userId, String newPassword) throws UserNotFoundException;
    UserBoardsDTO fetchUserBoardsWithUserId(Long userId) throws UserNotFoundException;
    String fetchEmailWithId(Long userId) throws UserNotFoundException;
}
