"use client";

import { useState, useEffect } from "react";
import { messaging, getToken } from "@/lib/firebase"; // Make sure this path is correct

export default function Home() {
  const [deviceToken, setDeviceToken] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Function to handle service worker registration
    const registerServiceWorker = () => {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .register("/firebase-messaging-sw.js")
          .then((registration) => {
            console.log("Service Worker registered:", registration);
          })
          .catch((error) => {
            console.error("Service Worker registration failed:", error);
          });
      }
    };

    // Function to handle the event
    const handleEvent = () => {
      console.log("Event triggered");
    };

    // Check if window and addEventListener are available
    if (typeof window !== "undefined" && window.addEventListener) {
      registerServiceWorker(); // Call the service worker registration
      window.addEventListener("event", handleEvent);

      // Cleanup on unmount
      return () => {
        window.removeEventListener("event", handleEvent);
      };
    }
  }, []); // Empty dependency array ensures this runs only once

  const requestPermission = async () => {
    try {
      // Check for Notification API support
      if (!("Notification" in window)) {
        setMessage("This browser does not support desktop notification");
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        // Check if messaging is defined before using it
        if (!messaging) {
          setMessage("Firebase messaging is not initialized.");
          return;
        }

        const token = await getToken(messaging, {
          vapidKey:
            "BHVjbcSzFCOBM09yA4Rh70z_s41-HCrNDzaC1NfkF9bLGvvdPAHd4tGFOAff_dpKI2H93GriDodpW_9g1xxPaM8",
        });
        console.log("Device Token:", token);
        setDeviceToken(token);
        sendTokenToServer(token); // Make sure this function exists
      } else {
        setMessage("Notification permission denied");
      }
    } catch (error) {
      setMessage("Error getting token");
      console.error(error);
    }
  };

  const sendTokenToServer = async (token) => {
    try {
      const res = await fetch("/api/saveToken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      setMessage(data.message || data.error);
    } catch (error) {
        console.error("Error sending token to server:", error);
        setMessage("Failed to send token to server."); // Provide user feedback
    }
  };

  return (
    <div>
      <h1>FCM Token Generator</h1>
      <button onClick={requestPermission}>Get Token</button>
      {deviceToken && <p>Token: {deviceToken}</p>}
      {message && <p>{message}</p>}
    </div>
  );
}