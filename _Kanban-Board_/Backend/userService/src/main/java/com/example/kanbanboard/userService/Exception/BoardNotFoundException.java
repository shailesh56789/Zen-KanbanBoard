package com.example.kanbanboard.userService.Exception;

public class BoardNotFoundException extends RuntimeException
{
    public BoardNotFoundException(String message) {
        super(message);
    }
}
