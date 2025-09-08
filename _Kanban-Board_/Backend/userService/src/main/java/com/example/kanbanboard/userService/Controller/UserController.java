package com.example.kanbanboard.userService.Controller;
import com.example.kanbanboard.userService.DTO.UserBoardsDTO;
import com.example.kanbanboard.userService.DTO.UserDTO;
import com.example.kanbanboard.userService.DTO.UserIdDTO;
import com.example.kanbanboard.userService.DTO.UserRequestDTO;
import com.example.kanbanboard.userService.Domain.User;
import com.example.kanbanboard.userService.Exception.*;
import com.example.kanbanboard.userService.Service.IUserService;
import com.example.kanbanboard.userService.Service.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController
{
    private IUserService userService;

    private String extractConstraintMessage(DataIntegrityViolationException e)
    {
        String msg = e.getRootCause().getMessage(); // usually SQL message
        System.out.println(msg);
        if (msg.contains("user_name")) return "Username already taken";
        if (msg.contains("user_phone_number")) return "Phone number already registered";
        return "Duplicate field violation";
    }

    @Autowired
    public UserController(IUserService userService) {
        this.userService = userService;
    }



    @PostMapping("/register")
    public ResponseEntity<Object> UserRegistration(@RequestBody UserRequestDTO userRequestDTO) throws UserAlreadyExistsException
    {
        try
        {
            userService.saveUser(userRequestDTO);

        }catch (UserAlreadyExistsException e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);

        }catch (DataIntegrityViolationException e)
        {
        String message = extractConstraintMessage(e);
        return new ResponseEntity<>(message, HttpStatus.CONFLICT);
    }
        return new ResponseEntity<>("User Registered with username : "+ userRequestDTO.getUserName(),HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<Object> UserLogin(@RequestBody UserRequestDTO userRequestDTO) throws UserNotFoundException
    {
        try {
                UserDTO userObj = userService.authenticateUser(userRequestDTO);
                return new ResponseEntity<>(userObj, HttpStatus.OK);
            }
        catch (UserNotFoundException exception)
        {
            return new ResponseEntity<>(exception.getMessage(),HttpStatus.NOT_FOUND);
        }

        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    // only for testing to be removed later.
    @GetMapping("/allusers")
    public ResponseEntity<Object> printAllUsers () throws NoUserRegisteredException
    {
        try{
            List<UserDTO> userDTOList = userService.getAllUsers();
            return new ResponseEntity<>(userDTOList, HttpStatus.OK);
        }catch(NoUserRegisteredException e)
        {
            return new ResponseEntity<>("No User To Print Register User First!!!",HttpStatus.CONFLICT);
        }
    }


    @DeleteMapping("/deleteall")
    public ResponseEntity<Object> deleteAllUsersData () throws NoUserRegisteredException
    {
        try {
            userService.deleteAllUsers();
            return new ResponseEntity<>("All Users Removed",HttpStatus.OK);

        }catch (NoUserRegisteredException e)
        {
            e.printStackTrace();
            return new ResponseEntity<>("No Users Exist",HttpStatus.CONFLICT);

        }

    }

    @DeleteMapping("/delete/{email}")
    public ResponseEntity<Object> deleteUser (@PathVariable("email")String userEmail) throws UserNotFoundException
    {
        try {
            userService.deleteUser(userEmail);
            return new ResponseEntity<>("User Removed",HttpStatus.OK);

        }catch (UserNotFoundException e)
        {
            e.printStackTrace();
            return new ResponseEntity<>("User Doesn't Exist",HttpStatus.CONFLICT);

        }

    }

    @GetMapping("/fetchbyid/{Id}")
    public ResponseEntity<Object> findUserById (@PathVariable("Id")Long userId) throws UserNotFoundException
    {
        try {
            UserDTO user = userService.findUserById(userId);
            return new ResponseEntity<>(user, HttpStatus.OK);

        }catch (UserNotFoundException e)
        {
            e.printStackTrace();
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);

        }

    }
    @GetMapping("/password-reset-fetchbyemail/{email}")
    public ResponseEntity<Object> findUserByemail (@PathVariable("email")String userEmail) throws UserNotFoundException
    {
        User userOG=null;

        try
        {
                userOG = userService.findByUserEmail(userEmail);

        }catch (UserNotFoundException e)
        {
            e.printStackTrace();
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);

        }
        UserIdDTO user = UserMapper.toIdDTO(userOG);
        return new ResponseEntity<>(user, HttpStatus.OK);

    }


    @GetMapping("usersbyboard/{boardId}")
    public ResponseEntity<?> getUsersByBoard(@PathVariable("boardId") int boardId) {
        List<UserDTO> users = userService.findUsersByBoardId(boardId);
        return ResponseEntity.ok(users);
    }

    @PutMapping("foruser/{userId}/addboard/{boardId}")
    public ResponseEntity<String> addBoardToUser(@PathVariable("userId") Long userId, @PathVariable("boardId") int boardId)
    {
        try {
            userService.addBoardToUser(userId, boardId);
            return new ResponseEntity<>("Board added to user successfully", HttpStatus.OK);
        } catch (UserNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (BoardNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);//when we have board service we ll need 2 exceptions.
        }
    }


    @GetMapping("/userboardsbyuserid/{userId}")
    public ResponseEntity<?> fetchUserBoardsWithUserId(@PathVariable("userId") Long userId)throws UserNotFoundException
    {
        try
        {
            UserBoardsDTO userBoards = userService.fetchUserBoardsWithUserId(userId);
            return new ResponseEntity<>(userBoards, HttpStatus.OK);
        } catch (UserNotFoundException e)
        {
            return new ResponseEntity<>("User Not Fount !!!", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/usersbyteam/{teamId}")
    public ResponseEntity<?> fetchByTeamId(@PathVariable("teamId") String teamId) throws TeamNotFoundException
    {
        try {
            List<UserDTO> teamMembers = userService.findUsersByTeamId(teamId);
            return new ResponseEntity<>(teamMembers,HttpStatus.OK);
            }catch(TeamNotFoundException e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
            }


    }

    @PutMapping("/fromuser/{userId}/removeboard/{boardId}")
    public ResponseEntity<String> removeBoardFromUser(
            @PathVariable("userId") Long userId,
            @PathVariable("boardId") int boardId) throws UserNotFoundException,BoardNotFoundException
    {
    try {
        boolean removed = userService.removeBoardFromUser(userId, boardId);
        if (removed)
        {
            return ResponseEntity.ok("Board removed from user successfully");
        }
    }catch(UserNotFoundException exception)
    {
        return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
    }catch(BoardNotFoundException exception)
    {
        return new ResponseEntity<>("Board not found", HttpStatus.NOT_FOUND);
    }

        return new ResponseEntity<>("Failed to remove board", HttpStatus.INTERNAL_SERVER_ERROR);

    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> requestBody) {
        try {
            Long userId = Long.parseLong(requestBody.get("userId"));
            String newPassword = requestBody.get("newPassword");

            userService.resetPasswordWithUserId(userId, newPassword);
            return ResponseEntity.ok("Password reset successfully.");

        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to reset password.");
        }
    }

    @GetMapping("/fetchemail/{userId}")
    public ResponseEntity<String> fetchUserEmailWithUserId(@PathVariable("userId") Long userId)
    {
        try
        {
            String email = userService.fetchEmailWithId(userId);
            return new ResponseEntity<>(email,HttpStatus.OK);
        }catch (UserNotFoundException exception)
        {
            return new ResponseEntity<>("User Not Found!!!",HttpStatus.NOT_FOUND);
        }

    }





}
