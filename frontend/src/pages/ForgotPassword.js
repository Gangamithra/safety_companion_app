import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {

  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // redirect with email
    navigate("/reset-password", { state: { email } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">

      <form onSubmit={handleSubmit} className="bg-gray-800 p-10 rounded-xl w-96">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Forgot Password
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 mb-6 rounded bg-gray-700 border border-gray-600"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button className="w-full bg-blue-600 py-3 rounded">
          Continue
        </button>

      </form>

    </div>
  );
}

export default ForgotPassword;