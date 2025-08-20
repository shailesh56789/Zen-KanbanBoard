import { Grid } from "@mui/material";
import { SnackbarProvider } from "notistack";
import PasswordResetinfo from "./PasswordResetInfo";
import PasswordResetForm from "./PasswordResetForm";

export default function PasswordResetPage() {
  return (
    <Grid container sx={{ minHeight: "80vh" }}>
      <Grid
        xs={12}
        sm={6}
        sx={{
          display: "flex",
          alignItems: "center",
          flexBasis: "50%",
          justifyContent: "center",
        }}
      >
        <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
          <PasswordResetForm />
        </SnackbarProvider>
      </Grid>

      <Grid
        item
        xs={12}
        sm={6}
        sx={{
          display: "flex",
          alignItems: "center",
          flexBasis: "50%",
          justifyContent: "center",
        }}
      >
        <PasswordResetinfo />
      </Grid>
    </Grid>
  );
}