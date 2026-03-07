import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleLogin = async(e)=>{
    e.preventDefault();

    try{

      const res = await axios.post("http://localhost:5001/login",{
        email,
        password
      });

      localStorage.setItem("token",res.data.token);

      navigate("/dashboard");

    }
    catch(err){
      alert("Login Failed");
    }

  };

  return(

  <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">

    <form
      onSubmit={handleLogin}
      className="bg-gray-800 p-10 rounded-xl shadow-xl w-96"
    >

      <h2 className="text-3xl font-bold mb-6 text-center">
        Login
      </h2>

      <label className="block mb-2 text-gray-300">
        Email
      </label>

      <input
        type="email"
        placeholder="Enter Email"
        className="w-full p-3 mb-4 rounded bg-gray-700 border border-gray-600"
        onChange={(e)=>setEmail(e.target.value)}
      />

      <label className="block mb-2 text-gray-300">
        Password
      </label>

      <input
        type="password"
        placeholder="Enter Password"
        className="w-full p-3 mb-6 rounded bg-gray-700 border border-gray-600"
        onChange={(e)=>setPassword(e.target.value)}
      />

      <button
        type="submit"
        className="w-full bg-blue-600 py-3 rounded hover:bg-blue-700"
      >
        Login
      </button>

    </form>

  </div>

  );
}

export default Login;