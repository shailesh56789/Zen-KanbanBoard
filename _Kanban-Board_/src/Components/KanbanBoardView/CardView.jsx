import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Divider,
  Tooltip,
  Snackbar,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import api from '../../Services/API';
import { useAuth } from '../../Services/AuthContext';

const CardView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {role} = useAuth();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const task = location.state?.task;

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this task?");
    if (!confirm) return;

    try {
      await api.delete(`zenkanbanboard-taskservice/task/delete/${task.taskId}`);
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Delete failed:", error);
      alert("❌ Failed to delete task.");
    }
  };

  const handleEdit = () => {
    navigate(`/cardEdit/${task.taskId}`, { state: { task } });
  };

  const handleClose = () => {
    navigate(-1);
  };

  if (!task) {
    return (
      <Typography color="error" align="center" mt={5}>
        Unable to fetch task. It may have been deleted.
      </Typography>
    );
  }

  return (
    <>
      <Card
        sx={{
          maxWidth: 600,
          margin: 'auto',
          mt: 6,
          px: 3,
          py: 2,
          position: 'relative',
          boxShadow: 8, 
          borderRadius: 4, 
          background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)', 
        }}
      >
        <Box display="flex" justifyContent="flex-end">
          <Tooltip title="Close">
            <IconButton
              onClick={handleClose}
              sx={{
                color: '#333', 
                '&:hover': { color: '#d32f2f' },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Centered Title */}
        <Typography
          variant="h5"
          fontWeight="bold"
          align="center"
          gutterBottom
          color="primary"
          sx={{
            fontFamily: 'Segoe UI, sans-serif',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)', 
          }}
        >
          {task.taskTitle || " NO TITLE "}
        </Typography>

        <Divider sx={{ mb: 2, borderColor: '#90caf9' }} /> 

        <CardContent>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            gutterBottom
            sx={{ color: '#1565c0', letterSpacing: 0.5 }} 
          >
            Description
          </Typography>
          <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
            {task.description || "No description provided."}
          </Typography>

          <Divider sx={{ my: 2, borderColor: '#90caf9' }} />

          <Box display="flex" flexDirection="column" gap={1} sx={{ color: '#333' }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Due Date:</strong>{" "}
              {new Date(task.dueDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Priority:</strong> {task.priority}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Status:</strong> {task.status}
            </Typography>
          </Box>

          {/* Action Buttons */}
          {role === "ADMIN" && (
          <Box
            display="flex"
            justifyContent="flex-end"
            gap={1}
            mt={3}
            sx={{ mt: 3, borderTop: '1px solid #ccc', pt: 2 }} 
          >
            <Tooltip title="Edit Task">
              <IconButton
                onClick={handleEdit}
                color="primary"
                sx={{
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  }, 
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Task">
              <IconButton
                onClick={handleDelete}
                color="error"
                sx={{
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  }, 
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
          )}
        </CardContent>
      </Card>

      {/* Snackbar for delete success */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)} sx={{ width: '100%' }}>
          ✅ Task deleted successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default CardView;
