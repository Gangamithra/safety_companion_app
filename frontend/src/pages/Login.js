import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [showPassword,setShowPassword] = useState(false);

  const handleLogin = async(e)=>{
    e.preventDefault();

    try{
      const res = await axios.post("http://localhost:5001/login",{
        email,
        password
      });

      localStorage.setItem("token",res.data.token);
      navigate("/dashboard");

    } catch(err){
      alert("Login Failed");
    }
  };

  return(

  <div className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">

    {/* 🔥 BACKGROUND */}
    <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black"></div>

    <div className="absolute inset-0 animate-gradientMove 
                    bg-[linear-gradient(120deg,#1e3a8a,#6d28d9,#0ea5e9,#1e3a8a)] 
                    opacity-30 blur-2xl"></div>

    <div className="absolute w-[700px] h-[700px] bg-blue-500 opacity-10 rounded-full blur-3xl top-[-200px] left-[-200px]"></div>
    <div className="absolute w-[600px] h-[600px] bg-purple-500 opacity-10 rounded-full blur-3xl bottom-[-200px] right-[-200px]"></div>

    {/* 🔥 FORM (NO BOX, JUST CLEAN CENTER) */}
    <form
      onSubmit={handleLogin}
      className="relative z-10 w-full max-w-sm px-6"
    >

      <h2 className="text-4xl font-bold mb-8 text-center">
        Welcome Back
      </h2>

      {/* EMAIL */}
      <div className="mb-5">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded-lg bg-white/5 border border-gray-600 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 
                     placeholder-gray-400"
          onChange={(e)=>setEmail(e.target.value)}
          required
        />
      </div>

      {/* PASSWORD */}
      <div className="mb-3 relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          className="w-full p-3 pr-12 rounded-lg bg-white/5 border border-gray-600 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 
                     placeholder-gray-400"
          onChange={(e)=>setPassword(e.target.value)}
          required
        />

        {/* 👁 EYE ICON */}
        <span
          onClick={()=>setShowPassword(!showPassword)}
          className="absolute right-3 top-3 cursor-pointer text-gray-400 hover:text-white"
        >
          {showPassword ? "🙈" : "👁"}
        </span>
      </div>

      {/* 🔐 FORGOT PASSWORD */}
      <div className="text-right mb-6">
        <span
          onClick={() => navigate("/forgotpassword")}
          className="text-sm text-blue-400 cursor-pointer hover:underline"
        >
          Forgot Password?
        </span>
      </div>

      {/* LOGIN BUTTON */}
      <button
        type="submit"
        className="w-full py-3 rounded-full font-medium 
                   bg-blue-600 hover:bg-blue-700 
                   transition shadow-lg"
      >
        Login
      </button>

      {/* SIGNUP */}
      <p className="text-center text-gray-400 mt-6 text-sm">
        Don't have an account?{" "}
        <span
          onClick={() => navigate("/signup")}
          className="text-blue-400 cursor-pointer hover:underline"
        >
          Sign Up
        </span>
      </p>

    </form>

    {/* 🔥 ANIMATION */}
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

export default Login;