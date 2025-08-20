import { useEffect, useState } from "react";
import { useAuth } from "../../Services/AuthContext";

import {
  Box,
  TextField,
  Stack,
  Container,
  Typography,
  Paper,
} from "@mui/material";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import api from "../../Services/API";
import AssignerInfoSection from "./AssignerInfoSection";
import AssignedUsersSection from "./AssignedUsersSection";
import BoardColumnsSection from "./BoardColumnsSection";
import FormButtons from "./FormButtons";
import CustomSnackbar from "./CustomSnackbar";
import API from "../../Services/API";

const CreateBoardForm = ({ onSubmit = () => {}, editData, onSuccess = () => {} }) => 
  {
    const [originalAssignedUserIds, setOriginalAssignedUserIds] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const {userId,teamId } = useAuth();
    
     
    const {
    control,
    handleSubmit,
    reset,
    setValue,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      boardName: "",
      assigneeId: "",
      assigneeName: "",
      assignedUsers: [{ userId: "" }],
      boardColumns: [],
      teamId: "", // Add teamId to default values
    },
  });

  const {
    fields: userFields,
    append: appendUser,
    remove: removeUser,
  } = useFieldArray({
    control,
    name: "assignedUsers",
  });

  const {
    fields: columnFields,
    append: appendColumn,
    remove: removeColumn,
  } = useFieldArray({
    control,
    name: "boardColumns",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [assignerInfo, setAssignerInfo] = useState({ id: "", name: "" });

  
  //Fetching users by team Id to use in Boards assigned Users section.
  useEffect(() => {
  async function fetchUsers() {
    try 
    {
      // const response = await API.get(`user/usersbyteam/${teamId}`); 
      const response = await API.get(`zenkanbanboard-userservice/user/usersbyteam/${teamId}`); 
      
      const filteredTeamData = response.data 
       .map(user=>({
        userId:user.userId.toString(),
        userName:user.userName.toString()
    }));
    
      setTeamMembers(filteredTeamData);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }
  fetchUsers();
}, [userId, teamId]);


  


 useEffect(() => {

  //Leave this it is to fetch assigner data based on Token
  const token = localStorage.getItem("token");
  if (token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const assignerId = payload.userId?.toString() || "";
    const assignerName = payload.userName || "";
    
    setAssignerInfo({ id: assignerId, name: assignerName });
    setValue("assigneeId", assignerId);
    setValue("assigneeName", assignerName);
    setValue("teamId", teamId);// Set teamId from auth context
  }
  
  if (editData && teamMembers.length > 0) { // Wait for teamMembers to load
    setValue('boardName', editData.boardName || '');
    setValue('assigneeId', editData.assigneeId?.toString() || assignerInfo.id);
    setValue('assigneeName', editData.assigneeName || assignerInfo.name);
    setValue("teamId", teamId);// Set teamId from auth context while in edit mode.
    
     // Store original assigned user IDs for comparison later
   if (editData.assignedUserIds && editData.assignedUserIds.length > 0) {
      setOriginalAssignedUserIds([...editData.assignedUserIds.map(id => parseInt(id))]);
    } else {
      setOriginalAssignedUserIds([]);
    }  



    // Map assigned user IDs to the dropdown format "Name - ID"
    if (editData.assignedUserIds && editData.assignedUserIds.length > 0) {
      const assignedUsersFormatted = editData.assignedUserIds.map(id => {
        // Find the user in teamMembers array
         const userEntry = teamMembers.find(member => member.userId === id.toString());
        return {
          userId: userEntry 
            ? `${userEntry.userName} - ${userEntry.userId}` // Format as "Name - ID"
            : `Unknown - ${id}` // Fallback if user not found
        };
      });
      setValue('assignedUsers', assignedUsersFormatted);
    } else {
      setValue('assignedUsers', [{ userId: '' }]);
    }
    
    setValue(
      'boardColumns',
      editData.boardColumns?.map(col => ({ value: col })) || [{ value: '' }]
    );
    setValue(
      'tasks',
      editData.tasks?.map(task => ({ value: task })) || [{ value: '' }]
    );
  }
}, [editData, setValue, assignerInfo.id, assignerInfo.name, teamMembers,teamId]); // Add teamMembers dependency


 // Function to find users that were removed from the board
    const findRemovedUsers = (originalUserIds, updatedUserIds) => {
    const originalSet = new Set(originalUserIds.map(id => parseInt(id)));
    const updatedSet = new Set(updatedUserIds.map(id => parseInt(id)));
    
    // Find users who were in original list but not in updated list
    const removedUsers = [...originalSet].filter(userId => !updatedSet.has(userId));
    
    console.log('Original assigned users:', [...originalSet]);
    console.log('Updated assigned users:', [...updatedSet]);
    console.log('Removed users:', removedUsers);
    
    return removedUsers;
  };
   // Function to find users that were newly added to the board
  const findAddedUsers = (originalUserIds, updatedUserIds) => {
    const originalSet = new Set(originalUserIds.map(id => parseInt(id)));
    const updatedSet = new Set(updatedUserIds.map(id => parseInt(id)));
    
    // Find users who are in updated list but not in original list
    const addedUsers = [...updatedSet].filter(userId => !originalSet.has(userId));
    
    console.log('Newly added users:', addedUsers);
    
    return addedUsers;
  };
   // Function to update userBoards for newly added users
  const updateUserBoardsForAddedUsers = async (boardId, addedUserIds) => {
    if (!addedUserIds || addedUserIds.length === 0) {
      return [];
    }

    console.log(`Updating userBoards for ${addedUserIds.length} newly added users...`);
    
    const updatePromises = addedUserIds.map(async (userId) => {
      try {
        // API call to add boardId to user's userBoards
        await api.put(`zenkanbanboard-userservice/user/foruser/${userId}/addboard/${boardId}`);
        
        console.log(`Successfully added board ${boardId} to user ${userId}'s userBoards`);
        return { userId, success: true };
      } catch (error) {
        console.error(`Error updating userBoards for user ${userId}:`, error);
        return { userId, success: false, error: error.message };
      }
    });

    // Wait for all updates to complete
    const results = await Promise.all(updatePromises);
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log(`UserBoards update complete for added users: ${successful} successful, ${failed} failed`);
    
    if (failed > 0) {
      console.warn('Some userBoard updates failed for added users:', results.filter(r => !r.success));
    }
    
    return results;
  };
   // Function to update userBoards for removed users
  const updateUserBoardsForRemovedUsers = async (boardId, removedUserIds) => {
    if (!removedUserIds || removedUserIds.length === 0) {
      return [];
    }

   console.log(`Updating userBoards for ${removedUserIds.length} removed users...`);
    
    const updatePromises = removedUserIds.map(async (userId) => {
      try {
        // API call to remove boardId from user's userBoards
        await api.put(`zenkanbanboard-userservice/user/fromuser/${userId}/removeboard/${boardId}`);
        
        console.log(`Successfully removed board ${boardId} from user ${userId}'s userBoards`);
        return { userId, success: true };
      } catch (error) {
        console.error(`Error updating userBoards for user ${userId}:`, error);
        return { userId, success: false, error: error.message };
      }
    });

    // Wait for all updates to complete
    const results = await Promise.all(updatePromises);
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log(`UserBoards update complete: ${successful} successful, ${failed} failed`);
    
    if (failed > 0) {
      console.warn('Some userBoard updates failed:', results.filter(r => !r.success));
    }
    
    return results;
  };

  const handleReset = () => {
    reset({
      boardName: "",
      assigneeId: assignerInfo.id,
      assigneeName: assignerInfo.name,
      assignedUsers: [{ userId: "" }],
      boardColumns: [],
      teamId: teamId,
    });
    // Clear original assigned users when resetting
    setOriginalAssignedUserIds([]);
    setSnackbarMessage("Form reset successfully!");
    setOpenSnackbar(true);
  };


  //Board Data HERE <<<
  const handleBoardSubmit = async (data) => 
  {
   const boardData = {
    boardName: data.boardName,
    assignerId: parseInt(data.assigneeId),
    assignerName: data.assigneeName,
    assignedUserIds:[ ...data.assignedUsers.map((user) => {
      const parts = user.userId.split(" - ");
      return parts.length > 1 ? parseInt(parts[1]) : parseInt(user.userId);
    }),
    userId
  ],
    boardColumns: data.boardColumns.map((col) => col.value),
    teamIds: [data.teamId], // Add teamId as an array since backend expects Set<String>
  };



    try {
      if (editData && editData.boardId) {
        // UPDATE BOARD CASE - Handle userBoard synchronization
        console.log('Updating board with userBoard sync...');
        
        // Step 1: Update the board
        await api.put(`zenkanbanboard-boardservice/board/update/${editData.boardId}`, boardData);
        
         // Step 2: Find users that were removed and added
        const removedUsers = findRemovedUsers(originalAssignedUserIds, boardData.assignedUserIds);
        const addedUsers = findAddedUsers(originalAssignedUserIds, boardData.assignedUserIds);
        
        // Step 3: Update userBoards for removed users
        if (removedUsers.length > 0) {
          try {
            await updateUserBoardsForRemovedUsers(editData.boardId, removedUsers);
            console.log('UserBoard synchronization completed successfully');
          } catch (error) {
            console.error('Error during userBoard synchronization:', error);
            // Don't fail the entire operation, just log the error
          }
        }

        // Step 4: Update userBoards for newly added users
        if (addedUsers.length > 0) {
          try {
            await updateUserBoardsForAddedUsers(editData.boardId, addedUsers);
            console.log('UserBoard synchronization for added users completed successfully');
          } catch (error) {
            console.error('Error during userBoard synchronization for added users:', error);
            // Don't fail the entire operation, just log the error
          }
        }
        
        setSnackbarMessage("Board updated successfully");
      } else {
        // CREATE BOARD CASE - Original logic remains the same
        console.log(boardData);
        const response = await API.post("zenkanbanboard-boardservice/board/save", boardData);
        const boardId = response.data.boardId;

         const assignedUserIds = data.assignedUsers
          .map(user => user.userId.split(' - ')[1]) // Extract ID from "Name - ID"
          .filter(id => id);
          const allUserIds = [...new Set([userId, ...assignedUserIds])];
          const addBoardPromises = allUserIds.map(userIdToUpdate => 
          api.put(`zenkanbanboard-userservice/user/foruser/${userIdToUpdate}/addboard/${boardId}`)//assigning userboard for users.
        );
        
        await Promise.all(addBoardPromises);

        handleReset();
        setSnackbarMessage("Board created successfully");
      }

      setOpenSnackbar(true);
      setTimeout(() => {
        setOpenSnackbar(false);
        onSubmit(); 
      }, 3000);
    } catch (error) {
  const status = error?.response?.status;
  const backendMessage = error?.response?.data?.message || "";

  let customMessage = "An unexpected error occurred.";

  if (status === 409) {
    customMessage = "Error: A board with the same name already exists for the Team.";
  } else if (status === 400) {
    customMessage = "Bad request. Please check your input.";
  } else if (status === 500) {
    customMessage = "Server error. Please try again later.";
  } else {
    customMessage = backendMessage || error.message;
  }

  console.error("Error saving board:", customMessage);

  setSnackbarMessage(customMessage);
  setOpenSnackbar(true);
  setTimeout(() => {
    setOpenSnackbar(false);
    onSubmit(); 
  }, 3000);
}
  };

  

  return (
    <Container maxWidth="sm" sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
      <Paper
        elevation={5}
        sx={{
          p: 3,
          width: "100%",
          borderRadius: 2,
          bgcolor: "background.paper",
          boxShadow: "0 8px 16px rgba(0, 0, 50, 0.1)",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            fontWeight: 900,
            mb: 3,
            color: "#0a2540",
            textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
          }}
        >
          {editData ? "Edit Board" : "New Board"}
        </Typography>

        <Box component="form" onSubmit={handleSubmit(handleBoardSubmit)} noValidate>
          <Stack spacing={1.5}>
            <Controller
              name="boardName"
              control={control}
              rules={{ required: "Board name is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Board Name"
                  size="small"
                  fullWidth
                  error={!!errors.boardName}
                  helperText={errors.boardName?.message}
                />
              )}
            />

            {/* Hidden input for teamId - not displayed to user */}
            <input
              type="hidden"
              {...register("teamId")}
            />

            <AssignerInfoSection register={register} errors={errors} />

            <AssignedUsersSection
              userFields={userFields}
              register={register}
              control={control}
              errors={errors}
              appendUser={appendUser}
              removeUser={removeUser}
              teamMembers={teamMembers}
            />

            <BoardColumnsSection
              columnFields={columnFields}
              register={register}
              errors={errors}
              appendColumn={appendColumn}
              removeColumn={removeColumn}
            />

            <FormButtons handleReset={handleReset} editData={editData} />
          </Stack>
        </Box>
      </Paper>

      <CustomSnackbar
        open={openSnackbar}
        message={snackbarMessage}
        onClose={() => setOpenSnackbar(false)}
      />
    </Container>
  );
};

export default CreateBoardForm;