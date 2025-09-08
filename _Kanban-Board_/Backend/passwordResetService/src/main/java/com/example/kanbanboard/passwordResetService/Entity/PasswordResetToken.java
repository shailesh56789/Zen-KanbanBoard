package com.example.kanbanboard.passwordResetService.Entity;

import jakarta.persistence.*;

import java.util.Date;

@Entity
public class PasswordResetToken
{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    private Long userId;

    @Column(nullable = false)
    private Date expiryDate;

    public boolean isExpired() {
        return expiryDate.before(new Date());
    }

    public PasswordResetToken(Long id, String token, Long userId, Date expiryDate) {
        this.id = id;
        this.token = token;
        this.userId = userId;
        this.expiryDate = expiryDate;
    }

    public PasswordResetToken() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Date getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(Date expiryDate) {
        this.expiryDate = expiryDate;
    }
}
