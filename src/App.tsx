import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./layout/Home";
import Login from "./layout/Login";
import Register from "./layout/Register";
import Layout from "./layout/Layout";
import Profile from "./layout/Profile";
import ForeignProfile from "./layout/ForeignProfile";
import Post from "./layout/UploadPost";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout/>}>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile /> } />
              <Route path="/profile/:username" element={<ForeignProfile />} />
              <Route path="/upload" element={<Post/>} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
