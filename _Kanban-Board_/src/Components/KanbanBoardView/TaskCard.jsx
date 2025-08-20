import React, { useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UpdateIcon from '@mui/icons-material/Edit';
import API from '../../Services/API';
import { useAuth } from '../../Services/AuthContext';
import FlagIcon from '@mui/icons-material/Flag';
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CustomSnackbar from "../BoardForm/CustomSnackbar";

import {
  Card, CardContent, Typography, Box, Stack,
  Tooltip, IconButton
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
//import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
//import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Link,useNavigate } from "react-router-dom";

const TaskCard = ({ dss, onDelete }) => 
  {
  const navigate = useNavigate();
  const {role} = useAuth();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [taskUsers,setTaskUsers] = useState([]);

  //fetching assigned users here to show on cards
 useEffect(() =>
  {
  const fetchTaskUsers = async () => {
    if (!dss?.assignedUserIds?.length) return;
    
    try {
      const userRequests = dss.assignedUserIds.map((userId) =>
        API.get(`zenkanbanboard-userservice/user/fetchbyid/${userId}`)
      );
      const responses = await Promise.all(userRequests);
      const userNames = responses.map((res) => res.data.userName);
      setTaskUsers(userNames);
    } catch (error) {
      console.error("Failed to fetch user names:", error);
    }
  };

  fetchTaskUsers();
}, [dss?.assignedUserIds]);


  if (!dss) return <div>Loading task...</div>;

  const isOverdue = new Date(dss.dueDate) < new Date();   //checks tasks due date is passed
  const handleDelete = async (e) => {
    e.stopPropagation();
    e.preventDefault();  // Prevent drag from starting
    try {
      await API.delete(`zenkanbanboard-taskservice/task/delete/${dss.taskId}`);
      setSnackbarMessage("Task deleted successfully!");
       setSnackbarOpen(true);

     setTimeout(() => {
     if (onDelete) onDelete(dss.taskId);
     }, 1000);  

    } catch (error) {
      console.error("Delete failed:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please log in again.");
      } else {
        alert("Failed to delete task. Please try again.");
      }
    }
   };

  const handleUpdate = (e) => {
    e.stopPropagation();
    e.preventDefault();
    navigate(`/cardEdit/${dss.taskId}`, { state: { task: dss } });
  };

  // Handle card click for navigation - but only if not dragging
  const handleCardClick = (e) => {
    // Only navigate if the click wasn't on a button
    if (e.target.closest('button')) return;
    navigate(`/card/${dss.taskId}`, { state: { task: dss } });
  };
  

   const handleStatusUpdate = (e) => {          //navigate to the status update form for the user
    e.stopPropagation();
    e.preventDefault();
    navigate(`/task/status-update/${dss.taskId}`, { state: { task: dss } }); 
    };



  const priorityColors = {         //added colors priority
    High: '#d32f2f',
    Medium: '#f57c00',
    Low: '#fbc02d',
  };

   const priorityColor = priorityColors[dss.priority] || '#999';  //give the color based on the priority

  

   return (
    <>
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 3,
        backgroundColor: 'rgb(209, 250, 250)',
        padding: 2,
        cursor: "grab", // Change cursor to indicate draggable
        '&:active': {
          cursor: 'grabbing'
        },
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: 6
        }
      }}
      onClick={handleCardClick}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {dss.taskTitle}
        </Typography>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <FlagIcon fontSize="small" sx={{ color: priorityColor }} />
          <Typography variant="body2" sx={{ fontWeight: 600, color: "#222" }}>
            {dss.priority}
          </Typography>
        </Stack>
      </Box>

      {isOverdue && (
        <Typography variant="caption" color="error" sx={{ fontWeight: 600 }}>
          ⚠️ Due date has passed!
        </Typography>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <AccessTimeIcon fontSize="small" sx={{ color: "#444", mr: 0.5 }} />
        <Typography variant="body2" color="#333">
          {new Date(dss.dueDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </Typography>
      </Box>

       {/* Assigned Users */}
     {taskUsers.length > 0 && (
       <Box sx={{ mt: 2 }}>
         <Typography variant="caption" sx={{ color: '#666', fontWeight: 500, mb: 1, display: 'block' }}>
           Assigned to:
         </Typography>
         <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
           {taskUsers.map((user, index) => (
             <Box
               key={index}
               sx={{
                 backgroundColor: 'rgba(6, 69, 163, 0.1)',
                 color: 'rgb(6, 69, 163)',
                 padding: '2px 8px',
                 borderRadius: '12px',
                 fontSize: '0.75rem',
                 fontWeight: 500,
                 border: '1px solid rgba(6, 69, 163, 0.2)'
               }}
             >
               {user}
             </Box>
           ))}
         </Box>
       </Box>
     )}

      {/* Action buttons - with onMouseDown to prevent drag conflicts
      <div 
        style={{ 
          display: 'flex', 
          gap: 20, 
          alignItems: 'center', 
          padding: '8px',
          background: 'rgba(0,0,0,0.02)' // Slight background to separate from drag area
        }}
        onMouseDown={(e) => e.stopPropagation()} // Prevent drag start on button area
      > */}

      <Box sx={{ display: 'flex', justifyContent: 'space', mt: 1 }}>
        {role === "ADMIN" && (
        <Tooltip title="Edit">
          <IconButton
            onClick={handleUpdate}
            aria-label="edit"
            sx={{
              color: 'rgb(6, 69, 163)',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.1)',
                color: '#0d47a1'
              }
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
           )}
           {role === "ADMIN" && (
        <Tooltip title="Delete">
          <IconButton
            onClick={handleDelete}
            aria-label="delete"
            sx={{
              color: '#d32f2f',
              transition: 'transform 0.2s',
              '&:hover': {
              transform: 'scale(1.1)',
              color: '#b71c1c'
              }
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
           )
           }

         {role!== "ADMIN" && (   
        <Tooltip title="Edit">
          <IconButton
            onClick={handleStatusUpdate}
            aria-label="Edit"
            sx={{
              color: 'rgb(6, 69, 163)',
              transition: 'transform 0.2s',
              '&:hover': {
              transform: 'scale(1.1)',
              color: '#0d47a1'
              }
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
         )}
       </Box>
      </Card>
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
       onClose={() => setSnackbarOpen(false)}
      />
    </>
  );
};

export default TaskCard;
