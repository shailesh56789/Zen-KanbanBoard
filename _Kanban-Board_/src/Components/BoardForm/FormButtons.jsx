import { Box, Button } from "@mui/material";
import { Refresh } from "@mui/icons-material";

const FormButtons = ({ handleReset, editData }) => {
  return (
    <Box display="flex" justifyContent="center" gap={2} mt={3}>
      <Button
        type="button"
        variant="outlined"
        size="medium"
        onClick={handleReset}
        startIcon={<Refresh />}
        sx={{
          borderColor: "#2193b0",
          color: "#2193b0",
          "&:hover": {
            borderColor: "#1e3c72",
            backgroundColor: "rgba(33, 147, 176, 0.04)",
          },
          borderRadius: 2,
          px: 4,
        }}
      >
        Reset Form
      </Button>
      <Button
        type="submit"
        variant="contained"
        size="medium"
        sx={{
          background: "linear-gradient(to right, #000428, #004e92)",
          color: "white",
          "&:hover": {
            background: "linear-gradient(to right, #003366, #006666)",
          },
          borderRadius: 2,
          px: 4,
        }}
      >
        {editData ? "Update Board" : "Create Board"}
      </Button>
    </Box>
  );
};

export default FormButtons;