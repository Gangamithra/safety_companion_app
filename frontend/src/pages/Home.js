import React from "react";

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">

      <h1 className="text-5xl font-bold text-gray-800 mb-6">
        AI Safety Companion
      </h1>

      <p className="text-lg text-gray-600 mb-8 text-center max-w-xl">
        A smart travel safety platform that helps women and solo travelers
        navigate cities safely using AI powered analysis and real-time alerts.
      </p>

      <div className="space-x-4">
        <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800">
          Get Started
        </button>

        <button className="border border-black px-6 py-3 rounded-lg hover:bg-black hover:text-white">
          Learn More
        </button>
      </div>

    </div>
  );
}

export default Home;