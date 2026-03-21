import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { VoiceContext } from "../context/VoiceContext";

function Dashboard() {

  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const { startListening, stopListening, isListening } = useContext(VoiceContext);

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetch("https://safety-companion-backend.onrender.com/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.log(err));

  }, [navigate]);

  /* SOS */
  const sendSOS = () => {

    const token = localStorage.getItem("token");

    navigator.geolocation.getCurrentPosition(async (position) => {

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      try {
        const res = await axios.post(
          "https://safety-companion-backend.onrender.com/api/sos",
          { lat, lng },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        alert(res.data.message);
      } catch {
        alert("Failed to send SOS");
      }

    });
  };

  if (!user) return <div className="text-white p-10">Loading...</div>;

  return (

    <div className="flex min-h-screen bg-gray-900 text-white">

      {/* 🔥 MODERN SIDEBAR */}
      <div className="w-64 bg-gray-900/80 backdrop-blur-lg border-r border-gray-700 p-6">

        <h2 className="text-2xl font-bold mb-10 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          AI Companion
        </h2>

        <ul className="space-y-5 text-gray-300">

          <li onClick={() => navigate("/dashboard")} className="cursor-pointer hover:text-blue-400">
            Dashboard
          </li>

          <li onClick={() => navigate("/emergencycontacts")} className="cursor-pointer hover:text-blue-400">
            Emergency Contacts
          </li>

          <li onClick={() => navigate("/safetytips")} className="cursor-pointer hover:text-blue-400">
            Safety Tips
          </li>

          <li onClick={() => navigate("/map")} className="cursor-pointer hover:text-blue-400">
            Map
          </li>

        </ul>

      </div>

      {/* 🔥 MAIN CONTENT */}
      <div className="flex-1 px-10 py-8">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">

          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome, <span className="text-blue-400">{user.name}</span>
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Stay safe and connected at all times
            </p>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-4">

            {/* VOICE */}
            {!isListening ? (
              <button
                onClick={startListening}
                className="bg-gradient-to-r from-blue-600 to-purple-600 
                           hover:from-blue-700 hover:to-purple-700 
                           px-5 py-2.5 rounded-lg font-medium shadow-md"
              >
                🎤 Start
              </button>
            ) : (
              <button
                onClick={stopListening}
                className="bg-gray-700 hover:bg-gray-600 px-5 py-2.5 rounded-lg"
              >
                ⏹ Stop
              </button>
            )}

            {/* STATUS */}
            <span className={`text-sm ${isListening ? "text-green-400" : "text-gray-500"}`}>
              {isListening ? "Listening..." : "Inactive"}
            </span>

            {/* SOS */}
            <button
              onClick={sendSOS}
              className="bg-gradient-to-r from-red-500 to-pink-500 
                         hover:from-red-600 hover:to-pink-600 
                         px-6 py-2.5 rounded-lg font-semibold shadow-md"
            >
              🚨 SOS
            </button>

          </div>

        </div>

        {/* 🔥 MAIN GRID */}
        <div className="grid grid-cols-3 gap-6 mb-10">

          {/* CARD 1 */}
          <div
            onClick={() => navigate("/emergencycontacts")}
            className="bg-gray-800 p-6 rounded-2xl border border-gray-700 
                       hover:scale-[1.02] transition cursor-pointer"
          >
            <h3 className="text-xl font-semibold text-blue-400 mb-2">
              Emergency Contacts
            </h3>
            <p className="text-gray-400 text-sm">
              Manage trusted contacts
            </p>
          </div>

          {/* CARD 2 */}
          <div
            onClick={() => navigate("/safetytips")}
            className="bg-gray-800 p-6 rounded-2xl border border-gray-700 
                       hover:scale-[1.02] transition cursor-pointer"
          >
            <h3 className="text-xl font-semibold text-blue-400 mb-2">
              Safety Tips
            </h3>
            <p className="text-gray-400 text-sm">
              Smart suggestions & checklist
            </p>
          </div>

          {/* CARD 3 */}
          <div
            onClick={() => navigate("/map")}
            className="bg-gray-800 p-6 rounded-2xl border border-gray-700 
                       hover:scale-[1.02] transition cursor-pointer"
          >
            <h3 className="text-xl font-semibold text-blue-400 mb-2">
              Location Map
            </h3>
            <p className="text-gray-400 text-sm">
              Track safe routes
            </p>
          </div>

        </div>

        {/* 🔥 EXTRA SECTION (FILLS EMPTY SPACE) */}
        <div className="grid grid-cols-2 gap-6">

          {/* SAFETY STATUS */}
          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">

            <h3 className="text-lg font-semibold mb-4 text-blue-400">
              Safety Status
            </h3>

            <p className="text-gray-400 text-sm mb-3">
              Voice monitoring is currently:
            </p>

            <span className={`text-lg font-semibold ${
              isListening ? "text-green-400" : "text-gray-500"
            }`}>
              {isListening ? "Active & Protecting" : "Inactive"}
            </span>

          </div>

          {/* QUICK ACTIONS */}
          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">

            <h3 className="text-lg font-semibold mb-4 text-blue-400">
              Quick Actions
            </h3>

            <div className="flex flex-col gap-3">

              <button
                onClick={sendSOS}
                className="bg-gray-700 hover:bg-gray-600 py-2 rounded-lg text-sm"
              >
                Send Emergency Alert
              </button>

              <button
                onClick={() => navigate("/map")}
                className="bg-gray-700 hover:bg-gray-600 py-2 rounded-lg text-sm"
              >
                Open Safe Map
              </button>

              <button
                onClick={() => navigate("/emergencycontacts")}
                className="bg-gray-700 hover:bg-gray-600 py-2 rounded-lg text-sm"
              >
                View Contacts
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;