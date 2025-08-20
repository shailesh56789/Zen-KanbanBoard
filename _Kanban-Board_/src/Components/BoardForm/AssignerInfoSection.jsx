import { Box, TextField } from "@mui/material";

const AssignerInfoSection = ({ register, errors }) => {
  return (
    <Box display="flex" gap={2}>
      <TextField
        label="Assigner ID"
        type="number"
        size="small"
        disabled
        {...register("assigneeId", { required: "Assignee ID is required" })}
        error={!!errors.assigneeId}
        helperText={errors.assigneeId?.message}
        fullWidth
      />
      <TextField
        label="Assigner Name"
        size="small"
        disabled
        {...register("assigneeName", { required: "Assignee Name is required" })}
        error={!!errors.assigneeName}
        helperText={errors.assigneeName?.message}
        fullWidth
      />
    </Box>
  );
};

export default AssignerInfoSection;