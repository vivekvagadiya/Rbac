// App.jsx

// import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoutes";
import UserPage from "./pages/User/User";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="/users" element={<UserPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;