import { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Grid, Typography, Button, Box } from "@mui/material";
import AnimatedKanbanBoard from "../AnimatedKanbanBoard/AnimatedKanbanboard";

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <Box
      sx={{
        minHeight: "80vh",
        p: 1,
      }}
    >
      <Grid
        container
        spacing={6}
        alignItems="center"
        justifyContent="center"
        columns={{ xs: 1, md: 12 }}
      >
        {/* Left Side - Welcome Text */}
        <Grid
          item
          xs={12}
          md={5}
          sx={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(-48px)",
            transition: "opacity 1.2s ease, transform 1.2s ease",
          }}
        >
         <Typography
          variant="h5"
          component="div"
          sx={{
            fontWeight: "bold",
            mb: 1,
            fontSize: { xs: "1.5rem", md: "2rem" },
          }}
        >
          Welcome to
        </Typography>

        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontWeight: "bold",
            fontSize: { xs: "2.5rem", md: "4rem" },
            background: "linear-gradient(135deg, rgb(65, 5, 111), rgb(137, 246, 254))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            // Add below for Firefox support
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          ZENKANBAN
        </Typography>


          <Typography
            variant="body1"
            sx={{
              fontSize: 20,
              color: "#6b21a8",
              mb: 4,
              maxWidth: 440,
            }}
          >
            Organize, track, and conquer your tasks with elegance and efficiency.
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              component={RouterLink}
              to="/userlogin"
              variant="contained"
              sx={{
                fontSize:20,
                backgroundColor: "#9333ea",
                color: "white",
                fontWeight: 600,
                borderRadius: 9999,
                px: 3,
                py: 1.5,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#7e22ce",
                },
              }}
            >
              Login
            </Button>

            <Button
              component={RouterLink}
              to="/userregistration"
              variant="contained"
              sx={{
                fontSize:20,
                backgroundColor: "#a78bfa",
                color: "#4c1d95",
                fontWeight: 600,
                borderRadius: 9999,
                px: 3,
                py: 1.5,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#7c3aed",
                  color: "white",
                },
              }}
            >
              Register
            </Button>
          </Box>
        </Grid>

        {/* Right Side - Animated Kanban Board */}
        <Grid item xs={12} md={7}>
          <AnimatedKanbanBoard />
        </Grid>
      </Grid>
    </Box>
  );
}
