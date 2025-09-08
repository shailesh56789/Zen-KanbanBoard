package com.example.KanbanBoard.domain;

import jakarta.persistence.*;

import java.util.List;
import java.util.Set;

@Entity
@Table(name = "board")
public class Board {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int boardId;

    @Column(nullable = false)//Removed unique
    private String boardName;

    private Long assigneeId;
    private String assigneeName;

    @ElementCollection
    @CollectionTable(name = "board_assigned_user_ids", joinColumns = @JoinColumn(name = "board_id"))
    @Column(name = "user_id")
    private Set<Long> assignedUserIds;

    @ElementCollection
    @CollectionTable(name = "board_team_ids", joinColumns = @JoinColumn(name = "board_id"))
    @Column(name = "team_id")
    private Set<String> teamIds;

    @ElementCollection
    private List<String> tasks;
    @ElementCollection
    private List<String> boardColumns;

    public Board(int boardId, String boardName, Long assigneeId, String assigneeName,
                 Set<Long> assignedUserIds, Set<String> teamIds, List<String> tasks, List<String> boardColumns) {
        this.boardId = boardId;
        this.boardName = boardName;
        this.assigneeId = assigneeId;
        this.assigneeName = assigneeName;
        this.assignedUserIds = assignedUserIds;
        this.teamIds = teamIds;
        this.tasks = tasks;
        this.boardColumns = boardColumns;
    }

    public Board() {
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

    public Long getAssigneeId() {
        return assigneeId;
    }

    public void setAssigneeId(Long assigneeId) {
        this.assigneeId = assigneeId;
    }

    public String getAssigneeName() {
        return assigneeName;
    }

    public void setAssigneeName(String assigneeName) {
        this.assigneeName = assigneeName;
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

    public List<String> getTasks() {
        return tasks;
    }

    public void setTasks(List<String> tasks) {
        this.tasks = tasks;
    }

    public List<String> getBoardColumns() {
        return boardColumns;
    }

    public void setBoardColumns(List<String> boardColumns) {
        this.boardColumns = boardColumns;
    }

    @Override
    public String toString() {
        return "Board{" +
                "boardId=" + boardId +
                ", boardName='" + boardName + '\'' +
                ", assigneeId=" + assigneeId +
                ", assigneeName='" + assigneeName + '\'' +
                ", assignedUserIds=" + assignedUserIds +
                ", TeamIds=" + teamIds +
                ", tasks=" + tasks +
                ", boardColumns=" + boardColumns +
                '}';
    }
}