import { Box, TextField, Typography, Button, IconButton } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

const BoardColumnsSection = ({ columnFields, register, errors, appendColumn, removeColumn }) => {
  return (
    <>
      <Typography variant="subtitle2" fontWeight={600} sx={{ mt: 2 }}>
        Board Columns
      </Typography>
      {columnFields.map((col, index) => (
        <Box display="flex" gap={1} key={col.id || index}>
          <TextField
            label={`Column ${index + 1}`}
            {...register(`boardColumns.${index}.value`, { required: "Column value is required" })}
            size="small"
            sx={{ width: "90%" }}
            error={!!errors.boardColumns?.[index]?.value}
            helperText={errors.boardColumns?.[index]?.value?.message}
          />
          <IconButton onClick={() => removeColumn(index)} color="error" size="small">
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ))}
      <Button
        variant="contained"
        sx={{
          background: "linear-gradient(to right, #2193b0, #6dd5ed)",
          color: "white",
          "&:hover": {
            background: "linear-gradient(to right, #1e3c72, #2a5298)",
          },
          width: "45%",
        }}
        size="small"
        onClick={() => appendColumn({ value: "" })}
        startIcon={<Add />}
      >
        Add Column
      </Button>
    </>
  );
};

export default BoardColumnsSection;