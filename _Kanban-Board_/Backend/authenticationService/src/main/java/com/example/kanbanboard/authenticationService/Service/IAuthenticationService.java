package com.example.kanbanboard.authenticationService.Service;

import com.example.kanbanboard.authenticationService.Model.AuthenticationRequest;
import com.example.kanbanboard.authenticationService.Model.AuthenticationResponse;

public interface IAuthenticationService
{
    public AuthenticationResponse authenticate(AuthenticationRequest request);
}
