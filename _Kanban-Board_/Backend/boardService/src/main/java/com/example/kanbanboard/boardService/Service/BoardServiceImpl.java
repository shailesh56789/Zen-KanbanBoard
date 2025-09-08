package com.example.kanbanboard.boardService.Service;

import com.example.kanbanboard.boardService.DTO.UserBoardsDTO;
import com.example.kanbanboard.boardService.Domain.Board;
import com.example.kanbanboard.boardService.Exception.BoardAlreadyExistsException;
import com.example.kanbanboard.boardService.Exception.BoardNotFoundException;
import com.example.kanbanboard.boardService.Exception.UserNotFoundException;
import com.example.kanbanboard.boardService.Repository.BoardRepository;
import com.example.kanbanboard.boardService.Client.UserServiceClient;
import feign.FeignException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class BoardServiceImpl implements BoardService
{

    private final UserServiceClient userServiceClient;
    private final BoardRepository boardRepository;

    @Autowired
    public BoardServiceImpl(UserServiceClient userServiceClient, BoardRepository boardRepository)
    {
        this.userServiceClient = userServiceClient;
        this.boardRepository = boardRepository;
    }

    @Override
    @Transactional
    public Board createBoard(Board board) throws BoardAlreadyExistsException
    {

        Board boardExist = boardRepository.findByBoardName(board.getBoardName());
        if(boardExist != null)
        {
            throw new BoardAlreadyExistsException();
        }
        return boardRepository.save(board);
    }

    @Override
    @Transactional
    public Board updateBoard(int boardId, Board updatedBoard)
    {
        return boardRepository.findById(boardId).map(existingBoard ->
        {
            existingBoard.setBoardName(updatedBoard.getBoardName());
            existingBoard.setAssignerId(updatedBoard.getAssignerId());
            existingBoard.setAssignedUserIds(updatedBoard.getAssignedUserIds());
            existingBoard.setBoardColumns(updatedBoard.getBoardColumns());
            return boardRepository.save(existingBoard);
        }).orElseThrow(() -> new RuntimeException("Board not found with id " + boardId));

    }

    @Override
    public List<Board> getAllBoards() {
        return boardRepository.findAll();
    }

    @Override
    public Board getBoardById(int boardId)
    {
        return boardRepository.findByBoardId(boardId);
    }

    @Override
    public Board getBoardByName(String boardName) {
        return boardRepository.findByBoardName(boardName);
    }

    @Override
    public List<Board> getBoardsByAssigner(Long assignerId) {
        return boardRepository.findByAssignerId(assignerId);
    }

    @Override
    public List<Board> getBoardByUser(Long assignedUserIds) {
        return boardRepository.findByAssignedUserIdsContaining(assignedUserIds);
    }


    @Override
    @Transactional
    public boolean deleteByBoardId(int boardId) throws BoardNotFoundException {
        // 1. Find the board
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new BoardNotFoundException("Board not found with id " + boardId));

        // 2. Remove the board from assigned users
        Set<Long> assignedUserIds = board.getAssignedUserIds();
        if (assignedUserIds != null) {
            for (Long userId : assignedUserIds) {
                try {
                    userServiceClient.deleteThisBoardFromUser(userId, boardId);
                } catch (FeignException e) {
                    if (e.status() == 404) {
                        System.err.println("User not found in UserService for ID: " + userId);
                    } else {
                        System.err.println("Failed to remove board " + boardId + " from user " + userId + ": " + e.getMessage());
                        // Optionally log and continue or throw
                    }
                }
            }
        }

        // 3. Delete the board itself
        boardRepository.deleteById(boardId);
        return true;
    }



    @Override
    public List<Board> getBoardsForUser(Long userId) throws UserNotFoundException {
        try {
            UserBoardsDTO userBoardsDTO = userServiceClient.fetchUserBoards(userId);
            Set<Integer> userBoards = userBoardsDTO.getUserBoards();
            return boardRepository.findByBoardIdIn(userBoards);
        } catch (FeignException e) {
            if (e.status() == 404) {
                throw new UserNotFoundException("User not found in UserService with ID: " + userId);
            } else {
                throw new RuntimeException("Error while calling UserService: " + e.getMessage(), e);
            }
        }
    }

    @Override
    public List<Board> findByTeamIds(String teamId)
    {
        return boardRepository.findByTeamIds(teamId);
    }

}
