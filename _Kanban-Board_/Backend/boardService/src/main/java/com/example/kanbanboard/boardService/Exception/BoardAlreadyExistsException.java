package com.example.kanbanboard.boardService.Exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code= HttpStatus.NOT_FOUND , reason = "Board Already exists")
public class BoardAlreadyExistsException extends RuntimeException {

}
