import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";
import { Home, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from '../../Services/AuthContext';


export default function Header() 
{
  const { role, logout, userId, token, userName} = useAuth();
  
  const navigate = useNavigate();

  const handleLogout = () =>
  {
  logout();
  navigate("/userlogin"); 
  };
 
  
  return (
    <AppBar position="static" sx={{ background: "linear-gradient(135deg, rgb(98, 1, 75),rgb(92, 71, 111), rgb(0, 40, 40))",
     p: 1 }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
       
    <Box>
          
    <Typography
      variant="h3"
      sx={{
        fontWeight: "bold",
        color: "#fff",
        textAlign: "center",
        animation: "glow 1.5s ease-in-out infinite alternate",
        "@keyframes glow": {
          from: {
            textShadow: "0 0 5px #fff, 0 0 10px #89f6fe, 0 0 15px #89f6fe",
          },
          to: {
            textShadow: "0 0 10px #fff, 0 0 20px rgb(3, 69, 68), 0 0 30px rgb(2, 66, 78)",
          },
        },
      }}
    >
      ZENKANBAN
    </Typography>
         
    </Box>
   <Box
  sx={{
    display: "flex",
    alignItems: "center",
    gap: 2,
    padding: "12px 20px",
    background: "linear-gradient(135deg, rgba(137, 246, 254, 0.1) 0%, rgba(3, 69, 68, 0.2) 100%)",
    borderRadius: "12px",
    border: "1px solid rgba(137, 246, 254, 0.3)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    position: "relative",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "2px",
      background:token? "linear-gradient(90deg, transparent,rgb(255, 255, 255), transparent)"
      :"linear-gradient(90deg, transparent,rgb(255, 110, 245), transparent)",
      animation: "shimmer 2s infinite",
    },
    "@keyframes shimmer": {
      "0%": { transform: "translateX(-100%)" },
      "100%": { transform: "translateX(100%)" },
    },
  }}
>
  {/* User Avatar/Icon */}
  <Box
    sx={{
      width: 50,
      height: 50,
      borderRadius: "50%",
      background: "linear-gradient(135deg,rgb(255, 134, 203) 0%, rgb(14, 80, 98) 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: token
      ? "0 0 10px rgb(255, 255, 255)"
      : "0 0 5px rgb(124, 231, 255)",
      animation:token? "pulse 2s infinite" :"none",
      "@keyframes pulse": {
        "0%, 100%": { transform: "scale(1)" },
        "50%": { transform: "scale(1.05)" },
      },
    }}
  >
    <Typography
      variant="h6"
      sx={{
        color: "rgb(255, 255, 255)",
        fontWeight: "bold",
        fontSize: "27px",
      }}
    >
      {userName?.charAt(0)?.toUpperCase() || role?.charAt(0)?.toUpperCase()}
    </Typography>
  </Box>

  {/* User Info */}
  {token&&(
  <Box sx={{ flex: 1 }}>
    {token &&(
    <Typography
      variant="body2"
      sx={{
        color: "rgba(255, 255, 255, 0.67)",
        fontSize: "12px",
        fontWeight: "500",
        letterSpacing: "0.5px",
        textTransform: "uppercase",
        marginBottom: "2px",
      }}
    >
      Role : {role==="ADMIN"? "Manager":"Employee"}
    </Typography>
    )}
    <Typography
      variant="h6"
      sx={{
        color: "rgb(217, 157, 255)",
        fontWeight: "600",
        fontSize: "16px",
        lineHeight: 1.2,
      }}
    >
      Name : {userName}
    </Typography>
    <Typography
      variant="caption"
      sx={{
        color: "rgba(254, 252, 255, 0.8)",
        fontSize: "15px",
        fontFamily: "monospace",
      }}
    >
      UserID: {userId}
    </Typography>
  </Box>
  )}

  {/* Status Indicator */}
  
  <Box
    sx={{
      width: 10,
      height: 10,
      borderRadius: "50%",
      backgroundColor:token? "rgb(0, 255, 0)": "rgb(255, 0, 51)",
      boxShadow: token
      ? "0 0 10px rgb(192, 255, 125)"
      : "0 0 10px rgb(252, 101, 101)",
      animation: "blink 1.5s infinite",
      "@keyframes blink": {
        "0%, 100%": { opacity: 1 },
        "50%": { opacity: 0.3 },
      },
    }}
  />

    <Box>
          {token&&(
          <>
            <Button
            
            onClick={() => navigate("/dashboard")}
            >
            <Home color="#fff" size={30} />
            </Button>
            <Button
            
            onClick={handleLogout}
            >
            <LogOut color="#fff" size={30} />
            </Button>
          </>
          )}
          
      </Box>
    </Box>

        {/* You can add more right-side items here if needed */}
      </Toolbar>
    </AppBar>
  );
}
