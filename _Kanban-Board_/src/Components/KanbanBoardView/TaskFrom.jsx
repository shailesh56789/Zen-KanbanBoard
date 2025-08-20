
import {
  Box, TextField, Button,
  MenuItem, Typography, Stack, Paper,
  CircularProgress,Divider,
  IconButton
} from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useState, useEffect } from "react";
import API from "../../Services/API";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const priorityOptions = ["Low", "Medium", "High"];

const TaskForm = ({ isLoading, onSubmit, statusColumns, editTask }) => 
  {
  const boardId = localStorage.getItem('selectedBoardId');
  const [userOptions, setUserOptions] = useState([]);
  
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      taskTitle: "",
      description: "",
      status: "",
      priority: "",
      dueDate: null,
      createdAt: new Date(),
      updateAt: new Date(),
      isCompleted: false,
      assignedUsers: [{ userId: "" }],
      accessId: "",
    }
  });

  const { fields: userFields, append: appendUser, remove: removeUser } = useFieldArray({
    control,
    name: "assignedUsers"
  });

  const handleClearForm = () => {
    reset({
      taskId: "",
      taskTitle: "",
      description: "",
      status: "",
      priority: "",
      dueDate: null,
      createdAt: new Date(),
      updateAt: new Date(),
      isCompleted: false,
      assignedUsers: [{ userId: "" }],
      accessId: "",
    });
  };

  useEffect(() => {
    const fetchUserOptions = async () => {
      try {
        const response = await API.get(`zenkanbanboard-userservice/user/usersbyboard/${boardId}`);
        const users = response.data.map((user) => ({
          userId: user.userId,
          userName: user.userName,
        }));
        setUserOptions(users);
        console.log(users);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUserOptions();
  }, [boardId]);

  useEffect(() => {
    if (editTask) {
      // Handle both assignedUsers (object format) and assignedUserIds (string array format)
      let assignedUsersForForm = [{ userId: "" }]; // default
      
      if (editTask.assignedUsers && Array.isArray(editTask.assignedUsers)) {
        // If assignedUsers exists as object array
        assignedUsersForForm = editTask.assignedUsers.length > 0 
          ? editTask.assignedUsers 
          : [{ userId: "" }];
      } else if (editTask.assignedUserIds && Array.isArray(editTask.assignedUserIds)) {
        // If assignedUserIds exists as string array, convert to object format
        assignedUsersForForm = editTask.assignedUserIds.length > 0
          ? editTask.assignedUserIds.map(userId => ({ userId }))
          : [{ userId: "" }];
      }
      
      reset({
        ...editTask,
        assignedUsers: assignedUsersForForm,
      });
    }
  }, [editTask, reset]);

  const availableOptions = userOptions.map(
    (user) => `${user.userName} - ${user.userId}`
  );

  return (
   <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper
        elevation={6}
        sx={{
          maxWidth: 500,
          mx: "auto",
          my: 4,
          p: 3,
          borderRadius: 3,
          backgroundColor: "#f0f6ff",
        }}
      >
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "#0a3d91",
            fontSize:"30px",
            letterSpacing: 1.2,
            fontFamily: "Georgia, serif,Arial",
            textShadow: "1px 1px 2px rgba(20, 20, 38, 0.4)",
            background: "linear-gradient(to right,rgb(224, 23, 208),rgb(77, 52, 238))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Create New Task
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={1.5}>
            <Controller
              name="taskTitle"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Task Title"
                  fullWidth
                  variant="outlined"
                  size="small"
                  {...field}
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                  size="small"
                  {...field}
                  sx={{ fontWeight: 600, color: "#222" }}
                />
              )}
            />

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  label="Status"
                  fullWidth
                  variant="outlined"
                  size="small"
                  {...field}
                >
                  {(statusColumns && statusColumns.length > 0
                    ? statusColumns
                    : []
                  ).map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  label="Priority"
                  fullWidth
                  variant="outlined"
                  size="small"
                  {...field}
                >
                  {priorityOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Controller
              name="dueDate"
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  label="Due Date"
                  value={field.value}
                  onChange={field.onChange}
                  renderInput={(params) => (
                    <TextField fullWidth size="small" {...params} />
                  )}
                />
              )}
            />

            <Controller
              name="createdAt"
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  label="Created At"
                  value={field.value}
                  onChange={field.onChange}
                  renderInput={(params) => (
                    <TextField fullWidth size="small" {...params} />
                  )}
                />
              )}
            />

            <Controller
              name="updateAt"
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  label="Updated At"
                  value={field.value}
                  onChange={field.onChange}
                  renderInput={(params) => (
                    <TextField fullWidth size="small" {...params} />
                  )}
                />
              )}
            />

            <Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={1}
              >
                <Typography variant="subtitle1" fontWeight="bold" color="primary.dark">
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
                <Box
                  key={field.id}
                  display="flex"
                  alignItems="center"
                  gap={1}
                  mb={1.5}
                >
                  <Controller
                    control={control}
                    name={`assignedUsers.${index}.userId`}
                    defaultValue={field.userId}
                    rules={{ required: "Select a user" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        label={`Assign user ${index + 1}`}
                        variant="outlined"
                        size="small"
                        fullWidth
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
                    sx={{
                      minWidth: 40,
                      height: 40,
                      opacity: userFields.length === 1 ? 0.5 : 1,
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}

              {userFields.length === 0 && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontStyle: "italic" }}
                >
                  No users assigned. Click "Add User" to assign users to this task.
                </Typography>
              )}
            </Box>

            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                type="submit"
                variant="contained"
                 disabled={isLoading}
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
               >
                {isLoading ? (
                  <>
                    Submitting...
                    <CircularProgress size={20} sx={{ ml: 1, color: "white" }} />
                  </>
                ) : (
                  "Submit Task"
                )}
              </Button>
              <Button
                variant="outlined"
                sx={{
                  px: 4,
                  color: "#004ba0",
                  borderColor: "#004ba0",
                  "&:hover": { borderColor: "#002f6c" },
                }}
                onClick={handleClearForm}
              >
                Clear
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </LocalizationProvider>
  );
};

export default TaskForm;