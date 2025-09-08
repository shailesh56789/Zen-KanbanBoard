package com.example.KanbanBoard.service;

import com.example.KanbanBoard.domain.User;

import java.util.Map;

public interface SecurityTokenGenerator
{
    Map<String,String> generateToken(User customer);
}
