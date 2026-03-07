import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5001/api/auth/login", formData);
      localStorage.setItem("token", res.data.token); // store JWT
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-10 rounded-xl shadow-xl w-96">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-100">Login</h2>

        <label className="block mb-2 text-gray-300">Email</label>
        <input type="email" name="email" placeholder="Your Email"
          className="w-full p-3 mb-4 rounded bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleChange} required />

        <label className="block mb-2 text-gray-300">Password</label>
        <input type="password" name="password" placeholder="Your Password"
          className="w-full p-3 mb-6 rounded bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleChange} required />

        <button type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-bold transition-colors">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;