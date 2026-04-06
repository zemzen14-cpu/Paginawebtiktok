const express = require("express");
const ytdlp = require("yt-dlp-exec");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("🔥 Backend PRO activo");
});

app.get("/download", async (req, res) => {
  const url = req.query.url;
  const type = req.query.type || "video";

  if (!url) {
    return res.status(400).json({ error: "URL faltante" });
  }

  try {
    // 🔥 Obtener info
    const info = await ytdlp(url, {
      dumpSingleJson: true,
      noWarnings: true,
      preferFreeFormats: true
    });

    if (!info || !info.url) {
      return res.status(500).json({ error: "No se pudo obtener el video" });
    }

    // 🎬 VIDEO
    if (type === "video") {
      return res.json({
        url: info.url
      });
    }

    // 🎵 AUDIO (no mp3 puro pero funciona)
    if (type === "mp3") {
      return res.json({
        url: info.url
      });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

app.listen(PORT, () => {
  console.log("Servidor PRO corriendo");
});
