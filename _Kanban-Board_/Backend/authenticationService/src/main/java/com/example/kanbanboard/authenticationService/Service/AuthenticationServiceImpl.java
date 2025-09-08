package com.example.kanbanboard.authenticationService.Service;

import com.example.kanbanboard.authenticationService.Client.UserServiceClient;
import com.example.kanbanboard.authenticationService.Config.JwtConfig;
import com.example.kanbanboard.authenticationService.DTO.UserDTO;
import com.example.kanbanboard.authenticationService.Model.AuthenticationRequest;
import com.example.kanbanboard.authenticationService.Model.AuthenticationResponse;
import feign.FeignException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;

@Service
public class AuthenticationServiceImpl implements IAuthenticationService
{


    private final UserServiceClient userServiceClient;
    private final JwtConfig jwtConfig;

    public AuthenticationServiceImpl(UserServiceClient userServiceClient, JwtConfig jwtConfig)
    {
        this.userServiceClient = userServiceClient;
        this.jwtConfig = jwtConfig;
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request)
    {
        try {
            // 1. Call User Service to validate credentials
            UserDTO user = userServiceClient.loginUser(request);

            SecretKey key = Keys.hmacShaKeyFor(Base64.getDecoder().decode(jwtConfig.getSecret()));
            // 2. Build JWT
            String jwtToken = Jwts.builder()
                    .setSubject(Long.toString(user.getUserId()))
                    .setIssuer(jwtConfig.getIssuer())
                    .setAudience(jwtConfig.getAudience())
                    .claim("userName", user.getUserName())
                    .claim("userId", user.getUserId())
                    .claim("teamId", user.getTeamId())
                    .claim("role", user.getRole())
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + jwtConfig.getExpiration()))
                    .signWith(key)
                    .compact();

            // 3. Return token
            return new AuthenticationResponse(jwtToken, "Successfully Login For : " + user.getUserName());

        } catch (FeignException.NotFound ex)
        {
            throw new RuntimeException("Invalid credentials or user not found.");
        } catch (FeignException ex) {
            throw new RuntimeException("User service unavailable: " + ex.getMessage());
        }
    }
}
