package com.example.kanbanboard.passwordResetService.Exception;

public class InvalidInputException extends RuntimeException
{
    public InvalidInputException(String message) {
        super(message);
    }
}
