package com.example.kanbanboard.userService.Exception;

public class UserAlreadyExistsException extends Exception
{
    public UserAlreadyExistsException(String message)
    {
        super(message);
    }

}
