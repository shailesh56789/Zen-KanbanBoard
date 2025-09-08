package com.example.kanbanboard.boardService.Domain;


import jakarta.persistence.*;

import java.util.List;
import java.util.Set;

@Entity
@Table(name = "board")
public class Board
{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int boardId;

    @Column(nullable = false)
    private String boardName;

    @Column(nullable = false)
    private Long assignerId;
    private String assignerName;
    @ElementCollection
    @CollectionTable(name = "board_assigned_user_ids", joinColumns = @JoinColumn(name = "board_id"))
    @Column(name = "user_id")
    private Set<Long> assignedUserIds;

    @ElementCollection
    @CollectionTable(name = "board_team_ids", joinColumns = @JoinColumn(name = "board_id"))
    @Column(name = "team_id")
    private Set<String> teamIds;

    @ElementCollection
    private List<String> boardColumns; // optional; remove if managed by TaskService

    public Board() {}

    public Board(int boardId, String boardName, Long assignerId, String assignerName, Set<Long> assignedUserIds, Set<String> teamIds, List<String> boardColumns) {
        this.boardId = boardId;
        this.boardName = boardName;
        this.assignerId = assignerId;
        this.assignerName = assignerName;
        this.assignedUserIds = assignedUserIds;
        this.teamIds = teamIds;
        this.boardColumns = boardColumns;
    }

    public int getBoardId() {
        return boardId;
    }

    public void setBoardId(int boardId) {
        this.boardId = boardId;
    }

    public String getBoardName() {
        return boardName;
    }

    public void setBoardName(String boardName) {
        this.boardName = boardName;
    }

    public Long getAssignerId() {
        return assignerId;
    }

    public void setAssignerId(Long assignerId) {
        this.assignerId = assignerId;
    }

    public String getAssignerName() {
        return assignerName;
    }

    public void setAssignerName(String assignerName) {
        this.assignerName = assignerName;
    }

    public Set<Long> getAssignedUserIds() {
        return assignedUserIds;
    }

    public void setAssignedUserIds(Set<Long> assignedUserIds) {
        this.assignedUserIds = assignedUserIds;
    }

    public Set<String> getTeamIds() {
        return teamIds;
    }

    public void setTeamIds(Set<String> teamIds) {
        this.teamIds = teamIds;
    }

    public List<String> getBoardColumns() {
        return boardColumns;
    }

    public void setBoardColumns(List<String> boardColumns) {
        this.boardColumns = boardColumns;
    }
}
