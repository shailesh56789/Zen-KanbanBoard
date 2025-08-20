import { Box, Typography, Paper } from "@mui/material";
import { Email, Lock, Shield } from "@mui/icons-material";

export default function EmailSubmissionInfo() {
  return (
    <Box sx={{ width: "100%", px: 3 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          padding: 4, 
          background: "linear-gradient(135deg, rgba(137, 246, 254, 0.1), rgba(65, 5, 111, 0.1))",
          border: "1px solid rgba(4, 106, 113, 0.2)"
        }}
      >
        <Typography 
          variant="h4" 
          align="center" 
          gutterBottom
          sx={{ color: "rgb(4, 106, 113)", fontWeight: "bold", mb: 3 }}
        >
          Forgot Your Password?
        </Typography>

        <Typography 
          variant="body1" 
          sx={{ mb: 3, color: "text.secondary", textAlign: "center" }}
        >
          Don't worry, it happens to the best of us. Follow these simple steps to reset your password:
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Email sx={{ color: "rgb(4, 106, 113)", fontSize: 30 }} />
            <Box>
              <Typography variant="h6" sx={{ color: "rgb(4, 106, 113)", fontWeight: "bold" }}>
                Step 1: Enter Your Email
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Provide the email address associated with your Zenkanban account.
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Shield sx={{ color: "rgb(4, 106, 113)", fontSize: 30 }} />
            <Box>
              <Typography variant="h6" sx={{ color: "rgb(4, 106, 113)", fontWeight: "bold" }}>
                Step 2: Check Your Email
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                We'll send you a secure reset link to your email address.
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Lock sx={{ color: "rgb(4, 106, 113)", fontSize: 30 }} />
            <Box>
              <Typography variant="h6" sx={{ color: "rgb(4, 106, 113)", fontWeight: "bold" }}>
                Step 3: Create New Password
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Click the link and set up your new secure password.
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box 
          sx={{ 
            mt: 4, 
            p: 2, 
            backgroundColor: "rgba(4, 106, 113, 0.1)", 
            borderRadius: 2,
            border: "1px solid rgba(4, 106, 113, 0.2)"
          }}
        >
          <Typography variant="body2" sx={{ color: "rgb(4, 106, 113)", fontWeight: "bold" }}>
            🔐 Security Tip:
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Choose a strong password with at least 6 characters, including letters, numbers, and symbols.
          </Typography>
        </Box>

        <Typography 
          variant="body2" 
          align="center" 
          sx={{ 
            mt: 4, 
            color: "text.secondary", 
            fontStyle: "italic" 
          }}
        >
          Welcome back to <strong>Zenkanban</strong> - Your productivity companion
        </Typography>
      </Paper>
    </Box>
  );
}