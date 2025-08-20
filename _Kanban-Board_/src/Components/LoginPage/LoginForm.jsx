import { useState} from "react";
import { useAuth } from "../../Services/AuthContext";
import { useForm } from "react-hook-form";
import api from "../../Services/API";
import { useSnackbar } from "notistack";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
  CircularProgress
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
export default function LoginForm() 
{
  const [showPassword,setShowPassword]= useState(false);
  const { login } = useAuth();
  const [ loading, setLoading ] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onBlur" });
 

  const onSubmit = async (data) => {
    setLoading(true);
  const isEmail = /\S+@\S+\.\S+/.test(data.identifier); 
  const finalData = isEmail
    ? { userEmail: data.identifier, userPassword: data.password }
    : { userName: data.identifier, userPassword: data.password };

  try {
    const response = await api.post("/zenkanbanboard-authenticationservice/auth/login", finalData);
     login(response.data.token);
    enqueueSnackbar(`Login successful, Welcome Back ${data.identifier}!`, {
        variant: "success",
      });

      setTimeout(()=>{
        setLoading(false);
        navigate("/dashboard");
      },1500);
      reset();
   
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
     enqueueSnackbar(`Login failed: ${error.response?.data || "Server error"}`, {
        variant: "error",
      });
      setLoading(false);
  }

  
};
 const handleRegisterClick = () => {
    navigate("/UserRegistration"); 
  };
   const handleResetClick = () => {
    navigate("/PasswordReset"); 
  };

  return (
    <Box sx={{ width: "100%", px: 3 }}>
      <Paper elevation={3} sx={{ padding: 4, marginTop: 0 }}>
        <Typography variant="h4" align="center" gutterBottom
        sx={{color:"rgb(4, 106, 113)",fontWeight:"bold"}}>
          Login
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            label="Email or Username"
            fullWidth
            margin="normal"
            {...register("identifier", { required: "This field is required" })}
            error={!!errors.identifier}
            helperText={errors.identifier?.message}
          />

          <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          {...register("password", { required: "Password is required" })}
          error={!!errors.password}
          helperText={errors.password?.message}
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
        <Box
        sx={{display:"flex",
        gap:5}}
        >
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            fullWidth
            sx={{
              marginTop: 2,
              background: "linear-gradient(135deg,rgb(137, 246, 254),rgb(65, 5, 111))",
               transition: "background 1s ease",
              "&:hover": { background: "linear-gradient(135deg,rgb(205, 4, 255),rgb(36, 212, 198))", },
            }}
          >
            {loading ?(
                <>
                  Logging In...
                  <CircularProgress size={20} sx={{ ml: 1, color: "white" }} />
                </>
            ) : ("Log In")}
          </Button>
          <Button
            onClick={reset}
            type="button"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              marginTop: 2,
              background: "linear-gradient(135deg,rgb(137, 246, 254),rgb(65, 5, 111))",
               transition: "background 1s ease",
              "&:hover": { background: "linear-gradient(135deg,rgb(205, 4, 255),rgb(36, 212, 198))", },
            }}
          >
            Reset
          </Button>
          </Box>
          <Typography sx={{pt:2,fontFamily:"cursive",fontSize:18}}>
            Can't Remember your password ?
             <span 
            onClick={handleResetClick}
            style={{ 
              color: "rgb(156, 63, 249)", 
              cursor: "pointer", 
              textDecoration: "underline"
            }}
          >
            <br></br>Reset Now!
          </span>
          </Typography>
          <Typography sx={{pt:2,fontFamily:"cursive",fontSize:18}}>
            dont have an account yet ? 
             <span 
            onClick={handleRegisterClick}
            style={{ 
              color: "rgb(156, 63, 249)", 
              cursor: "pointer", 
              textDecoration: "underline"
            }}
          >
            <br></br>Register Now!
          </span>
          </Typography>
        </Box>
      </Paper>

     
    </Box>
  );
}
