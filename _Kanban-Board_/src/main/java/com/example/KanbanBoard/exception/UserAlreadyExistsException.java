package com.example.KanbanBoard.exception;

public class UserAlreadyExistsException extends Exception
{
    public UserAlreadyExistsException(String message)
    {
        super(message);
    }

}
