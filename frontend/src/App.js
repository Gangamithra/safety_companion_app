import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import MapPage from "./pages/MapPage";
import EmergencyContacts from "./pages/EmergencyContacts";
import SafetyTips from "./pages/SafetyTips";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

/* ✅ IMPORT CONTEXT */
import { VoiceProvider } from "./context/VoiceContext";

function App() {
  return (
    <VoiceProvider>   {/* ✅ GLOBAL WRAP */}

      <Router>

        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/emergencycontacts" element={<EmergencyContacts />} />
          <Route path="/safetytips" element={<SafetyTips />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>

      </Router>

    </VoiceProvider>
  );
}

export default App;