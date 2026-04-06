const res = await fetch(`${API}/download?url=${url}`);
const data = await res.json();

if (type === "mp3") {
  window.open(data.mp3);
} else {
  window.open(data.video);
}
