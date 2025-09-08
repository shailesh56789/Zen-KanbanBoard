package com.example.kanbanboard.passwordResetService.Client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.Map;

@FeignClient(name = "zenkanbanboard-emailservice")
public interface EmailServiceClient {
    @PostMapping("email/send-passwordreset")
    void sendPasswordResetEmail(@RequestBody Map<String, String> body);
}