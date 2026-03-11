import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {

  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:5001/api/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.log(err));

  }, [navigate]);

  /* ---------------- SOS FUNCTION ---------------- */

  const sendSOS = () => {

    const token = localStorage.getItem("token");

    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(

      async (position) => {

        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {

          const res = await axios.post(
            "http://localhost:5001/api/sos",
            { lat, lng },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          alert(res.data.message);

        }
        catch (err) {
          console.log(err);
          alert("Failed to send SOS alert");
        }

      },

      () => {
        alert("Location access denied");
      }

    );

  };

  if (!user) {
    return <div className="p-10 text-center text-xl">Loading...</div>;
  }

  return (

    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}

      <div className="w-64 bg-black text-white p-6">

        <h2 className="text-2xl font-bold mb-6">
          AI Companion
        </h2>

        <ul className="space-y-4">

          <li 
            className="cursor-pointer hover:text-gray-300"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </li>

          <li 
            className="cursor-pointer hover:text-gray-300"
            onClick={() => navigate("/emergencycontacts")}
          >
            Emergency Contacts
          </li>

          <li className="cursor-pointer hover:text-gray-300">
            Safety Tips
          </li>

          <li 
            className="cursor-pointer hover:text-gray-300"
            onClick={() => navigate("/map")}
          >
            Map
          </li>

        </ul>

      </div>

      {/* MAIN */}

      <div className="flex-1 p-10">

        <h1 className="text-3xl font-bold mb-8">
          Welcome {user.name}
        </h1>

        {/* SOS BUTTON */}

        <div className="mb-10">

          <button
            onClick={sendSOS}
            className="bg-red-600 text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-red-700 transition"
          >
            🚨 SEND SOS ALERT
          </button>

        </div>

        <div className="grid grid-cols-3 gap-6">

          {/* EMERGENCY CONTACTS CARD */}

          <div
            className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition"
            onClick={() => navigate("/emergencycontacts")}
          >

            <h3 className="text-xl font-semibold mb-2">
              Emergency Contacts
            </h3>

            <p className="text-gray-600">
              Manage your emergency contacts
            </p>

          </div>

          {/* SAFETY TIPS CARD */}

          <div className="bg-white p-6 rounded-lg shadow">

            <h3 className="text-xl font-semibold mb-2">
              Safety Tips
            </h3>

            <p className="text-gray-600">
              View AI powered safety tips
            </p>

          </div>

          {/* MAP CARD */}

          <div
            className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition"
            onClick={() => navigate("/map")}
          >

            <h3 className="text-xl font-semibold mb-2">
              Location Map
            </h3>

            <p className="text-gray-600">
              Share and track safe routes
            </p>

          </div>

        </div>

      </div>

    </div>

  );
}

export default Dashboard;