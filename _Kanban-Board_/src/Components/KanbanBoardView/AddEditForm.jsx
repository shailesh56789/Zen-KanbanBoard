import { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import CustomSnackbar from "../BoardForm/CustomSnackbar";
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
import API from "../../Services/API";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


const AddEditForm = () => {
  const { control, handleSubmit, setValue, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: "",
      description: "",
      priority: "",
      status: "",
      dueDate: "",
      assignedUsers: [{ userId: "" }],
    }
  });

  

  const { fields: userFields, append: appendUser, remove: removeUser } = useFieldArray({
    control,
    name: "assignedUsers"
  });

  const location = useLocation();
  const navigate = useNavigate();
  const [statusColumns, setStatusColumns] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [taskData, setTaskData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const boardId = localStorage.getItem('selectedBoardId');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");


  useEffect(() => {
    if (location.state?.task) {
      setTaskData(location.state.task);
    }
  }, [location.state]);

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

  useEffect(() => {
    const fetchUserOptions = async () => {
      try {
        const response = await API.get(`zenkanbanboard-userservice/user/usersbyboard/${boardId}`);
        const users = response.data.map((user) => ({
          userId: String(user.userId),
          userName: user.userName,
        }));
        setUserOptions(users);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUserOptions();
  }, [boardId]);

  useEffect(() => {
    if (!taskData || userOptions.length === 0) return;

    const assignedUsersForForm = (taskData.assignedUserIds || []).map((id) => {
      const match = userOptions.find((u) => u.userId === String(id));
      return {
        userId: match ? `${match.userName} - ${match.userId}` : ""
      };
    });

    reset({
      title: taskData.taskTitle || "",
      description: taskData.description || "",
      priority: taskData.priority || "",
      status: taskData.status || "",
      dueDate: taskData.dueDate ? taskData.dueDate.substring(0, 10) : "",
      assignedUsers: assignedUsersForForm.length > 0 ? assignedUsersForForm : [{ userId: "" }]
    });
  }, [taskData, userOptions, reset]);

  const availableOptions = userOptions.map(
    (user) => `${user.userName} - ${user.userId}`
  );

  const onSubmit = async (formData) => {
    setIsLoading(true);

    try {
      const transformedData = {
        ...taskData,
        taskTitle: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        dueDate: formData.dueDate,
        updatedAt: new Date().toISOString(),
        assignedUserIds: formData.assignedUsers
          ?.filter((user) => user.userId && user.userId.trim() !== "")
          .map((user) => {
            const parts = user.userId.split(" - ");
            return parts[1]; // extract just ID part
          }) || []
      };

      await API.put("zenkanbanboard-taskservice/task/update", transformedData);
      setSnackbarMessage("✅ Task updated successfully");
      setSnackbarOpen(true);
      setTimeout(() => {
      navigate(`/boards/${boardId}/tasks`);
     }, 2500);
    } catch (error) {
      console.error("Update failed:", error.response?.data || error.message);
      setSnackbarMessage("❌ Failed to update task.");
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper sx={{ maxWidth: 500, margin: "auto", mt: 4, mb:6, p: 2, pb:6, borderRadius: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        
        <Typography variant="h4"
          sx={{
            textAlign: "center",
            fontWeight: 800,
            mb: 3,
            color: "#0a3d91",
           textShadow: "1px 1px 2px rgba(157, 157, 210, 0.4)",
            
          }}>
          {taskData ? "Edit Task" : "Add New Task"}
        </Typography>
        <IconButton onClick={() => navigate(-1)}>
          <CloseIcon />
        </IconButton>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="title"
          control={control}
          rules={{ required: "Title is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Title"
              fullWidth
              margin="normal"
              size="small"
              error={!!errors.title}
              helperText={errors.title?.message}
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          rules={{ required: "Description is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Description"
              fullWidth
              multiline
              rows={3}
              margin="normal"
              size="small"
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          )}
        />

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
              margin="normal"
              size="small"
              error={!!errors.status}
              helperText={errors.status?.message}
            >
              {statusColumns.map((col, index) => (
                <MenuItem key={index} value={col}>
                  {col}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        <Controller
          name="priority"
          control={control}
          rules={{ required: "Priority is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Priority"
              fullWidth
              margin="normal"
              size="small"
              error={!!errors.priority}
              helperText={errors.priority?.message}
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </TextField>
          )}
        />

        <Controller
          name="dueDate"
          control={control}
          rules={{ required: "Due date is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Due Date"
              fullWidth
              type="date"
              margin="normal"
              size="small"
              error={!!errors.dueDate}
              helperText={errors.dueDate?.message}
              InputLabelProps={{ shrink: true }}
            />
          )}
        />

        {/* Assigned Users Section */}
        <Box mt={3}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="subtitle1" fontWeight="bold" color="#1A237E">
              Assigned Users
            </Typography>
            <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => appendUser({ userId: "" })}
                  sx={{
                    fontSize: "0.75rem",
                    padding: "2px 8px",
                    minWidth: "auto",
                    background: "linear-gradient(45deg,rgb(62, 142, 254),rgb(170, 110, 170))",
                    color: "white",
                    border: "none",
                    "&:hover": {
                      background: "linear-gradient(45deg,rgb(145, 185, 230),rgb(241, 227, 244))",
                    },
                  }}
                >
              Add User
            </Button>
          </Box>

          {userFields.map((field, index) => (
            <Box key={field.id} display="flex" alignItems="center" gap={1} mb={2}>
              <Controller
                control={control}
                name={`assignedUsers.${index}.userId`}
                defaultValue={field.userId}
                rules={{ required: "Select a user" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label={`User ${index + 1}`}
                    fullWidth
                    size="small"
                    error={!!errors.assignedUsers?.[index]?.userId}
                    helperText={errors.assignedUsers?.[index]?.userId?.message}
                  >
                    <MenuItem value="">-- Select User --</MenuItem>
                    {availableOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <IconButton
                color="error"
                onClick={() => removeUser(index)}
                disabled={userFields.length === 1}
                sx={{ minWidth: 40, height: 40 }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
        </Box>

        <Box textAlign="center" mt={3} mb={4}>
          <Button
                          type="submit"
                          variant="contained"
                          sx={{
                            px: 4,
                            background: "linear-gradient(90deg, #003f88,rgb(3, 49, 117))",
                            boxShadow: "0 4px 10px rgba(0, 63, 136, 0.4)",
                            color: "white",
                            fontWeight: 600,
                            "&:hover": {
                              background: "linear-gradient(90deg,rgb(108, 151, 207), #000f2d)",
                            },
                          }}
                           disabled={isLoading}>
            {isLoading ? "Updating..." : taskData ? "Update Task" : "Create Task"}
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

export default AddEditForm;