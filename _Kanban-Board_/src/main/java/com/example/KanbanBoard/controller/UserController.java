package com.example.KanbanBoard.controller;

import com.example.KanbanBoard.domain.User;
import com.example.KanbanBoard.exception.*;
import com.example.KanbanBoard.service.IUserService;
import com.example.KanbanBoard.service.SecurityTokenGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class UserController
{


    private IUserService userService;
    private SecurityTokenGenerator securityTokenGenerator;

    private String extractConstraintMessage(DataIntegrityViolationException e)
    {
        String msg = e.getRootCause().getMessage(); // usually SQL message
        System.out.println(msg);
        if (msg.contains("user_name")) return "Username already taken";
        if (msg.contains("user_phone_number")) return "Phone number already registered";
        return "Duplicate field violation";
    }

    @Autowired
    public UserController(IUserService userService, SecurityTokenGenerator securityTokenGenerator) {

        this.userService = userService;
        this.securityTokenGenerator = securityTokenGenerator;
    }

    @GetMapping("")
    public String greeting()
    {
        return " Welcome to Capstone Project";
    }

    @PostMapping("/register")
    public ResponseEntity<Object> UserRegistration(@RequestBody User user) throws UserAlreadyExistsException
    {
        try
        {
            userService.saveUser(user);

        }catch (UserAlreadyExistsException e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);

        }catch (DataIntegrityViolationException e)
        {
        String message = extractConstraintMessage(e);
        return new ResponseEntity<>(message, HttpStatus.CONFLICT);
    }
        return new ResponseEntity<>("User Registered with username : "+ user.getUserName(),HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<Object> UserLogin(@RequestBody User user) throws UserNotFoundException
    {
        Map<String,String> userMap=null;


        try {
                User userObj = userService.authenticateUser(user);
                userMap = securityTokenGenerator.generateToken(userObj);
                return new ResponseEntity<>(userMap, HttpStatus.OK);
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
    @GetMapping("/user/allusers")
    public ResponseEntity<Object> printAllUsers () throws NoUserRegisteredException
    {
        try{
            List<User> userList = userService.getAllUsers();
            return new ResponseEntity<>(userList, HttpStatus.OK);
        }catch(NoUserRegisteredException e)
        {
            return new ResponseEntity<>("No User To Print Register User First!!!",HttpStatus.CONFLICT);
        }
    }


    @DeleteMapping("/user/deleteall")
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

    @DeleteMapping("/user/delete/{email}")
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

    @GetMapping("/user/{Id}")
    public ResponseEntity<Object> findUserById (@PathVariable("Id")Long userId) throws UserNotFoundException
    {
        try {
            User user = userService.findUserById(userId);
            return new ResponseEntity<>(user, HttpStatus.OK);

        }catch (UserNotFoundException e)
        {
            e.printStackTrace();
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);

        }

    }

//    @GetMapping("/team/{teamId}")
//    public ResponseEntity<?> getUsersByTeam(@PathVariable String teamId) {
//        List<User> users = userService.findUsersByTeamId(teamId);
//        return ResponseEntity.ok(users);
//    }

    @GetMapping("usersbyboard/{boardId}")
    public ResponseEntity<?> getUsersByBoard(@PathVariable int boardId) {
        List<User> users = userService.findUsersByBoardId(boardId);
        return ResponseEntity.ok(users);
    }

    @PutMapping("user/{userId}/addboard/{boardId}")
    public ResponseEntity<String> addBoardToUser(@PathVariable Long userId, @PathVariable int boardId) {
        try {
            userService.addBoardToUser(userId, boardId);
            return new ResponseEntity<>("Board added to user successfully", HttpStatus.OK);
        } catch (UserNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (BoardNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/usersbyteam/{teamId}")
    public ResponseEntity<?> fetchByTeamId(@PathVariable String teamId) throws TeamNotFoundException
    {
        try {
            List<User> teamMembers = userService.findUsersByTeamId(teamId);
            return new ResponseEntity<>(teamMembers,HttpStatus.OK);
            }catch(TeamNotFoundException e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
            }


    }

    @PutMapping("/user/{userId}/removeboard/{boardId}")
    public ResponseEntity<String> removeBoardFromUser(@PathVariable Long userId, @PathVariable int boardId) {
        boolean removed = userService.removeBoardFromUser(userId, boardId);
        if (removed) {
            return new ResponseEntity<>("Board removed from user successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Board or User not found or not associated", HttpStatus.NOT_FOUND);
        }
    }





}
