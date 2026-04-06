const API = "https://ebtiktok.onrender.com"; // 👈 TU BACKEND REAL

async function convert(type) {
  const url = document.getElementById("url").value;
  const status = document.getElementById("status");
  const loader = document.getElementById("loader");

  if (!url) {
    status.innerText = "⚠️ Pega un link primero";
    return;
  }

  loader.classList.remove("hidden");
  status.innerText = "⏳ Procesando...";

  try {
    const res = await fetch(`${API}/download?url=${encodeURIComponent(url)}`);
    const data = await res.json();

    if (!data.url) {
      throw new Error("No se encontró video");
    }

    // 🔥 REDIRECCIÓN DIRECTA (DESCARGA)
    window.location.href = data.url;

    status.innerText = "✅ Descargando...";

  } catch (err) {
    console.error(err);
    status.innerText = "🔥 Error del servidor";
  }

  loader.classList.add("hidden");
}
