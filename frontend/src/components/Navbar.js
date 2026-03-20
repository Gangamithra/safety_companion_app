import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");   // redirect to home
    window.location.reload(); // refresh navbar state
  };

  return (
    <nav className="bg-black text-white p-4 flex justify-between items-center">

      <h1 className="text-xl font-bold">
        Safety Companion
      </h1>

      <div className="space-x-6">

        <Link to="/">Home</Link>

        <Link to="/login">Login</Link>

        <Link to="/signup">Signup</Link>

        {token && <Link to="/dashboard">Dashboard</Link>}

        {token && (
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded"
          >
            Logout
          </button>
        )}

      </div>

    </nav>
  );
}

export default Navbar;