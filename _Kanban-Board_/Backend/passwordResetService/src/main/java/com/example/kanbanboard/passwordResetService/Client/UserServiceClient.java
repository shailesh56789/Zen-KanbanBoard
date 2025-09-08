package com.example.kanbanboard.passwordResetService.Client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@FeignClient(name = "zenkanbanboard-userservice")
public interface UserServiceClient {
    @GetMapping("user/password-reset-fetchbyemail/{email}")
    Map<String, Object> getUserByEmail(@PathVariable("email") String email);

    @PostMapping("user/reset-password")
    void resetPassword(@RequestBody Map<String, String> body);
}