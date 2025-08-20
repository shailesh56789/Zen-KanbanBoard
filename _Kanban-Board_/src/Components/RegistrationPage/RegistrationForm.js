import { useForm } from "react-hook-form";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import API from "../../Services/API";
import { useState } from "react";
export default function RegistrationForm() 
{
  const [showPassword,setShowPassword]= useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ mode: "onBlur" });
  const onSubmit = async (data) => {
    try {
      await API.post("zenkanbanboard-userservice/user/register", data);
      enqueueSnackbar(`Registration successful! Welcome ${data.userName}`,
        {
         variant: "success",
      });
      reset();

      setTimeout(()=>
      {
        navigate("/userlogin");
      },1500);
  
    } catch (error) {
      
      console.error("Registration failed:", error.response?.data || error.message);
      enqueueSnackbar(`Registration failed. ${error.response?.data}`, 
        {
          variant: "error",
         });
    }
  };

  const handleLoginClick=()=>
  {
    navigate("/UserLogin")
  }

  return (
    <Paper elevation={3} sx={{ mx: "auto", m: 3, p: 4,width:"100%" }}>
      <Typography variant="h4" gutterBottom textAlign={"center"}
      sx={{color:"rgb(4, 106, 113)",fontWeight:"bold"}}>
        Registration Form
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            error={!!errors.userEmail}
            helperText={errors.userEmail?.message}
            {...register("userEmail", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email format",
              },
            })}
          />
        </Box>

        <Box mb={2}>
          <TextField
            fullWidth
            label="Phone Number"
            type="tel"
            variant="outlined"
            error={!!errors.userPhoneNumber}
            helperText={errors.userPhoneNumber?.message}
            {...register("userPhoneNumber", {
              required: "Phone number is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Enter a valid 10-digit phone number",
              },
            })}
          />
        </Box>

        <Box mb={2}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            error={!!errors.userName}
            helperText={errors.userName?.message}
            {...register("userName", {
              required: "Username is required",
              minLength: {
                value: 3,
                message: "Username must be at least 3 characters",
              },
            })}
          />
          </Box>
          <Box mb={2}>
          <TextField
            fullWidth
            label="Team-Id"
            variant="outlined"
            error={!!errors.teamId}
            helperText={errors.teamId?.message}
            {...register("teamId", {
              required: "Team ID is required",
              minLength: {
                value: 3,
                message: "Team ID must be at least 3 characters",
              },
            })}
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            select
            label="Role"
            defaultValue="USER"
            variant="outlined"
            error={!!errors.role}
            helperText={errors.role?.message}
            {...register("role", {
              required: "Role is required",
            })}
          >
            <MenuItem value="USER">Employee</MenuItem>
            <MenuItem value="ADMIN">Manager</MenuItem>
          </TextField>
        </Box>

        <Box mb={2}>
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            error={!!errors.userPassword}
            helperText={errors.userPassword?.message}
            {...register("userPassword", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  onMouseDown={(e) => e.preventDefault()}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
                  {/* <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            error={!!errors.userPassword}
            helperText={errors.userPassword?.message}
            {...register("userPassword", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                message: "Must include uppercase, lowercase, and number",
              },
            })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          /> */}
        </Box>

      <Box 
      display="flex"
      sx={{gap:5}}
      >
        <Button type="submit" variant="contained" fullWidth
         sx={{
              p:1,
              background: "linear-gradient(135deg,rgb(137, 246, 254),rgb(65, 5, 111))",
               transition: "background 1s ease",
              "&:hover": { background: "linear-gradient(135deg,rgb(205, 4, 255),rgb(36, 212, 198))", },
            }}>
          Register
        </Button>
        <Button type="button" variant="contained" fullWidth
        onClick={reset}
         sx={{
              p:1,
              background: "linear-gradient(135deg,rgb(137, 246, 254),rgb(65, 5, 111))",
               transition: "background 1s ease",
              "&:hover": { background: "linear-gradient(135deg,rgb(205, 4, 255),rgb(36, 212, 198))", },
            }}>
          Reset
        </Button>
      </Box>
      <Typography sx={{pt:2,fontFamily:"cursive",fontSize:18}}>
            Already have an account?
             <span 
            onClick={handleLoginClick}
            style={{ 
              color: "rgb(156, 63, 249)", 
              cursor: "pointer", 
              textDecoration: "underline"
            }}
          >
            <br></br>Login Now
          </span>
          </Typography>
      </form>
    </Paper>
  );
}
