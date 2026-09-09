export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Bot ID is required."
      });
    }

    const response = await fetch(
      `https://alson-bot-mini.onrender.com/api/status/${encodeURIComponent(id)}`
    );

    const data = await response.json();

    return res.status(response.status).json(data);

  } catch (error) {
    console.error("Status proxy error:", error);

    return res.status(500).json({
      success: false,
      error: "Could not connect to ALSON-BOT Mini API."
    });
  }
}
