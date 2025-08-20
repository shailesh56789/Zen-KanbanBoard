import { useEffect, useState } from 'react';
import { useAuth } from '../../Services/AuthContext';
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
  Stack,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';

import { Edit, Delete, Visibility, Search, ListAlt } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../Services/API';
import CreateBoardForm from '../BoardForm/CreateBoardForm';
import API from '../../Services/API';




export default function DashboardPage() 
{
  const {userId,role,teamId } = useAuth();
  const [boards, setBoards] = useState([]);
  const [editingBoard, setEditingBoard] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [viewingBoardId, setViewingBoardId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, boardId: null });
  

  const navigate = useNavigate();
  useEffect(() => {

    if (!userId && !role) return;// Don't make API call if userId isn't loaded yet
    
    if(role==="ADMIN")
      {
        API.get(`zenkanbanboard-boardservice/board/fetchallboardsbyteamid/${teamId}`)
    .then(res => setBoards(res.data))
    .catch(err => console.error("Error fetching boards:", err));
      }
    else
    {
    API.get(`zenkanbanboard-boardservice/board/fetchallboardsbyuserid/${userId}`)
    .then(res => setBoards(res.data))
    .catch(err => console.error("Error fetching boards:", err));
    }
  }, [showCreateForm, editingBoard,userId]);

  const handleShowCreateForm = () => {
    setEditingBoard(null);
    setShowCreateForm(true);
    setViewingBoardId(null);
  };

  const handleEditBoard = (board) => {
    setEditingBoard(board);
    setShowCreateForm(true);
    setViewingBoardId(null);
  };

  const handleViewTasks = (boardId) => {
     localStorage.setItem('selectedBoardId', boardId); 
  navigate(`/boards/${boardId}/tasks`);
};

  const handleViewBoard = (boardId) => {
    navigate(`/boards/${boardId}`);
  };

  const handleDeleteBoard = (boardId) => {
    
    setConfirmDelete({ open: true, boardId });
  };

  const handleConfirmDelete = () => {
    if (role !== "ADMIN") {
    console.warn("Access Denied : Only Admins can delete");
    return;
  }
    api
      .delete(`zenkanbanboard-boardservice/board/deletebyid/${confirmDelete.boardId}`)
      .then(() => {
       if(role==="ADMIN")
      {
        api.get(`zenkanbanboard-boardservice/board/fetchallboardsbyteamid/${teamId}`)
    .then(res => setBoards(res.data))
    .catch(err => console.error("Error fetching boards:", err));
      }
    else
    {
    api.get(`zenkanbanboard-boardservice/board/fetchallboardsbyuserid/${userId}`)
    .then(res => setBoards(res.data))
    .catch(err => console.error("Error fetching boards:", err));
    }
      })
      .then((res) => {
        setDeleteSuccess(true);
      })
      .catch(err => console.error('Error deleting board:', err))
      .finally(() => setConfirmDelete({ open: false, boardId: null }));
  };

  const handleCancelDelete = () => {
    setConfirmDelete({ open: false, boardId: null });
  };

  const handleBack = () => {
    setShowCreateForm(false);
    setEditingBoard(null);
    setViewingBoardId(null);
  };

  const filteredBoards = boards.filter(board =>
    `${board.boardName} ${board.assignerName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <Box p={4} sx={{ background: 'linear-gradient(to right, #c7d2fe, #bfdbfe)', minHeight: '75vh' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold" color="#1e3a8a">
          Board Dashboard
        </Typography>
        <TextField
          placeholder="Search by name or assigner"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="primary" />
              </InputAdornment>
            )
          }}
          sx={{
            width: 320,
            borderRadius: 4,
            backgroundColor: 'rgba(249, 241, 244, 0.59)',
            boxShadow: '0 4px 8px rgba(8, 40, 101, 0.1)',
            '& .MuiOutlinedInput-root': {
              borderRadius: 4,
              color: 'rgb(11, 11, 11)',
              '& fieldset': {
                borderColor: 'rgb(178, 205, 251)',
              },
              '&:hover fieldset': {
                borderColor: 'rgb(75, 143, 232)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'rgb(62, 143, 224)',
              },
            },
            input: {
              color: 'rgb(15, 67, 236)',
            },
          }}
        />
      </Box>

      {showCreateForm ? (
        <>
          <Button variant="outlined" onClick={handleBack} sx={{ mb: 2 }}>
            Back to Boards
          </Button>
          <CreateBoardForm editData={editingBoard} onSuccess={handleBack} />
        </>
      ) : (
        <>
        {role === "ADMIN" && (
          <Box mb={4}>
            <Button
              variant="contained"
              sx={{
                background: 'linear-gradient(45deg,rgb(80, 150, 249), #1e40af)',
                color: '#fff',
                borderRadius: '30px',
                px: 4,
                py: 1.5,
                fontWeight: 'bold',
                boxShadow: '0 6px 18px rgba(30,64,175,0.3)',
                '&:hover': {
                  background: 'linear-gradient(to right, #1e40af,rgb(121, 157, 255))',
                },
              }}
              onClick={handleShowCreateForm}
            >
              CREATE NEW BOARD
            </Button>
          </Box>
        )}

          {filteredBoards.length === 0 ? (
            <Typography>No boards found. Create New!</Typography>
          ) : (
            <Grid container spacing={4}>
              {filteredBoards.map(board => (
                <Grid item xs={12} md={6} lg={4} key={board.boardId}>
                  <Card
                    sx={{
                      p: 3,
                      borderRadius: 4,
                      boxShadow: '0px 12px 25px rgba(37, 99, 235, 0.2)',
                      background: 'linear-gradient(to bottom right,rgb(208, 227, 250), #eff6ff)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.03)',
                        boxShadow: '0px 16px 40px rgba(30, 58, 138, 0.3)',
                      }
                    }}
                  >
                    
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" sx={{ color: '#1e3a8a' }}>
                        {board.boardName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Assigner: {board.assignerName}</strong>
                      </Typography>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
  
                <Chip
                   label="Tasks"
                   color="info"
                   size="medium"
                   icon={<ListAlt />}
                   onClick={() => handleViewTasks(board.boardId)}
                   sx={{
                   cursor: 'pointer',
                         '&:hover': {
                          backgroundColor: 'rgba(227, 124, 223, 0.2)',
                          },
                          }}
                        />

               
               {role !== "ADMIN" && (
               
                     <Button
                      variant="contained"
                      color="info"
                       size="medium"
                      onClick={() => handleViewBoard(board.boardId)}
                      sx={{
                       textTransform: 'none',
                       borderRadius: '30px',
                       px: 3,
                       py: 0.5,
                       cursor: 'pointer',
                           '&:hover': {
                            backgroundColor: 'rgba(227, 124, 223, 0.2)', 
                        },
                      }}
                    >
                  View
              </Button>
             
              )}
            </Box>
            

                      {role === "ADMIN" && (
                      <Stack direction="row" spacing={1} mt={2}>
                       
                        <IconButton color="primary" onClick={() => handleEditBoard(board)}>
                          <Edit />
                        </IconButton>
                      
                        <IconButton color="info" onClick={() => handleViewBoard(board.boardId)}>
                          <Visibility />
                        </IconButton>
                        
                        <IconButton color="error" onClick={() => handleDeleteBoard(board.boardId)}>
                          <Delete />
                        </IconButton>

                      </Stack>
                      )}
                      

                      
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

            <Dialog
        open={confirmDelete.open}
        onClose={handleCancelDelete}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this board?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>


          <Snackbar
        open={deleteSuccess}
        autoHideDuration={3000}
        onClose={() => setDeleteSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setDeleteSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Board deleted successfully!
        </Alert>
      </Snackbar>
        </>
      )}
    </Box>
  );
}