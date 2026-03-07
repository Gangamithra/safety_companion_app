import React from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-64 bg-black text-white p-6">

        <h2 className="text-2xl font-bold mb-8">
          Safety Companion
        </h2>

        <nav className="space-y-4">

          <Link
            to="/dashboard"
            className="block hover:bg-gray-800 p-2 rounded"
          >
            Dashboard
          </Link>

          <Link
            to="/map"
            className="block hover:bg-gray-800 p-2 rounded"
          >
            Safety Map
          </Link>

          <Link
            to="/reports"
            className="block hover:bg-gray-800 p-2 rounded"
          >
            Report Incident
          </Link>

          <Link
            to="/login"
            className="block hover:bg-gray-800 p-2 rounded"
          >
            Logout
          </Link>

        </nav>

      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">

        <h1 className="text-3xl font-bold mb-6">
          Dashboard
        </h1>

        {/* Cards */}
        <div className="grid grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold">
              Safety Score
            </h3>
            <p className="text-4xl font-bold mt-3">
              85%
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold">
              Nearby Alerts
            </h3>
            <p className="mt-3 text-gray-600">
              2 incidents reported nearby
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold">
              Emergency Contacts
            </h3>
            <p className="mt-3 text-gray-600">
              3 contacts added
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;