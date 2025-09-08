package com.example.kanbanboard.taskService.Clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@FeignClient(name = "zenkanbanboard-userservice")
public interface UserServiceClient
{
    @GetMapping("user/fetchemail/{userId}")
    String getUserEmail(@PathVariable("userId") Long userId);

}