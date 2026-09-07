import { useState } from "react";

export default function Home() {
  const [server, setServer] = useState("Render");
  const [number, setNumber] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("Ready");
  const [loading, setLoading] = useState(false);

  const generateCode = async () => {
    if (!number.trim()) {
      setStatus("Please enter your WhatsApp number.");
      return;
    }

    setLoading(true);
    setCode("");
    setStatus("Requesting pairing code...");

    try {
      // Backend endpoint will be connected after we finish the dashboard.
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

      if (data.code) {
        setCode(data.code);
        setStatus("Pairing code generated!");
      } else {
        setStatus(data.error || "Could not generate pairing code.");
      }
    } catch (error) {
      setStatus("Dashboard is not connected to the bot backend yet.");
    }

    setLoading(false);
  };

  return (
    <main className="container">
      <div className="card">

        <div className="logo">🤖</div>

        <h1>ALSON-BOT</h1>
        <p className="subtitle">MINI BOT DASHBOARD</p>

        <div className="section">
          <label>🖥️ Choose Server</label>

          <select
            value={server}
            onChange={(e) => setServer(e.target.value)}
          >
            <option value="Render">Render</option>
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

        <button onClick={generateCode} disabled={loading}>
          {loading ? "GENERATING..." : "⚡ GENERATE PAIRING CODE"}
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

        <div className="status">
          <span className="dot"></span>
          {status}
        </div>

        <footer>
          Powered by <b>Alson Machingauta</b>
        </footer>

      </div>
    </main>
  );
}
