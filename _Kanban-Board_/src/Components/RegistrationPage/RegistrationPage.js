
import { Grid } from "@mui/material";
import RegistrationForm from "./RegistrationForm";
import RegistrationInfo from "./RegistrationInfo";
import { SnackbarProvider } from "notistack";

export default function RegistrationPage() 
{
  return (
    <Grid container sx={{ minHeight: "80vh" }}>
      <Grid
        xs={12}
        sm={6}
        sx={{
          display: "flex",
          alignItems: "center",
          flexBasis:"50%",
          justifyContent: "center",
         
        }}
      >
      <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
      <RegistrationForm />
      </SnackbarProvider>
      </Grid>

      <Grid
        item
        xs={12}
        sm={6}
        sx={{
          
          display: "flex",
          alignItems: "center",
          flexBasis:"50%",
          justifyContent: "center",
        }}
      >
        <RegistrationInfo />
      </Grid>
    </Grid>
  );
}
