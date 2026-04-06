const express = require("express");
const app = express();

const PORT = process.env.PORT || 10000;

// Permitir frontend
app.use(express.static("public"));

// Ruta básica
app.get("/", (req, res) => {
  res.send("🔥 Backend activo");
});

// 🔥 DOWNLOAD (AQUÍ VA)
app.get("/download", async (req, res) => {
  const url = req.query.url;
  const type = req.query.type || "video";

  if (!url) {
    return res.status(400).json({ error: "URL faltante" });
  }

  try {
    const response = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);
    const data = await response.json();

    if (!data || !data.data) {
      return res.status(500).json({ error: "API falló" });
    }

    if (type === "mp3") {
      return res.json({ url: data.data.music });
    }

    return res.json({ url: data.data.play });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

// 🚀 iniciar servidor
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});
