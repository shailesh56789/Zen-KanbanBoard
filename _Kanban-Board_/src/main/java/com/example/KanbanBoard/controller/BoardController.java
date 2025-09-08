package com.example.KanbanBoard.controller;

import com.example.KanbanBoard.domain.Board;
import com.example.KanbanBoard.domain.User;
import com.example.KanbanBoard.exception.BoardAlreadyExistsException;
import com.example.KanbanBoard.exception.TeamNotFoundException;
import com.example.KanbanBoard.exception.UserNotFoundException;
import com.example.KanbanBoard.service.BoardServiceImpl;
import com.example.KanbanBoard.service.IUserService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/board")
public class BoardController {

    private BoardServiceImpl boardService;
    private IUserService userService;

    @Autowired
    public BoardController(BoardServiceImpl boardService, IUserService userService) {
        this.boardService = boardService;
        this.userService = userService;
    }




    private String extractConstraintMessage(DataIntegrityViolationException e) {
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
    public ResponseEntity<Object> updateBoard(@PathVariable int boardId, @RequestBody Board board) {
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
    public ResponseEntity<Object> fetchBoardById(@PathVariable int boardId){
        return new ResponseEntity<>(boardService.getBoardById(boardId),HttpStatus.OK);

    }

    @GetMapping("fetchbyname/{boardName}")
    public ResponseEntity<Board> fetchBoardByName(@PathVariable String boardName){
        return new ResponseEntity<>(boardService.getBoardByName(boardName),HttpStatus.OK);
    }

    @GetMapping("fetchbyassignee/{assigneeId}")
    public ResponseEntity<List<Board>> fetchBoardsByAssignee(@PathVariable Long assigneeId){
        return new ResponseEntity<>(boardService.getBoardsByAssignee(assigneeId),HttpStatus.OK);
    }

    @GetMapping("fetchbyassigneduserIds/{assignedUserIds}")
    public ResponseEntity<List<Board>> fetchBoardByUser(@PathVariable Long assignedUserIds){
        return new ResponseEntity<>(boardService.getBoardByUser(assignedUserIds),HttpStatus.OK);
    }

    @GetMapping("fetchuser/{boardId}/{assignedUserIds}")
    public ResponseEntity<Boolean> isBoardContainsUser(@PathVariable int boardId, @PathVariable Long assignedUserIds){
        return new ResponseEntity<>(boardService.isBoardContainsUser(boardId,assignedUserIds),HttpStatus.OK);
    }

    @DeleteMapping("/deletebyid/{boardId}")
    public ResponseEntity<Boolean> deleteBoardById(@PathVariable int boardId){
        boolean deleted = boardService.deleteByBoardId(boardId);
        if(deleted){
            return new ResponseEntity<>(true,HttpStatus.OK);
        }
        return new ResponseEntity<>(false,HttpStatus.BAD_REQUEST);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Boolean> deleteAllBoards(){
        boolean deleted =  boardService.deleteAllBoards();
        if(deleted){
            return new ResponseEntity<>(true,HttpStatus.OK);
        }
        return new ResponseEntity<>(false,HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/fetchallboardsbyuserid/{userId}")//Added this for fetching boards to be shown for each users based on userBoardsId.
    public ResponseEntity<?> getBoardsForUser(@PathVariable Long userId) throws UserNotFoundException
    {
        User user;
        try {
            user = userService.findUserById(userId);
        } catch (UserNotFoundException e) {
            e.printStackTrace();
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);

        }

        List<Board> boards = boardService.getBoardsForUser(user.getUserBoards());
        return new ResponseEntity<>(boards, HttpStatus.OK);
    }

    @GetMapping("/fetchallboardsbyteamid/{teamId}")//Added this for fetching boards to be shown for each teamLeader based on teamId.
    public ResponseEntity<?> getBoardsForTeamLead(@PathVariable String teamId) throws TeamNotFoundException
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