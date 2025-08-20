import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Paper,
  IconButton,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import API from "../../Services/API";
import CustomSnackbar from "../BoardForm/CustomSnackbar";

const TaskStatusUpdate = () => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      status: "",
    },
  });

  const location = useLocation();
  const navigate = useNavigate();
  const boardId = localStorage.getItem("selectedBoardId");
  const [taskData, setTaskData] = useState(null);
  const [statusColumns, setStatusColumns] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

 useEffect(() => { 
  if (location.state?.task) {
    const task = location.state.task;
    setTaskData(task);
    reset();  
  }
}, [location.state, reset]);

  useEffect(() => {
    const fetchBoardColumns = async () => {
      try {
        const response = await API.get(`zenkanbanboard-boardservice/board/fetchbyid/${boardId}`);
        setStatusColumns(response.data.boardColumns || []);
      } catch (error) {
        console.error('Failed to fetch board columns:', error);
      }
    };
    fetchBoardColumns();
  }, [boardId]);


  const onSubmit = async (formData) => {
    if (!taskData) return;
    setIsLoading(true);
    
    try {
      const payload = {
        taskId: taskData.taskId,

        status: formData.status,
        updatedAt: new Date().toISOString(),
      };
    
      await API.put(`zenkanbanboard-taskservice/task/updatestatus/${taskData.taskId}`, payload);
      setSnackbarMessage("✅ Task status updated successfully!");
      setSnackbarOpen(true);
      setTimeout(() => navigate(`/boards/${boardId}/tasks`), 2000);
    } catch (error) {
      console.error("Failed to update task status:", error);
      setSnackbarMessage("❌ Failed to update task status.");
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
   <Paper
      elevation={4}
      sx={{
        maxWidth: 500,
        margin: "60px auto 80px auto", 
        padding: 3,
        borderRadius: 4,
        backgroundColor: "#f5f9ff",
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight="bold" color="#003f88">
          STATUS UPDATE
        </Typography>
        <IconButton onClick={() => navigate(-1)} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        {taskData && (
          <>
            <TextField
              label="Title"
              value={taskData.taskTitle || ""}
              fullWidth
              margin="dense"
              InputProps={{ readOnly: true }}
              size="small"
              sx={{ mb: 1 }}
            />
            <TextField
              label="Description"
              value={taskData.description}
              fullWidth
              multiline
              rows={2}
              margin="dense"
              InputProps={{ readOnly: true }}
              size="small"
              sx={{ mb: 1 }}
            />
            <TextField
              label="Due Date"
              value={new Date(taskData.dueDate).toLocaleDateString()}
              fullWidth
              margin="dense"
              InputProps={{ readOnly: true }}
              size="small"
              sx={{ mb: 1 }}
            />
          </>
        )}

        <Controller
          name="status"
          control={control}
          rules={{ required: "Status is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Status"
              fullWidth
              margin="dense"
              size="small"
              error={!!errors.status}
              helperText={errors.status?.message}
              sx={{ mb: 2 }}
            >
              {statusColumns.map((col, index) => (
                <MenuItem key={index} value={col}>
                  {col}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        <Box textAlign="center" mt={2}>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{
              px: 4,
              fontSize: "0.9rem",
              background: "linear-gradient(90deg,rgb(82, 150, 227),rgb(6, 52, 111))",
              boxShadow: "0 4px 12px rgba(3, 3, 4, 0.3)",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "8px",
              "&:hover": {
                background: "linear-gradient(90deg, #0d68c1, #0a2042)",
              },
            }}
          >
            {isLoading ? "Updating..." : "Update Status"}
          </Button>
        </Box>
      </form>

      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={() => setSnackbarOpen(false)}
      />
    </Paper>
  );
};

export default TaskStatusUpdate;