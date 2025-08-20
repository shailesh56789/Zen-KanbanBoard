import { Grid } from "@mui/material";
import { SnackbarProvider } from "notistack";
import EmailSubmissionForm from "./EmailSubmissionForm";
import EmailSubmissionInfo from "./EmailSubmissionInfo";

export default function EmailSubmissionPage() {
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
          <EmailSubmissionForm />
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
        <EmailSubmissionInfo />
      </Grid>
    </Grid>
  );
}