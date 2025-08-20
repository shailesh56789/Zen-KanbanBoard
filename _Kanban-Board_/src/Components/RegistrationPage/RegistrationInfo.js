import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Paper,
} from "@mui/material";

export default function LoginInfo() {
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: "📋",
      title: "Visual Task Management",
      description:
        "Drag and drop tasks between To Do, In Progress, and Done columns",
      benefit: "See your entire workflow at a glance",
      color: "#1976d2",
    },
    {
      icon: "👥",
      title: "Team Collaboration",
      description: "Share boards with team members and work together in real-time",
      benefit: "Keep everyone aligned and productive",
      color: "#7b1fa2",
    },
    {
      icon: "📊",
      title: "Progress Tracking",
      description: "Monitor completion rates and identify bottlenecks instantly",
      benefit: "Make data-driven decisions",
      color: "#388e3c",
    },
    {
      icon: "⚡",
      title: "Instant Updates",
      description: "Changes sync across all devices and team members immediately",
      benefit: "Never miss important updates",
      color: "#f57c00",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

  const feature = features[currentFeature];

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 800,
        mx: "auto",
        p: 3,
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      }}
    >
      {/* Main Heading */}
      <Box textAlign="center" mb={4}>
        <Typography
          variant="h3"
          fontWeight="bold"
          mb={2}
          sx={{
            background: "linear-gradient(45deg, #1976d2, #7b1fa2)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            lineHeight: 1.2,
          }}
        >
          Transform Your Workflow with Smart Kanban Boards
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          maxWidth={600}
          mx="auto"
          lineHeight={1.5}
        >
          The visual project management tool that makes complex projects simple
          and keeps teams in perfect sync.
        </Typography>
      </Box>

      {/* Rotating Feature Showcase */}
      <Paper
        elevation={3}
        sx={{
          mb: 4,
          bgcolor: "background.paper",
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          p: 4,
          textAlign: "center",
          position: "relative",
        }}
      >
        <Box
          sx={{
            animation: "fadeIn 0.5s ease-in-out",
          }}
          key={currentFeature}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              mx: "auto",
              mb: 2,
              bgcolor: `${feature.color}15`,
              border: `2px solid ${feature.color}30`,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              userSelect: "none",
            }}
          >
            {feature.icon}
          </Box>

          <Typography variant="h5" fontWeight="bold" mb={2} color="text.primary">
            {feature.title}
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            mb={3}
            sx={{ lineHeight: 1.6 }}
          >
            {feature.description}
          </Typography>

          <Box
            component="span"
            sx={{
              display: "inline-block",
              bgcolor: `${feature.color}15`,
              color: feature.color,
              fontWeight: 500,
              px: 2,
              py: 1,
              borderRadius: "20px",
              border: `1px solid ${feature.color}30`,
              userSelect: "none",
            }}
          >
            💡 {feature.benefit}
          </Box>
        </Box>

        {/* Feature Progress Indicators */}
        <Stack
          direction="row"
          justifyContent="center"
          spacing={1}
          mt={4}
          mb={2}
          sx={{ userSelect: "none" }}
        >
          {features.map((_, index) => (
            <Button
              key={index}
              onClick={() => setCurrentFeature(index)}
              sx={{
                minWidth: 0,
                width: index === currentFeature ? 24 : 8,
                height: 8,
                borderRadius: 2,
                bgcolor:
                  index === currentFeature ? feature.color : "grey.400",
                padding: 0,
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: feature.color,
                },
              }}
            />
          ))}
        </Stack>

        {/* Progress Bar for auto-rotation */}
        <Box
          sx={{
            mt: 2,
            height: 4,
            borderRadius: 2,
            bgcolor: "grey.300",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              height: "100%",
              width: `${((currentFeature + 1) / features.length) * 100}%`,
              bgcolor: feature.color,
              transition: "width 0.3s ease",
            }}
          />
        </Box>
      </Paper>

      {/* Call to Action */}
      <Box
        sx={{
          textAlign: "center",
          p: 3,
          borderRadius: 3,
          background: "linear-gradient(135deg, #1976d2, #7b1fa2)",
          color: "common.white",
          boxShadow: "0 4px 20px rgba(25, 118, 210, 0.3)",
          userSelect: "none",
        }}
      >
        <Typography variant="h6" fontWeight="bold" mb={1}>
          Ready to Get Started? 🚀
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.5 }}>
          Join us to transform your workflow and productivity.
          <br />
          Sign up now and experience the difference!
        </Typography>
      </Box>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </Box>
  );
}
