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

      console.log("PAIR API RESPONSE:", data);

      if (data.pairingCode) {
        setCode(data.pairingCode);
        setStatus("Pairing code generated!");
      } else if (data.error) {
        setStatus(data.error);
      } else if (data.botId) {
        setStatus(
          `Bot created (${data.botId}). Waiting for pairing code...`
        );
      } else {
        setStatus("Could not generate pairing code.");
      }
    } catch (error) {
      console.error("PAIR DASHBOARD ERROR:", error);
      setStatus("Could not connect to ALSON-BOT on Render.");
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
