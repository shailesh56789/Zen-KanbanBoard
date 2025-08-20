import { useForm } from "react-hook-form";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function EmailSubmissionForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ mode: "onBlur" });

  const onSubmit = async (data) => {
    try {
      await axios.post("zenkanbanboard-passwordresetservice/api/password-reset/reset-password", {
        userEmail: data.email
      });
      
      enqueueSnackbar(
        `Password reset link has been sent to ${data.email}. Please check your email.`,
        { variant: "success" }
      );
      
      reset();
    } catch (error) {
      console.error("Password reset request failed:", error.response?.data || error.message);
      enqueueSnackbar(
        `Failed to send reset email: ${error.response?.data || "Server error"}`,
        { variant: "error" }
      );
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleRegisterClick = () => {
    navigate("/UserRegistration");
  };

  return (
    <Box sx={{ width: "100%", px: 3 }}>
      <Paper elevation={3} sx={{ padding: 4, marginTop: 0 }}>
        <Typography 
          variant="h4" 
          align="center" 
          gutterBottom
          sx={{ color: "rgb(4, 106, 113)", fontWeight: "bold" }}
        >
          Reset Password
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Typography 
            variant="body1" 
            align="center" 
            sx={{ mb: 3, color: "text.secondary" }}
          >
            Enter your email address and we'll send you a link to reset your password.
          </Typography>

          <TextField
            label="Email Address"
            type="email"
            fullWidth
            margin="normal"
            {...register("email", { 
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email format",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <Box sx={{ display: "flex", gap: 5 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                marginTop: 2,
                background: "linear-gradient(135deg,rgb(137, 246, 254),rgb(65, 5, 111))",
                transition: "background 1s ease",
                "&:hover": { 
                  background: "linear-gradient(135deg,rgb(205, 4, 255),rgb(36, 212, 198))" 
                },
              }}
            >
              Send Reset Link
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
                "&:hover": { 
                  background: "linear-gradient(135deg,rgb(205, 4, 255),rgb(36, 212, 198))" 
                },
              }}
            >
              Reset
            </Button>
          </Box>

          <Typography sx={{ pt: 2, fontFamily: "cursive", fontSize: 18 }}>
            Remember your password?
            <span 
              onClick={handleLoginClick}
              style={{ 
                color: "rgb(156, 63, 249)", 
                cursor: "pointer", 
                textDecoration: "underline"
              }}
            >
              <br />Login Now
            </span>
          </Typography>

          <Typography sx={{ pt: 1, fontFamily: "cursive", fontSize: 18 }}>
            Don't have an account yet?
            <span 
              onClick={handleRegisterClick}
              style={{ 
                color: "rgb(156, 63, 249)", 
                cursor: "pointer", 
                textDecoration: "underline"
              }}
            >
              <br />Register Now
            </span>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}