import { SnackbarProvider } from "notistack";
import { Grid } from "@mui/material";
import LoginForm from "./LoginForm";
import LoginInfo from "./LoginInfo";

export default function LoginPage() 
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
      <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
      <LoginForm />
      </SnackbarProvider>
      </Grid>

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
        <LoginInfo />
      </Grid>
    </Grid>
  );
}
