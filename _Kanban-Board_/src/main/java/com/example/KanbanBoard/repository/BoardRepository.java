package com.example.KanbanBoard.repository;

import com.example.KanbanBoard.domain.Board;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Set;

public interface BoardRepository extends JpaRepository<Board,Integer> {

    Board findByBoardName(String boardName);
    Board findByBoardId(int boardId);
    List<Board> findByAssigneeId(Long assigneeId);
    List<Board> findByAssignedUserIdsContaining( Long assignedUserIds);
    boolean existsByBoardIdAndAssignedUserIdsContaining(int boardId,  Long assignedUserIds);
    List<Board> findByBoardIdIn(Set<Integer> boardIds);
    List<Board> findByTeamIds(String teamId);
}
