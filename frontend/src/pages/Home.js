import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {

  const navigate = useNavigate();

  return (

    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white overflow-hidden">

      {/* 🔥 FLOATING BACKGROUND BLOBS */}
      <div className="absolute w-96 h-96 bg-blue-500 opacity-20 rounded-full blur-3xl top-[-100px] left-[-100px] animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-purple-500 opacity-20 rounded-full blur-3xl bottom-[-100px] right-[-100px] animate-pulse"></div>
      <div className="absolute w-72 h-72 bg-pink-500 opacity-10 rounded-full blur-3xl top-[40%] left-[60%] animate-pulse"></div>

      {/* 🔥 CONTENT */}
      <div className="relative z-10 text-center px-6 max-w-2xl">

        <h1 className="text-5xl md:text-6xl font-bold mb-6 
                       bg-gradient-to-r from-blue-400 to-purple-500 
                       bg-clip-text text-transparent">
          Safety Companion
        </h1>

        <p className="text-lg text-gray-300 mb-10 leading-relaxed">
          Your smart safety partner for real-time protection, emergency alerts,
          and secure travel navigation — designed to keep you safe wherever you go.
        </p>

        {/* BUTTONS */}
        <div className="flex gap-4 justify-center">

          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3 rounded-lg font-medium 
                       bg-gradient-to-r from-blue-600 to-purple-600 
                       hover:from-blue-700 hover:to-purple-700 
                       shadow-lg transition"
          >
            Get Started
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="px-8 py-3 rounded-lg font-medium 
                       border border-gray-600 
                       hover:bg-gray-800 transition"
          >
            Learn More
          </button>

        </div>

      </div>

    </div>

  );
}

export default Home;