import React, { createContext, useState, useRef } from "react";
import axios from "axios";

export const VoiceContext = createContext();

export const VoiceProvider = ({ children }) => {

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const startListening = () => {

    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech Recognition not supported");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = async (event) => {

      const transcript =
        event.results[event.results.length - 1][0].transcript.toLowerCase();

      console.log("Heard:", transcript);

      const distressWords = ["help", "danger", "save me", "attack", "emergency"];

      const isDanger = distressWords.some(word =>
        transcript.includes(word)
      );

      if (isDanger) {
        triggerSOS();
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const triggerSOS = async () => {

    const token = localStorage.getItem("token");

    navigator.geolocation.getCurrentPosition(async (position) => {

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      try {
        await axios.post(
          "http://localhost:5001/api/sos",
          { lat, lng },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        alert("🚨 SOS Triggered via Voice!");
      } catch {
        alert("SOS Failed");
      }

    });
  };

  return (
    <VoiceContext.Provider
      value={{ startListening, stopListening, isListening }}
    >
      {children}
    </VoiceContext.Provider>
  );
};