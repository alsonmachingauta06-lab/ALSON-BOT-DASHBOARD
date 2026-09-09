import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [number, setNumber] = useState("");
  const [code, setCode] = useState("");
  const [botId, setBotId] = useState("");
  const [status, setStatus] = useState("SYSTEM READY");
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
        setStatus("● BOT CONNECTED");
        stopChecking();
        return;
      }

      if (
        currentStatus === "disconnected" ||
        currentStatus === "closed" ||
        currentStatus === "logged_out"
      ) {
        setStatus("● BOT DISCONNECTED");
        stopChecking();
        return;
      }

      setStatus(
        `● ${currentStatus
          ? currentStatus.toUpperCase()
          : "CONNECTING..."}`
      );
    } catch {
      setStatus("● CHECKING CONNECTION...");
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
      setStatus("● ENTER WHATSAPP NUMBER");
      return;
    }

    setLoading(true);
    setCode("");
    setBotId("");
    stopChecking();
    setStatus("● GENERATING PAIRING CODE...");

    try {
      const response = await fetch("/api/pair", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          number: number.trim()
        })
      });

      const data = await response.json();

      if (data.pairingCode) {
        setCode(data.pairingCode);
        setStatus("● PAIRING CODE READY");
      } else if (data.error) {
        setStatus(`● ${data.error.toUpperCase()}`);
        setLoading(false);
        return;
      }

      if (data.botId) {
        setBotId(data.botId);
        startStatusChecking(data.botId);
      }
    } catch (error) {
      console.error(error);
      setStatus("● CONNECTION ERROR");
    }

    setLoading(false);
  };

  useEffect(() => {
    return () => stopChecking();
  }, []);

  return (
    <main className="gojoPage">

      <div className="gojoOverlay"></div>

      <section className="dashboard">

        <header className="brand">
          <div className="brandLine"></div>

          <h1>ALSON XMD</h1>

          <p>MINI BOT SYSTEM</p>

          <div className="brandLine"></div>
        </header>

        <div className="systemStatus">
          <span className="statusLight"></span>
          {status}
        </div>

        <div className="panel">

          <div className="panelTitle">
            <span>01</span>
            LINK WHATSAPP
          </div>

          <label>WHATSAPP NUMBER</label>

          <input
            type="tel"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="+263XXXXXXXXX"
          />

          <p className="hint">
            Enter your number with country code.
          </p>

          <button
            onClick={generateCode}
            disabled={loading}
          >
            {loading
              ? "GENERATING..."
              : "GENERATE PAIRING CODE"}
          </button>

        </div>

        {code && (
          <div className="codePanel">

            <div className="panelTitle">
              <span>02</span>
              PAIRING CODE
            </div>

            <div className="pairCode">
              {code}
            </div>

            <p>
              WhatsApp → Linked Devices → Link with
              phone number instead
            </p>

          </div>
        )}

        {botId && (
          <div className="botPanel">

            <div className="panelTitle">
              <span>03</span>
              BOT SESSION
            </div>

            <div className="botId">
              {botId}
            </div>

          </div>
        )}

        <footer>
          <span>ALSON XMD</span>
          <b>POWERED BY ALSON MACHINGAUTA</b>
        </footer>

      </section>

    </main>
  );
}
