package com.example.kanbanboard.passwordResetService.Service;

import com.example.kanbanboard.passwordResetService.Exception.InvalidInputException;
import com.example.kanbanboard.passwordResetService.Exception.UserNotFoundException;


public interface IPasswordResetService
{

    String createPasswordResetToken(String email)throws UserNotFoundException;
    void resetPassword(String token, String newPassword) throws InvalidInputException;
}
