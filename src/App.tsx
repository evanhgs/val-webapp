import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./layout/Home";
import Login from "./layout/Login";
import Register from "./layout/Register";
import Layout from "./layout/Layout";
import Profile from "./layout/Profile";
import UploadPost from "./layout/UploadPost";
import ShowPost from "./layout/Post";
import { AlertProvider } from "./components/AlertContext.tsx";
import Explorer from "./layout/Explorer.tsx";
import {NotFound} from "./components/NotFound.tsx";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AlertProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/:username" element={<Profile />} />
                <Route path="/upload" element={<UploadPost />} />
                <Route path="/post/:postId" element={<ShowPost />} />
                <Route path="/explorer" element={<Explorer />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AlertProvider>
    </AuthProvider>
  );
};

export default App;
