package com.example.KanbanBoard.service;

import com.example.KanbanBoard.config.JwtConfig;
import com.example.KanbanBoard.domain.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtSecurityTokenGeneratorImpl implements SecurityTokenGenerator
{
    private final JwtConfig jwtConfig;
    JwtSecurityTokenGeneratorImpl(JwtConfig jwtConfig)
    {
        this.jwtConfig=jwtConfig;
    }

    //This method will generate the token

    @Override
    public Map<String, String> generateToken(User user)
    {
        var role = user.getRole();
        System.out.println(role);


        String jwtToken = Jwts.builder()
                .setSubject(Long.toString(user.getUserId()))
                .setIssuer(jwtConfig.getIssuer())
                .setAudience(jwtConfig.getAudience())
                .claim("userName", user.getUserName())
                .claim("userId", user.getUserId())
                .claim("teamId",user.getTeamId())
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtConfig.getExpiration()))
                .signWith(SignatureAlgorithm.HS256, Base64.getDecoder().decode(jwtConfig.getSecret()))
                .compact();

 //.setSubject(Long.toString(user.getUserId()))
        Map<String, String> map = new HashMap<>();
        map.put("token", jwtToken);
        map.put("message",user.getUserName()+" Successfully logged in");
        return map;
    }
}
