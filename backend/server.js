const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("🔥 Backend activo");
});

app.get("/download", async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: "URL faltante" });
  }

  try {
    const response = await fetch(`https://tikwm.com/api/?url=${url}`);
    const data = await response.json();

    if (!data.data) {
      return res.status(500).json({ error: "No se pudo obtener el video" });
    }

    res.json({
      video: data.data.play,
      mp3: data.data.music
    });

  } catch (err) {
    res.status(500).json({ error: "Error del servidor" });
  }
});

app.listen(PORT, () => {
  console.log("Servidor corriendo");
});
