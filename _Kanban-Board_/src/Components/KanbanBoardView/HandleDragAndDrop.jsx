import API from "../../Services/API";

const HandleDragAndDrop = (fetchTasks, setError, setTasks) => {
  return async (result) => {
    const { destination, source, draggableId } = result;

    // If dropped outside a droppable area
    if (!destination) return;

    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // DON'T use parseInt() for MongoDB ObjectIds - keep as string
    const taskId = draggableId;
    const newStatus = destination.droppableId;
    const oldStatus = source.droppableId;

    // Optimistic update - update UI immediately
    setTasks(prevTasks => {
      const updatedTasks = [...prevTasks];
      const taskIndex = updatedTasks.findIndex(task => task.taskId.toString() === taskId);
      
      if (taskIndex !== -1) {
        updatedTasks[taskIndex] = {
          ...updatedTasks[taskIndex],
          status: newStatus
        };
      }
      
      return updatedTasks;
    });

    try {console.log(taskId);
      // Send just the status - matches your backend expectation
      await API.put(`zenkanbanboard-taskservice/task/updatestatus/${taskId}`, {
        status: newStatus,
      });

      console.log('Task status updated successfully');
      // Optionally refresh tasks from server to ensure consistency
      // fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
      
      // Check if it's an auth error
      if (error.response?.status === 401) {
        setError('Session expired. Please log in again.');
      } else {
        setError('Failed to update task status');
      }
      
      // Revert optimistic update on error
      setTasks(prevTasks => {
        const revertedTasks = [...prevTasks];
        const taskIndex = revertedTasks.findIndex(task => task.taskId.toString() === taskId);
        
        if (taskIndex !== -1) {
          revertedTasks[taskIndex] = {
            ...revertedTasks[taskIndex],
            status: oldStatus
          };
        }
        
        return revertedTasks;
      });
    }
  };
};

export default HandleDragAndDrop;