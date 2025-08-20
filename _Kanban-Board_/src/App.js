import { BrowserRouter as Router, Routes, Route }  from "react-router-dom";
import Header from "../src/Components/Header/Header";
import Footer from "../src/Components/Footer/Footer";
import LoginPage from "./Components/LoginPage/LoginPage";
import RegistrationPage from "./Components/RegistrationPage/RegistrationPage";
import LandingPage from "./Components/LandingPage/LandingPage";
import { Box } from "@mui/material";
import EmailSubmissionPage from "./Components/EmailSubmissionPage/EmailSubmissionPage";
import PasswordResetPage from "./Components/PasswordRestPage/PasswordResetPage";
import DashboardPage from "./Components/DashboardPage/DashboardPage";
import ProtectedRoutes from "./Services/ProtectedRoutes";
import BoardView from "./Components/DashboardPage/BoardView";
import PageNotFound from "./Components/PageNotFound/PageNotFound";
import TaskList from "./Components/KanbanBoardView/TaskList";
import AddEditForm from "./Components/KanbanBoardView/AddEditForm";
import CardView from "./Components/KanbanBoardView/CardView";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TaskStatusUpdate from "./Components/KanbanBoardView/TaskStatusUpdate"



//shailesh
export default function App() 
{

  return (
  <Router>
  <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
    <Header/>
     <Box component="main" sx={{ flex: 1 }}>

      <Routes>
          <Route path="/" element={<LandingPage/>}></Route>
          <Route path="/Userlogin" element={<LoginPage/>}></Route>
          <Route path="/UserRegistration" element={<RegistrationPage/>}></Route>
          <Route path="/PasswordReset" element={<EmailSubmissionPage/>}></Route>
          <Route path="/reset-password" element={<PasswordResetPage/>}></Route>
          <Route element={<ProtectedRoutes />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/boards/:boardId" element={<BoardView/>} />
          <Route path="/boards/:boardId/tasks" element={<TaskList />} />
          <Route path="/cardEdit/:id" element={<AddEditForm />} />
          <Route path="/task/status-update/:taskId" element={<TaskStatusUpdate />} />
          <Route path="/card/:id" element={<CardView />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
      </Box>
    <Footer/>
  </Box>
  </Router>
  );
}

