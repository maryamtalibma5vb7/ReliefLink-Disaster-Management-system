import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Disasters from "./pages/Disasters";
import Resources from "./pages/Resources";
import Allocations from "./pages/Allocations";
import Reports from "./pages/Reports";
import Layout from "./components/Layout";

function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("relieflink_user")); }
    catch { return null; }
  });

  const handleLogin = ({ user: loggedUser, token }) => {
    localStorage.setItem("relieflink_user", JSON.stringify(loggedUser));
    localStorage.setItem("relieflink_token", token || "");
    setUser(loggedUser);
  };

  const logout = () => {
    localStorage.removeItem("relieflink_user");
    localStorage.removeItem("relieflink_token");
    setUser(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
        <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
        <Route path="/" element={user ? <Layout user={user} logout={logout} /> : <Navigate to="/login" />}>
          <Route index element={<Dashboard user={user} />} />
          <Route path="disasters" element={<Disasters user={user} />} />
          <Route path="resources" element={<Resources user={user} />} />
          <Route path="allocations" element={<Allocations user={user} />} />
          <Route path="reports" element={<Reports user={user} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
