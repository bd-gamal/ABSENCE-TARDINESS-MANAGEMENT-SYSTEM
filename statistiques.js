function readJSON(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw || raw === "undefined" || raw === "null") return fallback;
  try {
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const tauxAbsEl = document.getElementById("tauxAbs");
  const tauxRetEl = document.getElementById("tauxRet");
  const avgTimeEl = document.getElementById("avgTime");
  const topAbsEl = document.getElementById("topAbsents");
  const topRetEl = document.getElementById("topRetards");

  if (!tauxAbsEl || !tauxRetEl || !avgTimeEl || !topAbsEl || !topRetEl) return;

  const apprenants = readJSON("apprenantsData", []);
  const presence = readJSON("attendanceData", []);

  const totalStudents = Array.isArray(apprenants) ? apprenants.length : 0;
  const records = Array.isArray(presence) ? presence : [];

  const getName = (id) => {
    const a = apprenants.find((x) => String(x.id) === String(id));
    if (!a) return String(id);
    return `${a.nom || ""} ${a.prenom || ""}`.trim() || String(id);
  };

  const absents = records.filter((r) => r && r.status === "absent");
  const retards = records.filter((r) => r && r.status === "late");

  const denom = totalStudents > 0 ? totalStudents : 1;

  tauxAbsEl.textContent = ((absents.length / denom) * 100).toFixed(1) + "%";
  tauxRetEl.textContent = ((retards.length / denom) * 100).toFixed(1) + "%";

  const minutes = retards
    .map((r) => (typeof r.time === "string" ? r.time : ""))
    .filter((t) => t.includes(":"))
    .map((t) => {
      const [h, m] = t.split(":").map(Number);
      if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
      return h * 60 + m;
    })
    .filter((v) => v !== null);

  if (!minutes.length) {
    avgTimeEl.textContent = "--:--";
  } else {
    const avg = Math.round(minutes.reduce((a, b) => a + b, 0) / minutes.length);
    avgTimeEl.textContent =
      String(Math.floor(avg / 60)).padStart(2, "0") +
      ":" +
      String(avg % 60).padStart(2, "0");
  }

  const top3 = (names) => {
    const map = {};
    names.forEach((n) => (map[n] = (map[n] || 0) + 1));
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 3);
  };

  const absNames = absents.map((r) => getName(r.id));
  const retNames = retards.map((r) => getName(r.id));

  const absTop = top3(absNames);
  const retTop = top3(retNames);

  topAbsEl.innerHTML = absTop.length
    ? absTop.map(([n, c]) => `<div>${n} (${c})</div>`).join("")
    : `<div>Aucune donnée</div>`;

  topRetEl.innerHTML = retTop.length
    ? retTop.map(([n, c]) => `<div>${n} (${c})</div>`).join("")
    : `<div>Aucune donnée</div>`;
});
