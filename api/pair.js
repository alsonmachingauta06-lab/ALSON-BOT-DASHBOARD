export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {
    const { number } = req.body || {};

    if (!number || !number.trim()) {
      return res.status(400).json({
        success: false,
        error: "WhatsApp number is required."
      });
    }

    const response = await fetch("https://alson-bot.onrender.com/api/pair", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        phone: number.trim()
      })
    });

    const data = await response.json();

    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Pair proxy error:", error);

    return res.status(500).json({
      success: false,
      error: "Could not connect to ALSON-BOT on Render."
    });
  }
}
