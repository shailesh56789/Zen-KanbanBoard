package com.example.KanbanBoard.service;

import com.example.KanbanBoard.domain.Board;
import com.example.KanbanBoard.domain.Role;
import com.example.KanbanBoard.domain.User;
import com.example.KanbanBoard.exception.BoardNotFoundException;
import com.example.KanbanBoard.exception.NoUserRegisteredException;
import com.example.KanbanBoard.exception.UserAlreadyExistsException;
import com.example.KanbanBoard.exception.UserNotFoundException;
import com.example.KanbanBoard.repository.BoardRepository;
import com.example.KanbanBoard.repository.PasswordResetTokenRepository;
import com.example.KanbanBoard.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class UserServiceImpl implements IUserService {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private PasswordResetTokenRepository passwordResetTokenRepository;
    private BoardRepository boardRepository;


    @Autowired
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, PasswordResetTokenRepository passwordResetTokenRepository, BoardRepository boardRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.boardRepository = boardRepository;
    }


    @Override
    public User saveUser(User user) throws UserAlreadyExistsException {
        User userFound = userRepository.findByUserEmail((user.getUserEmail()));

        if (userFound != null && userRepository.existsById(userFound.getUserId())) {
            throw new UserAlreadyExistsException("User Already Exists for This Email!!!");
        }

        user.setUserPassword(passwordEncoder.encode(user.getUserPassword()));
        return userRepository.save(user);

    }

    @Override
    public User authenticateUser(User user) throws UserNotFoundException {
        User userObj = null;

        if (user.getUserEmail() != null && !user.getUserEmail().isEmpty()) {
            userObj = userRepository.findByUserEmail(user.getUserEmail());
        } else if (user.getUserName() != null && !user.getUserName().isEmpty()) {
            userObj = userRepository.findByUserName(user.getUserName());
        }

        if (userObj == null) {
            throw new UserNotFoundException("User not found!");
        }

        if (userObj.getUserPassword() != null && !userObj.getUserPassword().isEmpty() && passwordEncoder.matches(user.getUserPassword(), userObj.getUserPassword())) {
            System.out.println(user.getRole());
            return userObj;

        } else {
            throw new UserNotFoundException("Invalid Credentials!!!");
        }

    }


    @Override
    public List<User> getAllUsers() throws NoUserRegisteredException {
        if (userRepository.findAll().isEmpty()) {
            throw new NoUserRegisteredException();
        }
        return userRepository.findAll();
    }

    @Transactional
    @Override
    public boolean deleteAllUsers() throws NoUserRegisteredException {
        if (userRepository.findAll().isEmpty()) {
            throw new NoUserRegisteredException();
        }
        passwordResetTokenRepository.deleteAll();
        userRepository.deleteAll();
        return true;
    }

    @Override
    @Transactional
    public boolean deleteUser(String userEmail) throws UserNotFoundException {
        User user = userRepository.findByUserEmail(userEmail);
        System.out.println(user);
        if (user == null) {
            throw new UserNotFoundException("User Not Found for given Email!!!");
        }
        passwordResetTokenRepository.deleteByUser(user);
        userRepository.delete(user);
        return true;
    }

    @Override
    public User findUserById(Long Id) throws UserNotFoundException {
        User user = userRepository.findByUserId(Id);
        if (user == null) {
            throw new UserNotFoundException("Wrong User Id!!!");
        }
        return user;
    }

//    @Override
//    public List<User> findUsersByTeamId(String teamId) {
//        return userRepository.findByTeamId(teamId);
//    }

    @Override
    public List<User> findUsersByBoardId(int boardId) {
        return userRepository.findUsersByBoardId(boardId);
    }

    @Override
    @Transactional
    public void addBoardToUser(Long userId, int boardId) throws UserNotFoundException, BoardNotFoundException {
        User user = userRepository.findByUserId(userId);
        if (user == null) {
            throw new UserNotFoundException("User not found with id: " + userId);
        }
        Board board = boardRepository.findByBoardId(boardId);
        if (board == null) {
            throw new BoardNotFoundException("Board not found with id:" + boardId);
        }
        Set<Integer> boards = user.getUserBoards();
        if (!boards.contains(boardId)) {
            boards.add(boardId);
            user.setUserBoards(boards);
            userRepository.save(user);
        }
    }

    @Override
    public List<User> findUsersByTeamId(String teamId) {
        return userRepository.findByTeamId(teamId);
    }

    @Transactional
    public boolean removeBoardFromUser(Long userId, int boardId) {
        return userRepository.removeBoardFromUserBoards(userId, boardId) > 0;
    }

}
