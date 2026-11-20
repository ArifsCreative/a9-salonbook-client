
"use client";

import { useEffect, useState } from "react";

type HealthResponse = {
  success: boolean;
  message: string;
};

export default function BackendStatus() {
  const [message, setMessage] = useState("Checking backend connection...");
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
          throw new Error("Backend API URL is missing");
        }

        const response = await fetch(`${apiUrl}/api/health`);

        if (!response.ok) {
          throw new Error("Backend request failed");
        }

        const data: HealthResponse = await response.json();

        setConnected(data.success);
        setMessage(data.message);
      } catch {
        setConnected(false);
        setMessage("Unable to connect to backend");
      }
    };

    checkBackend();
  }, []);

  return (
    <div className="rounded-lg border p-6">
      <h2 className="text-xl font-semibold">
        Backend Connection Status
      </h2>

      <p className="mt-3">
        Status: {connected ? "Connected" : "Not connected"}
      </p>

      <p className="mt-2">{message}</p>
    </div>
  );
}
