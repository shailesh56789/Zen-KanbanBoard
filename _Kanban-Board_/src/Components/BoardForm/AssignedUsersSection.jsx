import React from "react";
import {
  Box,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { Controller } from "react-hook-form";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const AssignedUsersSection = ({
  control,
  register,
  userFields,
  appendUser,
  removeUser,
  teamMembers,
  errors,
}) => {
  const availableOptions = teamMembers.map(
    (user) => `${user.userName} - ${user.userId}`
  );

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight="bold">
        Assigned Users
      </Typography>

      {userFields.map((field, index) => (
        <Box key={field.id} display="flex" alignItems="center" mb={1}>
          <Controller
            control={control}
            name={`assignedUsers.${index}.userId`}
            defaultValue={field.userId}
            rules={{ required: "Select a user" }}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Select User"
                size="small"
                fullWidth
                error={!!errors.assignedUsers?.[index]?.userId}
                helperText={errors.assignedUsers?.[index]?.userId?.message}
              >
                <MenuItem value="">-- Select --</MenuItem>
                {availableOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          {userFields.length > 1 && (
            <IconButton
              color="error"
              onClick={() => removeUser(index)}
              sx={{ ml: 1 }}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      ))}

      <IconButton
        color="primary"
        onClick={() => appendUser({ userId: "" })}
        sx={{ mt: 1 }}
      >
        <AddIcon />
      </IconButton>
    </Box>
  );
};

export default AssignedUsersSection;
