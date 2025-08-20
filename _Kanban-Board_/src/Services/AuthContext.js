import { createContext, useContext, useState, useEffect } from "react";
import API from "../Services/API";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [teamId, setTeamId] = useState(null);
  const [role,setRole] = useState(null);
  const [userName, setUserName] = useState(null);

  const decodePayload = (jwt) => {
    try {
      const payloadBase64 = jwt.split(".")[1];
      return JSON.parse(atob(payloadBase64));
    } catch (e) {
      console.error("Invalid token", e);
      return {};
    }
  };

  const decodeUserId = (jwt) => decodePayload(jwt)?.userId || null;
  const decodeTeamId = (jwt) => decodePayload(jwt)?.teamId || null;
  const decodeRole = (jwt) => decodePayload(jwt)?.role || null;
  const decodeUserName = (jwt) => decodePayload(jwt)?.userName || null;

  const login = (newToken) => 
    {
    const decodedUserId = decodeUserId(newToken);
    const decodedTeamId = decodeTeamId(newToken);
    const decodedRole = decodeRole(newToken);
    const decodedUserName=decodeUserName(newToken);
    if (!decodedUserId && !decodedTeamId && !decodedRole && !decodedUserName) return;

    localStorage.setItem("token", newToken);
    API.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    setToken(newToken);
    setUserId(decodedUserId);
    setTeamId(decodedTeamId);
    setRole(decodedRole);
    setUserName(decodedUserName);
 
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete API.defaults.headers.common["Authorization"];
    setToken(null);
    setUserId(null);
    setTeamId(null);
    setRole(null);
    setUserName(null);
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      API.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
      setUserId(decodeUserId(savedToken));
      setTeamId(decodeTeamId(savedToken));
      setRole(decodeRole(savedToken));
      setUserName(decodeUserName(savedToken));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, userId, teamId, role, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
