package com.example.kanbanboard.userService.DTO;

import java.util.Set;

public class UserDTO
{
    private Long userId;
    private String userEmail;
    private String userPhoneNumber;
    private String userName;
    private String teamId;
    private String role;
    private Set<Integer> userBoards;

    public UserDTO() {}

    public UserDTO(Long userId, String userEmail, String userPhoneNumber, String userName, String teamId, String role, Set<Integer> userBoards) {
        this.userId = userId;
        this.userEmail = userEmail;
        this.userPhoneNumber = userPhoneNumber;
        this.userName = userName;
        this.teamId = teamId;
        this.role = role;
        this.userBoards = userBoards;
    }

    // Getters and Setters

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserPhoneNumber() {
        return userPhoneNumber;
    }

    public void setUserPhoneNumber(String userPhoneNumber) {
        this.userPhoneNumber = userPhoneNumber;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getTeamId() {
        return teamId;
    }

    public void setTeamId(String teamId) {
        this.teamId = teamId;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Set<Integer> getUserBoards() {
        return userBoards;
    }

    public void setUserBoards(Set<Integer> userBoards) {
        this.userBoards = userBoards;
    }
}
