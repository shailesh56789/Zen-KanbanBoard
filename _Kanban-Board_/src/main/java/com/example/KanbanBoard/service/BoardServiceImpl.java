package com.example.KanbanBoard.service;

import com.example.KanbanBoard.domain.Board;
import com.example.KanbanBoard.exception.BoardAlreadyExistsException;
import com.example.KanbanBoard.repository.BoardRepository;
import com.example.KanbanBoard.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class BoardServiceImpl implements BoardService{

    private final BoardRepository boardRepository;
    private final UserRepository userRepository;

    @Autowired
    public BoardServiceImpl(BoardRepository boardRepository, UserRepository userRepository) {
        this.boardRepository = boardRepository;
        this.userRepository = userRepository;
    }

    @Override
     @Transactional
    public Board createBoard(Board board) throws BoardAlreadyExistsException {

        if(boardRepository.findById(board.getBoardId()).isPresent()){
            throw new BoardAlreadyExistsException();
        }
        return boardRepository.save(board);
    }

    @Override
    @Transactional
    public Board updateBoard(int boardId, Board updatedBoard) {
        return boardRepository.findById(boardId).map(existingBoard -> {
            existingBoard.setBoardName(updatedBoard.getBoardName());
            existingBoard.setAssigneeId(updatedBoard.getAssigneeId());
            existingBoard.setAssignedUserIds(updatedBoard.getAssignedUserIds());
            existingBoard.setBoardColumns(updatedBoard.getBoardColumns());
            existingBoard.setTasks(updatedBoard.getTasks());
            return boardRepository.save(existingBoard);
        }).orElseThrow(() -> new RuntimeException("Board not found with id " + boardId));
    }

    @Override
    public List<Board> getAllBoards() {
        return boardRepository.findAll();
    }

    @Override
    public Object getBoardById(int boardId) {
        return boardRepository.findById(boardId);
    }

    @Override
    public Board getBoardByName(String boardName) {
        return boardRepository.findByBoardName(boardName);
    }

    @Override
    public List<Board> getBoardsByAssignee(Long assigneeId) {
        return boardRepository.findByAssigneeId(assigneeId);
    }

    @Override
    public List<Board> getBoardByUser(Long assignedUserIds) {
        return boardRepository.findByAssignedUserIdsContaining(assignedUserIds);
    }

    @Override
    public boolean isBoardContainsUser(int boardId, Long assignedUserIds) {
        return boardRepository.existsByBoardIdAndAssignedUserIdsContaining(boardId,assignedUserIds);

    }

    @Override
    @Transactional
    public boolean deleteByBoardId(int boardId) {
        // 1. Find the board
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("Board not found with id " + boardId));

        // 2. Get the users who were assigned to this board
        Set<Long> assignedUserIds = board.getAssignedUserIds();
        if (assignedUserIds != null) {
            for (Long userId : assignedUserIds) {
                userRepository.findById(userId).ifPresent(user -> {
                    Set<Integer> boards = user.getUserBoards();
                    if (boards != null) {
                        boards.remove(boardId);
                        user.setUserBoards(boards);
                        userRepository.save(user); // Save the updated user
                    }
                });
            }
        }

        // 3. Delete the board
        boardRepository.deleteById(boardId);
        return true;
    }

    @Override
    @Transactional
    public boolean deleteAllBoards() {

        boardRepository.deleteAll();
        return true;
    }
    @Override
    public List<Board> getBoardsForUser(Set<Integer> boardIds) {
        return boardRepository.findByBoardIdIn(boardIds);
    }//Added this for fetching boards to be shown for each users based on userBoardsId.

    @Override
    public List<Board> findByTeamIds(String teamId)
    {
       return boardRepository.findByTeamIds(teamId);
    }

}
