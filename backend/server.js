const express = require("express");
const ytdlp = require("yt-dlp-exec");

const app = express();
const PORT = process.env.PORT || 3000;

// 🔥 fetch para Node
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// 🟢 Ruta base
app.get("/", (req, res) => {
  res.send("🔥 Backend activo");
});

// 🚀 Ruta download
app.get("/download", async (req, res) => {
  const url = req.query.url;
  const type = req.query.type || "video";

  if (!url) {
    return res.status(400).send("URL faltante");
  }

  try {
    const info = await ytdlp(url, {
      dumpSingleJson: true,
      noWarnings: true
    });

    if (!info || !info.formats) {
      return res.status(500).send("No se pudo obtener info");
    }

    let file;

    // 🎬 VIDEO
    if (type === "video") {
      file = info.formats
        .filter(f => f.ext === "mp4" && f.url)
        .sort((a, b) => b.height - a.height)[0];
    }

    // 🎵 AUDIO
    if (type === "mp3") {
      file = info.formats
        .filter(f => (f.ext === "m4a" || f.ext === "mp3") && f.url)
        .sort((a, b) => (b.abr || 0) - (a.abr || 0))[0];
    }

    if (!file) {
      return res.status(500).send("No se encontró archivo");
    }

    // 🔥 Forzar descarga
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="tiktok.${type === "video" ? "mp4" : "mp3"}"`
    );

    // 🔥 Descargar y enviar
    const response = await fetch(file.url);
    response.body.pipe(res);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error del servidor");
  }
});

// 🚀 Iniciar servidor
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});
