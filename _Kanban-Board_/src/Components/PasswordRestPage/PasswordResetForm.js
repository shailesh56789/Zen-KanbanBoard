import { useForm } from "react-hook-form";
import { enqueueSnackbar } from "notistack";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../../Services/API";

export default function PasswordResetForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({ mode: "onBlur" });

  const password = watch("newPassword");

  const onSubmit = async (data) => {
    try {
      await API.post("zenkanbanboard-passwordresetservice/api/password-reset/reset-password", {
        token: resetToken,
        newPassword: data.newPassword
      });
      
      enqueueSnackbar(
        "Password has been successfully reset! Redirecting to login...",
        { variant: "success" }
      );
      
      setTimeout(() => {
        navigate("/Userlogin");
      }, 1500);
      
    } catch (error) {
      console.error("Password reset failed:", error.response?.data || error.message);
      enqueueSnackbar(
        `Password reset failed: ${error.response?.data || "Server error"}`,
        { variant: "error" }
      );
    }
  };

  const handleLoginClick = () => {
    navigate("/Userlogin");
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
          Set New Password
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Typography 
            variant="body1" 
            align="center" 
            sx={{ mb: 3, color: "text.secondary" }}
          >
            Enter your new password below.
          </Typography>

          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
            {...register("newPassword", { 
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
          />

          <TextField
            label="Confirm New Password"
            type="password"
            fullWidth
            margin="normal"
            {...register("confirmPassword", { 
              required: "Please confirm your password",
              validate: value =>
                value === password || "Passwords do not match"
            })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
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
              Reset Password
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
              Reset Form
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
        </Box>
      </Paper>
    </Box>
  );
}