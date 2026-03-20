import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function ResetPassword() {

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await axios.post(
        "http://localhost:5001/api/simple-reset-password",
        { email, password }
      );

      alert("Password updated successfully");
      navigate("/login");

    } catch {
      alert("Error updating password");
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">

      <form onSubmit={handleSubmit} className="bg-gray-800 p-10 rounded-xl w-96">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Reset Password
        </h2>

        <p className="text-sm text-gray-400 mb-4 text-center">
          {email}
        </p>

        <div className="relative mb-6">

          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            className="w-full p-3 pr-12 rounded bg-gray-700 border border-gray-600"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 cursor-pointer"
          >
            {showPassword ? "🙈" : "👁"}
          </span>

        </div>

        <button className="w-full bg-blue-600 py-3 rounded">
          Update Password
        </button>

      </form>

    </div>
  );
}

export default ResetPassword;