package com.example.kanbanboard.userService.DTO;

import java.util.Set;

public class UserRequestDTO
{
    private String userEmail;
    private String userPhoneNumber;
    private String userName;
    private String userPassword;
    private String teamId;
    private String role;
    private Set<Integer> userBoards;

    public Set<Integer> getUserBoards() {
        return userBoards;
    }

    public void setUserBoards(Set<Integer> userBoards) {
        this.userBoards = userBoards;
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

    public String getUserPassword() {
        return userPassword;
    }

    public void setUserPassword(String userPassword) {
        this.userPassword = userPassword;
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
}
