package com.example.kanbanboard.userService.Domain;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(
        name = "user",
        uniqueConstraints = {
                @UniqueConstraint(name = "user_name", columnNames = "userName"),
                @UniqueConstraint(name = "user_phone_number", columnNames = "userPhoneNumber")
        }
)
public class User
{


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;
    @Column(unique = true)
    private String userEmail;
    @Column(unique = true)
    private String userPhoneNumber;
    @Column(unique = true)
    private String userName;
    private String userPassword;
    @ElementCollection
    private Set<Integer> userBoards;// boardIds assigned to the user
    private String teamId;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    public User() {
    }

    public User(Long userId, String userEmail, String userPhoneNumber, String userName, String userPassword, Set<Integer> userBoards, String teamId, Role role) {
        this.userId = userId;
        this.userEmail = userEmail;
        this.userPhoneNumber = userPhoneNumber;
        this.userName = userName;
        this.userPassword = userPassword;
        this.userBoards = userBoards;
        this.teamId = teamId;
        this.role = role;
    }

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

    public String getUserPassword() {
        return userPassword;
    }

    public void setUserPassword(String userPassword) {
        this.userPassword = userPassword;
    }

    public Set<Integer> getUserBoards() {
        return userBoards;
    }

    public void setUserBoards(Set<Integer> userBoards) {
        this.userBoards = userBoards;
    }

    public String getTeamId() {
        return teamId;
    }

    public void setTeamId(String teamId) {
        this.teamId = teamId;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    @Override
    public String toString() {
        return "User{" +
                "userId=" + userId +
                ", userEmail='" + userEmail + '\'' +
                ", userPhoneNumber='" + userPhoneNumber + '\'' +
                ", userName='" + userName + '\'' +
                ", userBoards=" + userBoards +
                ", teamId='" + teamId + '\'' +
                ", role=" + role +
                '}';
    }
}
