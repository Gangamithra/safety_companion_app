import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

          <li className="cursor-pointer hover:text-gray-300">
            Dashboard
          </li>

          <li className="cursor-pointer hover:text-gray-300">
            Emergency Contacts
          </li>

          <li className="cursor-pointer hover:text-gray-300">
            Safety Tips
          </li>

          <li className="cursor-pointer hover:text-gray-300">
            Map
          </li>

        </ul>

      </div>

      {/* MAIN */}

      <div className="flex-1 p-10">

        <h1 className="text-3xl font-bold mb-8">
          Welcome {user.name}
        </h1>

        <div className="grid grid-cols-3 gap-6">

          {/* BOX 1 */}

          <div className="bg-white p-6 rounded-lg shadow">

            <h3 className="text-xl font-semibold mb-2">
              Emergency Contacts
            </h3>

            <p className="text-gray-600">
              Manage your emergency contacts
            </p>

          </div>

          {/* BOX 2 */}

          <div className="bg-white p-6 rounded-lg shadow">

            <h3 className="text-xl font-semibold mb-2">
              Safety Tips
            </h3>

            <p className="text-gray-600">
              View AI powered safety tips
            </p>

          </div>

          {/* BOX 3 */}

          <div className="bg-white p-6 rounded-lg shadow">

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