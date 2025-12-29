function readJSON(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw || raw === "undefined" || raw === "null") return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const table = document.getElementById("historiqueData");
  const absList = document.getElementById("detailsabsences");
  const retList = document.getElementById("detailsretards");
  if (!table || !absList || !retList) return;

  const apprenants = readJSON("apprenantsData", []);
  const presence = readJSON("attendanceData", []);

  const date =
    localStorage.getItem("attendanceDate") ||
    new Date().toISOString().split("T")[0];

  const getName = (id) => {
    const a = apprenants.find((x) => String(x.id) === String(id));
    if (!a) return String(id);
    return `${a.nom || ""} ${a.prenom || ""}`.trim() || String(id);
  };

  const absents = presence.filter((r) => r && r.status === "absent");
  const retards = presence.filter((r) => r && r.status === "late");

  table.innerHTML = "";
  absList.innerHTML = "";
  retList.innerHTML = "";

  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${date}</td>
    <td class="text-center text-red-500">${absents.length}</td>
    <td class="text-center text-orange-500">${retards.length}</td>
    <td><button class="view bg-blue-600 text-white px-3 py-1 rounded">Voir</button></td>
  `;
  table.appendChild(tr);

  tr.querySelector(".view").onclick = () => {
    absList.innerHTML = absents.length ? "" : "<li>Aucune absence</li>";
    retList.innerHTML = retards.length ? "" : "<li>Aucun retard</li>";

    absents.forEach((r) => {
      const li = document.createElement("li");
      li.textContent = `${getName(r.id)} - ${r.motif || "Non justifié"}`;
      absList.appendChild(li);
    });

    retards.forEach((r) => {
      const li = document.createElement("li");
      li.textContent = `${getName(r.id)} - ${r.time || "--:--"} - ${r.motif || ""}`;
      retList.appendChild(li);
    });
  };
});
