const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 10000;

// 🌐 Ruta principal
app.get("/", (req, res) => {
  res.send("🔥 Backend activo");
});

// 🎬 Ruta de descarga
app.get("/download", async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: "URL faltante" });
  }

  try {
    const response = await fetch(`https://www.tikwm.com/api/?url=${url}`);
    const data = await response.json();

    console.log(data); // DEBUG

    if (!data || !data.data) {
      return res.status(500).json({ error: "API falló" });
    }

    // 🎬 Video sin marca
    const video = data.data.play;

    // 🎵 Audio
    const mp3 = data.data.music;

    return res.json({
      video: video,
      mp3: mp3
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

// 🚀 Iniciar servidor
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});
