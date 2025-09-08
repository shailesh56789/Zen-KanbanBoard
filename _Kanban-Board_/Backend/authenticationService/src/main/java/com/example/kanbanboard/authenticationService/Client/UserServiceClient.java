package com.example.kanbanboard.authenticationService.Client;

import com.example.kanbanboard.authenticationService.DTO.UserDTO;
import com.example.kanbanboard.authenticationService.Model.AuthenticationRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "zenkanbanboard-userservice")
public interface UserServiceClient
{

    @PostMapping("/user/login")
    UserDTO loginUser(@RequestBody AuthenticationRequest request);

}
