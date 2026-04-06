const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

// 🔥 Puerto dinámico para Render
const PORT = process.env.PORT || 3000;

// 📁 Carpeta de descargas
const DOWNLOADS = path.join(__dirname, "downloads");

// Crear carpeta si no existe
if (!fs.existsSync(DOWNLOADS)) {
  fs.mkdirSync(DOWNLOADS);
}

// 🟢 Ruta base (para probar si funciona)
app.get("/", (req, res) => {
  res.send("🔥 Backend activo");
});

// 🚀 Convertidor (SOLO MP4)
app.post("/convert", (req, res) => {
  const { url } = req.body;

  if (!url || !url.includes("tiktok.com")) {
    return res.json({ error: "URL inválida" });
  }

  const id = Date.now();
  const output = path.join(DOWNLOADS, `${id}.mp4`);

  const command = `yt-dlp -f mp4 --no-playlist -o "${output}" "${url}"`;

  console.log("Ejecutando:", command);

  exec(command, (err) => {
    if (err) {
      console.log("Error:", err);
      return res.json({ error: true });
    }

    res.json({
      download: `/downloads/${id}.mp4`
    });
  });
});

// 📥 Servir archivos
app.use("/downloads", express.static(DOWNLOADS));

// 🧹 Limpieza cada 10 min
setInterval(() => {
  fs.readdir(DOWNLOADS, (err, files) => {
    if (err) return;
    files.forEach(file => {
      fs.unlink(path.join(DOWNLOADS, file), () => {});
    });
  });
}, 10 * 60 * 1000);

// 🚀 Iniciar servidor
app.listen(PORT, () => {
  console.log("🔥 Server corriendo en puerto " + PORT);
});
