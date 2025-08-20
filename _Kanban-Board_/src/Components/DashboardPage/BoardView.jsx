import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
  Chip,
  Paper,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import API from '../../Services/API';
import { useAuth } from "../../Services/AuthContext";

const BoardView = () => 
{
  const { boardId } = useParams();
  const { userId} = useAuth();

const [board, setBoard] = useState(null);
const [assignedUsers, setAssignedUsers] = useState([]);
const [tasks, setTasks] = useState([]);

useEffect(() => {
  if (!boardId) return;

  const fetchBoardData = async () => 
    {
    try {
      // Step 1: Fetch board info
      const boardRes = await API.get(`zenkanbanboard-boardservice/board/fetchbyid/${boardId}`);
      const boardData = boardRes.data;
      setBoard(boardData);

      // Step 2: Fetch assigned user details
      if (boardData.assignedUserIds?.length) 
      {
        const userRequest = boardData.assignedUserIds.map((user)=>
          API.get(`zenkanbanboard-userservice/user/fetchbyid/${user}`)
      );
        const userResponse = await Promise.all(userRequest);
        const users = userResponse.map(res =>({ 
          tagUserID:res.data.userId,
          tagUserName:res.data.userName
        }));
        setAssignedUsers(users);
      }
      // Step 3: Fetch tasks for this board
      const tasksRes = await API.get(`zenkanbanboard-taskservice/task/taskbyboard/${boardId}`);
      const Ttasks = tasksRes.data.map(task =>({
        taskName:task.taskTitle,
        taskStatus:task.status
      }));
      
      setTasks(Ttasks); 

    } catch (error) {
      console.error("Failed to fetch board or related data:", error);
      alert("Error fetching board data");
    }
  };

  fetchBoardData();
}, [boardId]);

  if (!board) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <Typography variant="h5" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mb: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h3"
          align="center"
          sx={{
            fontWeight: 'bold',
            mb: 2,
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            fontSize: { xs: '2rem', md: '3rem' },
          }}
        >
          {board.boardName}
        </Typography>
        <Typography
          variant="h5"
          align="center"
          sx={{
            opacity: 0.9,
            fontWeight: 600,
          }}
        >
          Managed by {board.assignerName}
        </Typography>
      </Paper>

      {/* Three Column Layout */}
      <Grid container spacing={4} sx={{ minHeight: '70vh' ,justifyContent:"center"}}>
        
        {/* First Column - Assigned Users */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: '100%',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              borderRadius: 3,
              overflow: 'hidden',
              background: 'linear-gradient(145deg, #f8f9ff 0%, #e8f2ff 100%)',
            }}
          >
            <Box
              sx={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                p: 3,
                color: 'white',
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <PersonIcon sx={{ fontSize: '2rem' }} />
                Assigned Users
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                {Array.isArray(assignedUsers) ? assignedUsers.length : 0} members
              </Typography>
            </Box>
            <CardContent sx={{ p: 3 }}>
              {Array.isArray(assignedUsers) && assignedUsers.length > 0 ? (
                <List sx={{ p: 0 }}>
                  {assignedUsers.map((user, idx) => (
                    <ListItem
                      key={idx}
                      sx={{
                        px: 0,
                        py: 2,
                        borderBottom: idx < board.assignedUserIds.length - 1 ? '1px solid #e0e7ff' : 'none',
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: 'primary.main',
                            width: 48,
                            height: 48,
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                          }}
                        >
                          {user.tagUserName.toString().charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                            User Name: {user.tagUserName}
                          </Typography>
                        }
                        secondary={
                          <Chip
                            label={`ID: ${userId}`}
                            size="small"
                            variant="outlined"
                            sx={{ mt: 1, fontSize: '0.75rem' }}
                          />
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box textAlign="center" py={4}>
                  <PersonIcon sx={{ fontSize: '3rem', color: '#cbd5e1', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    No users assigned yet
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Second Column - Board Columns */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: '100%',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              borderRadius: 3,
              overflow: 'hidden',
              background: 'linear-gradient(145deg, #fff8f0 0%, #ffeedd 100%)',
            }}
          >
            <Box
              sx={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                p: 3,
                color: 'white',
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <ViewColumnIcon sx={{ fontSize: '2rem' }} />
                Board Columns
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                {board.boardColumns?.length || 0} columns
              </Typography>
            </Box>
            <CardContent sx={{ p: 3 }}>
              {board.boardColumns?.length > 0 ? (
                <Stack spacing={2}>
                  {board.boardColumns.map((col, idx) => (
                    <Paper
                      key={idx}
                      elevation={2}
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        textAlign: 'center',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 20px rgba(245, 158, 11, 0.3)',
                        },
                      }}
                    >
                      {col}
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Box textAlign="center" py={4}>
                  <ViewColumnIcon sx={{ fontSize: '3rem', color: '#cbd5e1', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    No columns defined
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

      {/* Third Column - Tasks */}
      <Grid item xs={12} md={4}>
        <Card
          sx={{
            height: '100%',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            borderRadius: 3,
            overflow: 'hidden',
            background: 'linear-gradient(145deg, #f0fdf4 0%, #dcfce7 100%)',
          }}
        >
          <Box
            sx={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              p: 3,
              color: 'white',
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <AssignmentIcon sx={{ fontSize: '2rem' }} />
              Tasks
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
              {tasks?.length || 0} tasks
            </Typography>
          </Box>
          <CardContent sx={{ p: 3 }}>
            {tasks?.length > 0 ? (
              <Stack spacing={2}>
                {tasks.map((task, idx) => (
                  <Paper
                    key={idx}
                    elevation={2}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(16, 185, 129, 0.3)',
                      },
                    }}
                  >
                    <ListItem
                      sx={{
                        px: 0,
                        py: 2,
                        borderBottom: idx < tasks.length - 1 ? '1px solid #e0e7ff' : 'none',
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                            Task Title: {task.taskName}
                          </Typography>
                        }
                        secondary={
                          <Chip
                            label={`Task Status: ${task.taskStatus}`}
                            size="small"
                            variant="outlined"
                            sx={{ mt: 1, fontSize: '0.75rem' }}
                          />
                        }
                      />
                    </ListItem>
                  </Paper>
                ))}
              </Stack>
            ) : (
              <Box textAlign="center" py={4}>
                <AssignmentIcon sx={{ fontSize: '3rem', color: '#cbd5e1', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  No tasks available
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
      </Grid>
    </Container>
  );
};

export default BoardView;