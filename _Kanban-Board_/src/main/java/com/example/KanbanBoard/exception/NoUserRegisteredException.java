package com.example.KanbanBoard.exception;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.NOT_FOUND , reason = "No Users Exists, Register Users to View")
public class NoUserRegisteredException extends Exception
{

}
