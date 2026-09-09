import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [server, setServer] = useState("Render");
  const [number, setNumber] = useState("");
  const [code, setCode] = useState("");
  const [botId, setBotId] = useState("");
  const [status, setStatus] = useState("Ready");
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);

  const stopChecking = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const checkStatus = async (id) => {
    try {
      const response = await fetch(
        `/api/status?id=${encodeURIComponent(id)}`
      );

      const data = await response.json();

      console.log("STATUS RESPONSE:", data);

      const currentStatus =
        data.status ||
        data.connection ||
        data.state ||
        "";

      if (
        currentStatus === "connected" ||
        currentStatus === "open" ||
        currentStatus === "online"
      ) {
        setStatus("🟢 Connected");
        stopChecking();
        return;
      }

      if (
        currentStatus === "disconnected" ||
        currentStatus === "closed" ||
        currentStatus === "logged_out"
      ) {
        setStatus("🔴 Disconnected");
        stopChecking();
        return;
      }

      setStatus(`🟡 ${currentStatus || "Starting..."}`);
    } catch (error) {
      console.error("STATUS CHECK ERROR:", error);
      setStatus("🟡 Checking connection...");
    }
  };

  const startStatusChecking = (id) => {
    stopChecking();
    checkStatus(id);

    timerRef.current = setInterval(() => {
      checkStatus(id);
    }, 3000);
  };

  const generateCode = async () => {
    if (!number.trim()) {
      setStatus("Please enter your WhatsApp number.");
      return;
    }

    setLoading(true);
    setCode("");
    setBotId("");
    stopChecking();
    setStatus("Requesting pairing code...");

    try {
      const response = await fetch("/api/pair", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          server,
          number: number.trim()
        })
      });

      const data = await response.json();

      console.log("PAIR RESPONSE:", data);

      if (data.pairingCode) {
        setCode(data.pairingCode);
        setStatus("🟡 Pairing code generated!");
      } else if (data.error) {
        setStatus(data.error);
        setLoading(false);
        return;
      }

      if (data.botId) {
        setBotId(data.botId);
        startStatusChecking(data.botId);
      }
    } catch (error) {
      console.error("PAIR ERROR:", error);
      setStatus("Could not connect to ALSON-BOT on Render.");
    }

    setLoading(false);
  };

  useEffect(() => {
    return () => stopChecking();
  }, []);

  return (
    <main className="container">
      <div className="card">

        <div className="hero">
          <img
            src="/gojo-dashboard.png"
            alt="Gojo"
          />

          <div className="heroText">
            <h1>ALSON XMD</h1>
            <p>MINI BOT DASHBOARD</p>
          </div>
        </div>

        <div className="content">

          <div className="status">
            <span className="dot"></span>
            SERVER: {server.toUpperCase()}
          </div>

          <div className="section">
            <label>🖥️ Choose Server</label>

            <select
              value={server}
              onChange={(e) => setServer(e.target.value)}
            >
              <option value="Render">
                Render
              </option>
            </select>
          </div>

          <div className="section">
            <label>📱 WhatsApp Number</label>

            <input
              type="tel"
              placeholder="+263XXXXXXXXX"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />

            <small>
              Enter your WhatsApp number with country code.
            </small>
          </div>

          <button
            onClick={generateCode}
            disabled={loading}
          >
            {loading
              ? "⚡ GENERATING..."
              : "⚡ GENERATE PAIRING CODE"}
          </button>

          {code && (
            <div className="codeBox">
              <p>🔑 YOUR PAIRING CODE</p>

              <strong>{code}</strong>

              <small>
                WhatsApp → Linked Devices → Link with phone number instead
              </small>
            </div>
          )}

          {botId && (
            <div className="status">
              🤖 BOT ID
              <br />
              {botId}
            </div>
          )}

          <div className="status">
            <span className="dot"></span>
            {status}
          </div>

          <footer>
            Powered by <b>Alson Machingauta</b>
          </footer>

        </div>
      </div>
    </main>
  );
}
