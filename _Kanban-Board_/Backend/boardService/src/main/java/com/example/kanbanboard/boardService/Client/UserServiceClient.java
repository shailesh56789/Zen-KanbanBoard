package com.example.kanbanboard.boardService.Client;

import com.example.kanbanboard.boardService.DTO.UserBoardsDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;


@FeignClient(name = "zenkanbanboard-userservice")
public interface UserServiceClient
{
    @PutMapping("user/fromuser/{userId}/removeboard/{boardId}")
    void deleteThisBoardFromUser(@PathVariable("userId")Long userId,@PathVariable("boardId")int boardId);

    @GetMapping("user/userboardsbyuserid/{userId}")
    UserBoardsDTO fetchUserBoards(@PathVariable("userId")Long userId);

}

