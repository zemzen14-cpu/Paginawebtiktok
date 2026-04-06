const API = "https://paginawebtiktok.onrender.com";

async function convert(type) {
  const url = document.getElementById("url").value;
  const status = document.getElementById("status");
  const loader = document.getElementById("loader");

  if (!url.includes("tiktok.com")) {
    status.innerText = "⚠️ Link inválido";
    return;
  }

  loader.classList.remove("hidden");
  status.innerText = "";

  try {
    const res = await fetch(`${API}/convert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url, type })
    });

    const data = await res.json();

    loader.classList.add("hidden");

    if (data.download) {
      status.innerText = "✅ Descargando...";
      window.open(`${API}${data.download}`, "_blank");
    } else {
      status.innerText = "❌ Error al convertir";
    }

  } catch {
    loader.classList.add("hidden");
    status.innerText = "🔥 Error del servidor";
  }
}
