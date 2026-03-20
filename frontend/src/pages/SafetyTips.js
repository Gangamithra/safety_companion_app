import React, { useState } from "react";

function SafetyTips() {

  const [checklist, setChecklist] = useState({
    location: false,
    battery: false,
    contacts: false,
    voice: false
  });

  const toggle = (key) => {
    setChecklist({ ...checklist, [key]: !checklist[key] });
  };

  return (

    <div className="min-h-screen bg-gray-900 text-white flex justify-center p-10">

      <div className="w-full max-w-5xl">

        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-10 text-center text-blue-400">
          Safety Center
        </h1>

        {/* SAFETY TIPS */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg mb-8 border border-gray-700">

          <h2 className="text-xl font-semibold mb-4 text-blue-300">
            Essential Safety Tips
          </h2>

          <ul className="space-y-3 text-gray-300 leading-relaxed">
            <li>• Prefer well-lit and crowded routes, especially at night</li>
            <li>• Avoid sharing personal details with strangers</li>
            <li>• Keep emergency contacts easily accessible</li>
            <li>• Inform someone you trust about your travel plan</li>
            <li>• Stay alert and trust your instincts in unfamiliar areas</li>
          </ul>

        </div>

        {/* CHECKLIST */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg mb-8 border border-gray-700">

          <h2 className="text-xl font-semibold mb-5 text-blue-300">
            Safety Checklist
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {Object.keys(checklist).map((key) => (

              <label
                key={key}
                className="flex items-center gap-3 bg-gray-700 p-4 rounded-xl cursor-pointer hover:bg-gray-600 transition"
              >

                <input
                  type="checkbox"
                  checked={checklist[key]}
                  onChange={() => toggle(key)}
                  className="w-5 h-5 accent-blue-500"
                />

                <span className="text-gray-200">

                  {key === "location" && "Location sharing enabled"}
                  {key === "battery" && "Battery above 30%"}
                  {key === "contacts" && "Emergency contacts updated"}
                  {key === "voice" && "Voice protection active"}

                </span>

              </label>

            ))}

          </div>

        </div>

        {/* PREPAREDNESS GUIDE */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">

          <h2 className="text-xl font-semibold mb-4 text-blue-300">
            Preparedness Guide
          </h2>

          <div className="grid md:grid-cols-2 gap-6 text-gray-300">

            <div className="bg-gray-700 p-4 rounded-xl">
              <h3 className="font-semibold mb-2 text-blue-400">
                Before You Travel
              </h3>
              <p className="text-sm">
                Ensure your phone is charged, emergency contacts are saved,
                and your route is planned in advance.
              </p>
            </div>

            <div className="bg-gray-700 p-4 rounded-xl">
              <h3 className="font-semibold mb-2 text-blue-400">
                During Travel
              </h3>
              <p className="text-sm">
                Stay aware of surroundings, avoid distractions, and keep
                location sharing enabled.
              </p>
            </div>

            <div className="bg-gray-700 p-4 rounded-xl">
              <h3 className="font-semibold mb-2 text-blue-400">
                In Emergency
              </h3>
              <p className="text-sm">
                Use SOS immediately, contact trusted people, and move
                towards crowded or safe zones.
              </p>
            </div>

            <div className="bg-gray-700 p-4 rounded-xl">
              <h3 className="font-semibold mb-2 text-blue-400">
                Smart Habits
              </h3>
              <p className="text-sm">
                Avoid isolated shortcuts, keep minimal valuables visible,
                and always trust your instincts.
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default SafetyTips;