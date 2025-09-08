package com.example.kanbanboard.authenticationService.Model;

public class AuthenticationResponse
{
    private String message;
    private String token;


    public AuthenticationResponse(String token,String message)
    {
        this.token = token;
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setToken(String token) {
        this.token = token;
    }


}