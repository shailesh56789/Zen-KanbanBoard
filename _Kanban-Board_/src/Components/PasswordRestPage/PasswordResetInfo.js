import { Box, Typography, Paper } from "@mui/material";
import { Lock, Shield, CheckCircle } from "@mui/icons-material";

export default function PasswordResetinfo() {
  return (
    <Box sx={{ width: "100%", px: 3 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          padding: 4, 
          background: "linear-gradient(135deg, rgba(137, 246, 254, 0.1), rgba(65, 5, 111, 0.1))",
          border: "1px solid rgba(4, 106, 113, 0.2)",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >
        <Box>
          <Typography 
            variant="h4" 
            align="center" 
            gutterBottom
            sx={{ color: "rgb(4, 106, 113)", fontWeight: "bold", mb: 3 }}
          >
            Almost There!
          </Typography>

          <Typography 
            variant="body1" 
            sx={{ mb: 3, color: "text.secondary", textAlign: "center" }}
          >
            You're just one step away from securing your account. Create your new password below:
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <CheckCircle sx={{ color: "green", fontSize: 30 }} />
              <Box>
                <Typography variant="h6" sx={{ color: "green", fontWeight: "bold" }}>
                  Link Verified Successfully ✓
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Your reset link is valid and secure.
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Lock sx={{ color: "rgb(4, 106, 113)", fontSize: 30 }} />
              <Box>
                <Typography variant="h6" sx={{ color: "rgb(4, 106, 113)", fontWeight: "bold" }}>
                  Create New Password
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Choose a strong, unique password for your account.
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Shield sx={{ color: "rgb(4, 106, 113)", fontSize: 30 }} />
              <Box>
                <Typography variant="h6" sx={{ color: "rgb(4, 106, 113)", fontWeight: "bold" }}>
                  Confirm & Complete
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Re-enter your password to confirm and finalize the reset.
                </Typography>
              </Box>
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
            🔐 Password Requirements:
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            • Minimum 6 characters<br />
            • Mix of letters, numbers, and symbols<br />
            • Avoid common words or personal information
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
