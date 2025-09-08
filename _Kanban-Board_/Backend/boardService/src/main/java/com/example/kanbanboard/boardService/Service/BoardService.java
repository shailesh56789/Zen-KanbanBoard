package com.example.kanbanboard.boardService.Service;

import com.example.kanbanboard.boardService.Domain.Board;
import com.example.kanbanboard.boardService.Exception.BoardAlreadyExistsException;
import com.example.kanbanboard.boardService.Exception.BoardNotFoundException;
import com.example.kanbanboard.boardService.Exception.UserNotFoundException;

import java.util.List;

public interface BoardService
{
    Board createBoard(Board board) throws BoardAlreadyExistsException;
    Board updateBoard(int boardId, Board board);
    List<Board> getAllBoards();
    Board getBoardById(int boardId);
    Board getBoardByName(String boardName);
    List<Board> getBoardsByAssigner(Long assignerId);
    List<Board> getBoardByUser(Long assignedUserIds);
    boolean deleteByBoardId(int boardId) throws BoardNotFoundException;
    public List<Board> getBoardsForUser(Long userId) throws UserNotFoundException;//Added this for fetching boards to be shown for each users based on userBoardsId.
    List<Board> findByTeamIds(String teamId);
}