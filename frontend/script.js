const API = "https://paginawebtiktok.onrender.com/"; // 👈 CAMBIA si tu backend es otro

async function convert(type) {
  const url = document.getElementById("url").value;
  const status = document.getElementById("status");
  const loader = document.getElementById("loader");

  // Validación básica
  if (!url || !url.includes("tiktok.com")) {
    status.innerText = "⚠️ Link inválido";
    return;
  }

  // Mostrar loader
  loader.classList.remove("hidden");
  status.innerText = "";

  try {
    const res = await fetch(`${API}/download?url=${encodeURIComponent(url)}`);
    const data = await res.json();

    loader.classList.add("hidden");

    // Validar respuesta
    if (!data || (!data.video && !data.mp3)) {
      status.innerText = "❌ No se pudo procesar el video";
      return;
    }

    // Abrir según tipo
    if (type === "mp3") {
      window.open(data.mp3, "_blank");
    } else {
      window.open(data.video, "_blank");
    }

  } catch (error) {
    console.error(error);
    loader.classList.add("hidden");
    status.innerText = "🔥 Error del servidor";
  }
}
