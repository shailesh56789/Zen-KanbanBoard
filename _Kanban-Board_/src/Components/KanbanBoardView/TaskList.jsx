import React, { useEffect, useState, useCallback } from 'react';
import TaskCard from './TaskCard';
import TaskForm from './TaskFrom';
import { Button } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import HandleDragAndDrop from './HandleDragAndDrop';
import API from '../../Services/API';
import { useAuth } from '../../Services/AuthContext';
import { Box } from '@mui/material';


const TaskList = () => {
  const [isLoading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const [editTask, setEditTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const{role} = useAuth();
  const [snackbarType, setSnackbarType] = useState("success"); 


  // fetching board details
  const [boardName, setBoardName] = useState('');
  const [statusColumns, setStatusColumns] = useState([]);
  //to avoid duplicate task title
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const boardId = localStorage.getItem('selectedBoardId'); //fetch boardId

  const fetchTasks = useCallback(async () => {
    try {
      const response = await API.get(`zenkanbanboard-taskservice/task/taskbyboard/${boardId}`); //add task only to the specific board
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to fetch tasks');
    }
  }, [boardId]);

  //fetch board details
  const fetchBoardDetails = useCallback(async () => {
    try {
      const response = await API.get(`zenkanbanboard-boardservice/board/fetchbyid/${boardId}`);
      setBoardName(response.data.boardName);
      setStatusColumns(response.data.boardColumns);
    } catch (error) {
      console.error('Error fetching board details:', error);
      setError('Failed to fetch board info');
    }
  }, [boardId]);

  useEffect(() => {
    fetchTasks();
    fetchBoardDetails(); //get boardName and columns
  }, [fetchTasks, fetchBoardDetails]);

  // Updated to pass setTasks as well
  const handleDragEnd = HandleDragAndDrop(fetchTasks, setError, setTasks);

  const handleDeleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.taskId !== id));
  };

  //fetch task according to the board
  const handleFormSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const transformedData = {
  ...data,
  boardId,
  // Convert assignedUsers array to extract just the userId from "userName - userId" format
  assignedUserIds: data.assignedUsers
    ? data.assignedUsers
        .filter(user => user.userId && user.userId.trim() !== "")
        .map(user => {
          // Extract userId from "userName - userId" format
          const parts = user.userId.split(' - ');
          return parts.length > 1 ? parts[1] : user.userId;
        })
    : []
};

       delete transformedData.assignedUsers;

    const response = await API.post('zenkanbanboard-taskservice/task/createtask', transformedData);
    setTasks((prev) => [...prev, response.data]);
    setEditTask(null);
    setShowForm(false);
    setSnackbarMessage("✅ Task created successfully!");
   setSnackbarType("success");
    setOpenSnackbar(true);

    

    setTimeout(() => {
      setOpenSnackbar(false);
      setShowForm(false); 
    }, 2500);

  } catch (error) {
    if (error.response && error.response.status === 409) {
      setSnackbarMessage(error.response.data.message || "❌ Task Title Already Exists ");
    } else {
      setSnackbarMessage("Something went wrong. Please try again.");
    }
    setOpenSnackbar(true);
    setTimeout(() => setOpenSnackbar(false), 3000);
  }
  setLoading(false);
};

  const handleAddNew = () => {
    setEditTask(null);
    setShowForm((prev) => !prev);
  };

const priorityOrder = { High: 1, Medium: 2, Low: 3 };          //for sorting based on priority

const groupedTasks = statusColumns.reduce((acc, status) => {
  acc[status] = tasks
    .filter(task => task.status === status)
    .sort((a, b) => (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4));
  return acc;
}, {});


  return (
     <div
  style={{
    padding: '20px',
    minHeight: '100vh',
    background: 'linear-gradient(to right,rgb(248, 232, 251),rgb(209, 232, 249))', // Soft light background
    backgroundAttachment: 'fixed',
    transition: 'background 0.3s ease-in-out',
  }}
>
      {/* show dynamic board name */}
       <h2
  style={{
    fontSize: '2.3rem',
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: '30px',
    background: 'linear-gradient(90deg, #0f172a, #1e40af,rgb(50, 151, 88), #7e22ce)', // black, dark blue, green, purple
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '2px 2px 6px rgba(19, 50, 66, 0.3)', // slight shadow for lift
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  }}
   >{`${boardName}`}</h2>

     {role === 'ADMIN' && (
  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', mt: 2, mb: 2 }}>
    <Button
      variant="contained"
      onClick={handleAddNew}
      sx={{
        backgroundColor: 'rgba(226, 140, 222, 0.3)',
        '&:hover': { backgroundColor: 'rgba(150, 158, 241, 0.3)' },
        fontWeight: 'bold',
        borderRadius: '8px',
        color:'black',
        boxShadow: '0 2px 6px rgba(30, 58, 138, 0.3)',
        padding: '8px 20px',
      }}
    >
      {showForm ? 'Close Form' : '+ Add New Task'}
    </Button>
  </Box>
)}


      {showForm && (
        <TaskForm 
          isLoading={isLoading} 
          onSubmit={handleFormSubmit} 
          editTask={editTask} 
          statusColumns={statusColumns}  
          existingTaskTitles={tasks.map(task => task.taskTitle)} 
        />
      )}

      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'nowrap',
          gap: '20px',
          padding: '30px 40px',
          overflowX: 'auto',
          maxWidth: '1200px',
          margin: '0 auto',
       }}
       >

          {statusColumns.map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    minWidth: '250px',
                    flex: '1',
                    background: snapshot.isDraggingOver ? '#d0e6ff' : '#f4f4f4',
                    padding: '10px',
                    borderRadius: '8px',
                    boxShadow: '0 0 5px rgba(0,0,0,0.1)',
                    transition: 'background-color 0.3s ease',
                    minHeight: '400px',
                  }}
                >
                  <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                   <h3
                     style={{
                       fontSize: '1.3rem',
                       fontWeight: '900',
                       fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                       color: '#312e81', 
                       marginBottom: '6px',
                   }}
                  >
                {status}
               </h3>
                </div>

                  {groupedTasks[status]?.map((task, index) => (
                    <Draggable
                      key={task.taskId.toString()}
                      draggableId={task.taskId.toString()}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            userSelect: 'none',
                            marginBottom: 8,
                            background: snapshot.isDragging ? '#bbdefb' : 'white',
                            borderRadius: '4px',
                            boxShadow: snapshot.isDragging 
                              ? '0 4px 8px rgba(0,0,0,0.3)' 
                              : '0 1px 3px rgba(0,0,0,0.2)',
                            transform: snapshot.isDragging 
                              ? 'rotate(5deg)' 
                              : 'none',
                            transition: !snapshot.isDragging 
                              ? 'transform 0.2s ease' 
                              : 'none',
                            ...provided.draggableProps.style,
                          }}
                        >
                          <TaskCard
                            dss={task}
                            onDelete={handleDeleteTask}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {openSnackbar && (
        <div style={{
           position: 'fixed',
           top: '20px',
           left: '50%',
           transform: 'translateX(-50%)',
           backgroundColor: snackbarType === "success" ? 'rgb(241, 245, 246)' : 'rgb(238, 245, 246)',
           color: snackbarType === "success" ? 'rgb(2, 29, 36)' : 'rgb(183, 8, 2)',
           border: snackbarType === "success" ? '1px solid green' : '1px solid red',
           padding: '12px 24px',
           borderRadius: '6px',
           fontWeight: 'bold',
           boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
           zIndex: 9999,
           transition: 'all 0.3s ease-in-out'
        }}>
          {snackbarMessage}
        </div>
      )}
    </div>
  );
};

export default TaskList;