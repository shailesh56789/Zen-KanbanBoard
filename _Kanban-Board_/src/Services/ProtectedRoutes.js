
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoutes() 
{
  const token = localStorage.getItem("token");
  const isAuth = !!token;
  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
}
