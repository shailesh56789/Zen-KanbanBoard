package com.example.kanbanboard.userService.Service;
import com.example.kanbanboard.userService.DTO.UserBoardsDTO;
import com.example.kanbanboard.userService.DTO.UserDTO;
import com.example.kanbanboard.userService.DTO.UserRequestDTO;
import com.example.kanbanboard.userService.Domain.User;
import com.example.kanbanboard.userService.Exception.BoardNotFoundException;
import com.example.kanbanboard.userService.Exception.NoUserRegisteredException;
import com.example.kanbanboard.userService.Exception.UserAlreadyExistsException;
import com.example.kanbanboard.userService.Exception.UserNotFoundException;
import com.example.kanbanboard.userService.Repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements IUserService {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder)
    {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }


    @Override
    public UserDTO saveUser(UserRequestDTO userRequestDTO) throws UserAlreadyExistsException
    {
        User existingUser = userRepository.findByUserEmail((userRequestDTO.getUserEmail()));

        if (existingUser != null && userRepository.existsById(existingUser.getUserId()))
        {
            throw new UserAlreadyExistsException("User Already Exists for This Email!!!");
        }
        User user = UserMapper.fromRequestDTO(userRequestDTO);
        user.setUserPassword(passwordEncoder.encode(user.getUserPassword()));
        User savedUser = userRepository.save(user);
        return UserMapper.toDTO(savedUser);

    }


    @Override
    public UserDTO authenticateUser(UserRequestDTO userRequestDTO) throws UserNotFoundException {
        User userObj = null;

        if (userRequestDTO.getUserEmail() != null && !userRequestDTO.getUserEmail().isEmpty()) {
            userObj = userRepository.findByUserEmail(userRequestDTO.getUserEmail());
        } else if (userRequestDTO.getUserName() != null && !userRequestDTO.getUserName().isEmpty()) {
            userObj = userRepository.findByUserName(userRequestDTO.getUserName());
        }

        if (userObj == null) {
            throw new UserNotFoundException("User not found!");
        }

        if (userObj.getUserPassword() != null && !userObj.getUserPassword().isEmpty()
                && passwordEncoder.matches(userRequestDTO.getUserPassword(), userObj.getUserPassword()))
        {

            return UserMapper.toDTO(userObj);


        } else {
            throw new UserNotFoundException("Invalid Credentials!!!");
        }

    }

    @Override
    public String fetchEmailWithId(Long userId) throws UserNotFoundException
    {
        User user = userRepository.findByUserId(userId);

        if (user == null || user.getUserEmail() == null || user.getUserEmail().isBlank())
        {
           throw new UserNotFoundException("User Not Found!!! ");
        }
       return user.getUserEmail();
    }

    @Override
    public List<UserDTO> getAllUsers() throws NoUserRegisteredException
    {
        List<User> users = userRepository.findAll();
        if (users.isEmpty()) {
            throw new NoUserRegisteredException();
        }
        return users.stream()
                .map(UserMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public boolean deleteAllUsers() throws NoUserRegisteredException {
        if (userRepository.findAll().isEmpty()) {
            throw new NoUserRegisteredException();
        }
//      passwordResetTokenRepository.deleteAll();  implement in password reset service
        userRepository.deleteAll();
        return true;
    }

    @Override
    @Transactional
    public boolean deleteUser(String userEmail) throws UserNotFoundException {
        User user = userRepository.findByUserEmail(userEmail);
        if (user == null) {
            throw new UserNotFoundException("User Not Found for given Email!!!");
        }
        //passwordResetTokenRepository.deleteByUser(user); implement in password reset service.
        userRepository.delete(user);
        return true;
    }

    @Override
    public UserDTO findUserById(Long Id) throws UserNotFoundException {
        User user = userRepository.findByUserId(Id);
        if (user == null) {
            throw new UserNotFoundException("Wrong User Id!!!");
        }

        return UserMapper.toDTO(user);
    }


    @Override
    public List<UserDTO> findUsersByBoardId(int boardId)
    {
        List <User> users = userRepository.findByUserBoardsContains(boardId);
        return users.stream()
                .map(UserMapper::toDTO)
                .collect(Collectors.toList());


    }


    @Override
    public User findByUserEmail(String email)throws UserNotFoundException
    {
        User user = userRepository.findByUserEmail(email);
        if(user==null)
            throw new UserNotFoundException("User Not Found !!!");
        return user;

    }



    @Override
    @Transactional
    public void addBoardToUser(Long userId, int boardId) throws UserNotFoundException, BoardNotFoundException {
        User user = userRepository.findByUserId(userId);
        if (user == null) {
            throw new UserNotFoundException("User not found with id: " + userId);
        }

        Set<Integer> boards = user.getUserBoards();
        if (!boards.contains(boardId))
        {
            boards.add(boardId);
            user.setUserBoards(boards);
            userRepository.save(user);
        }
    }

    @Override
    public UserBoardsDTO fetchUserBoardsWithUserId(Long userId) throws UserNotFoundException
    {
        User user = userRepository.findByUserId(userId);
        if(user==null||user.getUserBoards().isEmpty())
        {
            throw new UserNotFoundException("User Not Found!!!");
        }
        return UserMapper.toBoardsDTO(user);

    }


    @Override
    public List<UserDTO> findUsersByTeamId(String teamId) {
       List <User> users =  userRepository.findByTeamId(teamId);
       return users.stream()
               .map(UserMapper::toDTO)
               .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public boolean removeBoardFromUser(Long userId, int boardId) throws UserNotFoundException
    {
        User user = userRepository.findByUserId(userId);
        if (user == null) {
            throw new UserNotFoundException("User not found with id: " + userId);
        }
        Set<Integer> boards = user.getUserBoards();
            if (boards.contains(boardId))
            {
                boards.remove(boardId);
                user.setUserBoards(boards);
                userRepository.save(user);  // persist the change
                return true;
            } else
            {
                throw new BoardNotFoundException("Board not found for this user: " + boardId);
            }
    }

    @Override
    @Transactional
    public boolean resetPasswordWithUserId(Long userid, String newPassword) throws UserNotFoundException
    {

            User user = userRepository.findByUserId(userid);

        if(user==null)
        {
            throw new UserNotFoundException("User Not Found With Requester User ID!!");
        }
        else
        {
            user.setUserPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
        }

        return true;
    }


}
