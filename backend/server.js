const express = require("express");
const ytdlp = require("yt-dlp-exec");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// carpeta downloads
const DOWNLOADS = path.join(__dirname, "downloads");

if (!fs.existsSync(DOWNLOADS)) {
  fs.mkdirSync(DOWNLOADS);
}

// ruta test
app.get("/", (req, res) => {
  res.send("🔥 Backend activo");
});

// convertir TikTok → MP4
app.post("/convert", async (req, res) => {
  const { url } = req.body;

  if (!url || !url.includes("tiktok.com")) {
    return res.json({ error: "URL inválida" });
  }

  const id = Date.now();
  const output = path.join(DOWNLOADS, `${id}.mp4`);

  try {
    await ytdlp(url, {
      output: output,
      format: "mp4"
    });

    res.json({
      download: `/downloads/${id}.mp4`
    });

  } catch (e) {
    console.log("Error:", e);
    res.json({ error: true });
  }
});

// servir archivos
app.use("/downloads", express.static(DOWNLOADS));

// limpiar archivos cada 10 min
setInterval(() => {
  fs.readdir(DOWNLOADS, (err, files) => {
    if (err) return;
    files.forEach(file => {
      fs.unlink(path.join(DOWNLOADS, file), () => {});
    });
  });
}, 10 * 60 * 1000);

// iniciar servidor
app.listen(PORT, () => {
  console.log("🔥 Server corriendo en puerto " + PORT);
});
