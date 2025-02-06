"use client";

import { useState, useEffect } from "react";
import { messaging, getToken } from "@/lib/firebase";

export default function Home() {
  const [deviceToken, setDeviceToken] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration);
        })
        .catch((error) =>
          console.error("Service Worker registration failed:", error)
        );
    }
  }, []);

  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const token = await getToken(messaging, {
          vapidKey:
            "BHVjbcSzFCOBM09yA4Rh70z_s41-HCrNDzaC1NfkF9bLGvvdPAHd4tGFOAff_dpKI2H93GriDodpW_9g1xxPaM8",
        });
        console.log("Device Token:", token);
        setDeviceToken(token);
        sendTokenToServer(token);
      } else {
        setMessage("Notification permission denied");
      }
    } catch (error) {
      setMessage("Error getting token");
      console.error(error);
    }
  };

  const sendTokenToServer = async (token) => {
    const res = await fetch("/api/saveToken", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    const data = await res.json();
    setMessage(data.message || data.error);
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
