package com.example.kanbanboard.boardService.Exception;

public class BoardNotFoundException extends RuntimeException
{
    public BoardNotFoundException(String message) {
        super(message);
    }
}
