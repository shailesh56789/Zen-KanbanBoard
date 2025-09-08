package com.example.kanbanboard.boardService.Controller;

import com.example.kanbanboard.boardService.Domain.Board;
import com.example.kanbanboard.boardService.Exception.BoardAlreadyExistsException;
import com.example.kanbanboard.boardService.Exception.BoardNotFoundException;
import com.example.kanbanboard.boardService.Exception.TeamNotFoundException;
import com.example.kanbanboard.boardService.Exception.UserNotFoundException;
import com.example.kanbanboard.boardService.Service.BoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/board")
public class BoardController
{

    private final BoardService boardService;

    @Autowired
    public BoardController(BoardService boardService)
    {
        this.boardService = boardService;
    }




    private String extractConstraintMessage(DataIntegrityViolationException e)
    {
        String msg = e.getRootCause().getMessage();
        if (msg.contains("boardName")) return "Board name already exists";
        if (msg.contains("PRIMARY")) return "Board ID already exists";
        return "Duplicate entry not allowed";
    }

    @PostMapping("/save")
    public ResponseEntity<Object> saveBoard(@RequestBody Board board) {
        try {
            Board savedBoard = boardService.createBoard(board);
            return new ResponseEntity<>(savedBoard, HttpStatus.CREATED);
        } catch (BoardAlreadyExistsException e) {
            return new ResponseEntity<>("Board already exists with this ID", HttpStatus.CONFLICT);
        } catch (DataIntegrityViolationException e) {
            String message = extractConstraintMessage(e);
            return new ResponseEntity<>(message, HttpStatus.CONFLICT);
        } catch (Exception e) {
            return new ResponseEntity<>("Internal Server Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PutMapping("/update/{boardId}")
    public ResponseEntity<Object> updateBoard(@PathVariable("boardId") int boardId, @RequestBody Board board) {
        try {

            Board updated = boardService.updateBoard(boardId, board);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>("Board not found with id " + boardId, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating board: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/fetchall")
    public ResponseEntity<List<Board>> fetchAllBoards(){
        return new ResponseEntity<>(boardService.getAllBoards(),HttpStatus.OK);
    }

    @GetMapping("/fetchbyid/{boardId}")
    public ResponseEntity<Object> fetchBoardById(@PathVariable("boardId") int boardId)
    {
        Board board = boardService.getBoardById(boardId);
        if (board == null) {
            return new ResponseEntity<>("Board not found", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(board, HttpStatus.OK);

    }

    @GetMapping("/fetchbyname/{boardName}")
    public ResponseEntity<Board> fetchBoardByName(@PathVariable("boardName") String boardName){
        return new ResponseEntity<>(boardService.getBoardByName(boardName),HttpStatus.OK);
    }

    @GetMapping("/fetchbyassigner/{assignerId}")
    public ResponseEntity<List<Board>> fetchBoardsByAssigner(@PathVariable("assignerId") Long assignerId){
        return new ResponseEntity<>(boardService.getBoardsByAssigner(assignerId),HttpStatus.OK);
    }


    @DeleteMapping("/deletebyid/{boardId}")
    public ResponseEntity<?> deleteBoardById(@PathVariable("boardId") int boardId) {
        try {
            boolean deleted = boardService.deleteByBoardId(boardId);

            if (deleted) {
                return ResponseEntity.ok("Successfully Deleted Board!");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Board could not be deleted.");
            }
        } catch (BoardNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Board not found with ID: " + boardId);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred while deleting the board.");
        }
    }





    @GetMapping("/fetchallboardsbyuserid/{userId}")
    public ResponseEntity<?> getBoardsForUser(@PathVariable("userId") Long userId) {
        try {
            List<Board> boards = boardService.getBoardsForUser(userId);
            return ResponseEntity.ok(boards);
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found with ID: " + userId);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while fetching boards for the user.");
        }
    }


    @GetMapping("/fetchallboardsbyteamid/{teamId}")//Added this for fetching boards to be shown for each teamLeader based on teamId.
    public ResponseEntity<?> getBoardsForTeamLead(@PathVariable("teamId") String teamId) throws TeamNotFoundException
    {

        try {
            List <Board> teamBoards = boardService.findByTeamIds(teamId);
            return new ResponseEntity<>(teamBoards, HttpStatus.OK);
        } catch (TeamNotFoundException e) {
            e.printStackTrace();
            return new ResponseEntity<>("Team not found", HttpStatus.NOT_FOUND);
        }


    }

}