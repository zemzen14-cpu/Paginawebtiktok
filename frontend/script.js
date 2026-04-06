const API = "https://paginawebtiktok-1.onrender.com";

window.location.href = `${API}/download?url=${encodeURIComponent(url)}&type=${type}`;

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
    const res = await fetch(`${API}/download?url=${encodeURIComponent(url)}&type=${type}`);
    const data = await res.json();

    if (!data.url) {
      status.innerText = "🔥 Error del servidor";
      return;
    }

    // 🔥 descarga directa
    window.open(data.url, "_blank");

    status.innerText = "✅ Descarga lista";
  } catch (err) {
    status.innerText = "🔥 Error del servidor";
  }

  loader.classList.add("hidden");
}
