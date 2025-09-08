package com.example.kanbanboard.userService.Service;

import com.example.kanbanboard.userService.DTO.UserBoardsDTO;
import com.example.kanbanboard.userService.DTO.UserDTO;
import com.example.kanbanboard.userService.DTO.UserIdDTO;
import com.example.kanbanboard.userService.DTO.UserRequestDTO;
import com.example.kanbanboard.userService.Domain.Role;
import com.example.kanbanboard.userService.Domain.User;

public class UserMapper {

    // Convert domain User -> UserDTO (for response)
    public static UserDTO toDTO(User user) {
        if (user == null) return null;

        UserDTO dto = new UserDTO();
        dto.setUserId(user.getUserId());
        dto.setUserEmail(user.getUserEmail());
        dto.setUserPhoneNumber(user.getUserPhoneNumber());
        dto.setUserName(user.getUserName());
        dto.setTeamId(user.getTeamId());
        dto.setRole(user.getRole() != null ? user.getRole().name() : null);
        dto.setUserBoards(user.getUserBoards());

        return dto;
    }

    // Convert UserDTO -> domain User (rarely needed, e.g. in tests or admin tools)
    public static User toEntity(UserDTO dto) {
        if (dto == null) return null;

        User user = new User();
        user.setUserId(dto.getUserId());
        user.setUserEmail(dto.getUserEmail());
        user.setUserPhoneNumber(dto.getUserPhoneNumber());
        user.setUserName(dto.getUserName());
        user.setTeamId(dto.getTeamId());
        user.setUserBoards(dto.getUserBoards());

        try {
            user.setRole(Enum.valueOf(Role.class, dto.getRole()));
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new RuntimeException("Invalid or missing role value in DTO: " + dto.getRole());
        }

        return user;
    }

    // Convert UserRequestDTO (from client) -> domain User (for persistence)
    public static User fromRequestDTO(UserRequestDTO dto) {
        if (dto == null) return null;

        User user = new User();
        user.setUserEmail(dto.getUserEmail());
        user.setUserPhoneNumber(dto.getUserPhoneNumber());
        user.setUserName(dto.getUserName());
        user.setUserPassword(dto.getUserPassword());
        user.setTeamId(dto.getTeamId());
        user.setUserBoards(dto.getUserBoards());

        try {
            user.setRole(Enum.valueOf(Role.class, dto.getRole()));
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new RuntimeException("Invalid or missing role value in request DTO: " + dto.getRole());
        }

        return user;
    }


    // Convert User → UserIdDTO
    public static UserIdDTO toIdDTO(User user) {
        if (user == null) return null;
        return new UserIdDTO(user.getUserId());

    }

    // Convert User → UserBoardsDTO
    public static UserBoardsDTO toBoardsDTO(User user)
    {
        if (user == null) return null;
        return new UserBoardsDTO(user.getUserBoards());

    }
}
