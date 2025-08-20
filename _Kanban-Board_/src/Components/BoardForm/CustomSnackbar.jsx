import { Snackbar, Alert } from "@mui/material";

const CustomSnackbar = ({ open, message, severity, onClose }) => {
  const getSeverity = () => {
    if (severity) return severity;
    if (!message) return "info";
    const lower = message.toLowerCase();
    if (lower.includes("error") || lower.includes("fail")) return "error";
    if (lower.includes("success") || lower.includes("updated")) return "success";
    return "info";
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={2500}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert 
        onClose={onClose} 
        severity={getSeverity()}  // ✅ FIXED
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
