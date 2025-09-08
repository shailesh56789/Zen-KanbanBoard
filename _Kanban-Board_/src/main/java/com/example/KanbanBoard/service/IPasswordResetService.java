package com.example.KanbanBoard.service;

import com.example.KanbanBoard.exception.UserNotFoundException;

public interface IPasswordResetService
{
    String createPasswordResetToken(String email) throws UserNotFoundException;
    void resetPassword(String token, String newPassword);
}
