package com.example.KanbanBoard.service;

import com.example.KanbanBoard.domain.Board;
import com.example.KanbanBoard.exception.BoardAlreadyExistsException;

import java.util.List;
import java.util.Set;

public interface BoardService {

    Board createBoard(Board board) throws BoardAlreadyExistsException;
    Board updateBoard(int boardId, Board board);
    List<Board> getAllBoards();
    Object getBoardById(int boardId);
    Board getBoardByName(String boardName);
    List<Board> getBoardsByAssignee(Long assigneeId);
    List<Board> getBoardByUser(Long assignedUserIds);
    boolean isBoardContainsUser(int boardId, Long assignedUserIds);
    boolean deleteByBoardId(int boardId);
    boolean deleteAllBoards();
    public List<Board> getBoardsForUser(Set<Integer> boardIds);//Added this for fetching boards to be shown for each users based on userBoardsId.
    List<Board> findByTeamIds(String teamId);
}
