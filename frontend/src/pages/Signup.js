import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5001/signup", formData);
      alert(res.data.message);
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.msg || "Signup failed");
    }
  };

  return (

    <div className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black"></div>

      <div className="absolute inset-0 animate-gradientMove 
                      bg-[linear-gradient(120deg,#1e3a8a,#6d28d9,#0ea5e9,#1e3a8a)] 
                      opacity-30 blur-2xl"></div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-sm px-6"
      >

        <h2 className="text-4xl font-bold mb-8 text-center">
          Create Account
        </h2>

        {/* NAME */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="w-full p-3 mb-4 rounded-lg bg-white/5 border border-gray-600 
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleChange}
          required
        />

        {/* EMAIL */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded-lg bg-white/5 border border-gray-600 
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleChange}
          required
        />

        {/* PASSWORD */}
        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            className="w-full p-3 pr-12 rounded-lg bg-white/5 border border-gray-600 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            required
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 cursor-pointer text-gray-400 hover:text-white"
          >
            {showPassword ? "🙈" : "👁"}
          </span>
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          className="w-full py-3 rounded-full bg-blue-600 hover:bg-blue-700"
        >
          Sign Up
        </button>

        {/* LOGIN LINK */}
        <p className="text-center text-gray-400 mt-6 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-400 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>

      </form>

      <style>
        {`
          @keyframes gradientMove {
            0% { transform: translateX(-20%) translateY(-20%); }
            50% { transform: translateX(20%) translateY(20%); }
            100% { transform: translateX(-20%) translateY(-20%); }
          }
          .animate-gradientMove {
            animation: gradientMove 12s ease infinite;
          }
        `}
      </style>

    </div>
  );
}

export default Signup;