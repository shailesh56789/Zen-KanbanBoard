package com.example.kanbanboard.boardService.DTO;

import java.util.Set;

public class UserBoardsDTO
{

    private Set<Integer> userBoards;

    public UserBoardsDTO() {}
    public UserBoardsDTO(Set<Integer> userBoards)
    {
        this.userBoards=userBoards;
    }


    public Set<Integer> getUserBoards() {
        return userBoards;
    }

    public void setUserBoards(Set<Integer> userBoards) {
        this.userBoards = userBoards;
    }
}
