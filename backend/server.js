const express = require("express");

const app = express();
const PORT = process.env.PORT || 10000;

// 🌐 Ruta principal
app.get("/", (req, res) => {
  res.send("🔥 Backend activo");
});

// 🎬 Ruta de descarga
app.get("/download", async (req, res) => {
  let url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: "URL faltante" });
  }

  try {
    // 🔥 Resolver links cortos (vt.tiktok)
    if (url.includes("vt.tiktok.com")) {
      const redirect = await fetch(url, { redirect: "follow" });
      url = redirect.url;
    }

    // 🔥 API externa
    const response = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);
    const data = await response.json();

    console.log("DATA:", data);

    if (!data || !data.data || !data.data.play) {
      return res.status(500).json({ error: "API falló" });
    }

    return res.json({
      video: data.data.play,
      mp3: data.data.music
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error del servidor" });
  }
});

// 🚀 Iniciar servidor
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});
