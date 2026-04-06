const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// 📁 Carpeta de descargas
const DOWNLOADS = path.join(__dirname, "downloads");

// Crear carpeta si no existe
if (!fs.existsSync(DOWNLOADS)) {
  fs.mkdirSync(DOWNLOADS);
}

// 🧹 Limpieza automática cada 10 minutos
setInterval(() => {
  fs.readdir(DOWNLOADS, (err, files) => {
    if (err) return;
    files.forEach(file => {
      fs.unlink(path.join(DOWNLOADS, file), () => {});
    });
  });
}, 10 * 60 * 1000);

// 🚀 Endpoint principal
app.post("/convert", (req, res) => {
  const { url, type } = req.body;

  // Validación básica
  if (!url || !url.includes("tiktok.com")) {
    return res.json({ error: "URL inválida" });
  }

  const id = Date.now();
  const output = path.join(DOWNLOADS, `${id}.%(ext)s`);

  let command = "";

  if (type === "mp3") {
    command = `yt-dlp -x --audio-format mp3 --no-playlist -o "${output}" "${url}"`;
  } else {
    command = `yt-dlp -f mp4 --no-playlist -o "${output}" "${url}"`;
  }

  console.log("Ejecutando:", command);

  exec(command, (err) => {
    if (err) {
      console.log("Error:", err);
      return res.json({ error: true });
    }

    // Buscar archivo generado
    const files = fs.readdirSync(DOWNLOADS);
    const found = files.find(f => f.startsWith(id));

    if (!found) {
      return res.json({ error: true });
    }

    res.json({
      download: `/downloads/${found}`
    });
  });
});

// 📥 Servir archivos descargados
app.use("/downloads", express.static(DOWNLOADS));

// 🟢 Iniciar servidor
app.listen(PORT, () => {
  console.log(`🔥 Server corriendo en puerto ${PORT}`);
});
