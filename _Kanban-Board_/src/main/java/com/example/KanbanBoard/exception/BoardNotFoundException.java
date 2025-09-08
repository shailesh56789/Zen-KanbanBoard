package com.example.KanbanBoard.exception;

public class BoardNotFoundException extends RuntimeException
{
    public BoardNotFoundException(String message) {
        super(message);
    }
}
