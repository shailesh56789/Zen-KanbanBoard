import { Box, Typography } from "@mui/material";
import Icon from "./Icon";

export default function Footer() {
  return (
    <Box
     sx={{
        background: "linear-gradient(135deg, rgb(98, 1, 75),rgb(92, 71, 111), rgb(0, 40, 40))",
      }}
      component="footer"
      p={2}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    >
      <Typography variant="body1" color="white">
        &copy; 2025 . All rights reserved.
      </Typography>

      <Icon />
    </Box>
  );
}
