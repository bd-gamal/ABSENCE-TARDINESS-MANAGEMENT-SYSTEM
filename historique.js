document.addEventListener("DOMContentLoaded", () => {
  const table = document.getElementById("historiqueData");
  if (!table) return;

  const history = readJSON("attendanceHistory", {});
  table.innerHTML = "";

  
  if (Object.keys(history).length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="4" class="text-center py-6 text-gray-500">
          Aucun historique disponible
        </td>
      </tr>
    `;
    return;
  }


  Object.keys(history)
    .sort((a, b) => new Date(b) - new Date(a))
    .forEach((date) => {
      const dayData = history[date] || [];

      let absents = 0;
      let retards = 0;

      dayData.forEach((p) => {
        if (p.status === "absent") absents++;
        if (p.status === "late") retards++;
      });

      const tr = document.createElement("tr");
      tr.className = "border-b dark:border-gray-700";

      tr.innerHTML = `
        <td class="px-6 py-4">${formatDate(date)}</td>
        <td class="px-6 py-4 text-center text-red-500 font-bold">${absents}</td>
        <td class="px-6 py-4 text-center text-orange-500 font-bold">${retards}</td>
        <td class="px-6 py-4">
          <button onclick="voirDetails('${date}')" class="bg-blue-600 text-white px-3 py-1 rounded">
            Détails
          </button>
        </td>
      `;

      table.appendChild(tr);
    });
});


function voirDetails(date) {
  const history = readJSON("attendanceHistory", {});
  const apprenants = readJSON("apprenantsData", []);
  const data = history[date] || [];

  const absList = document.getElementById("detailsabsences");
  const retList = document.getElementById("detailsretards");

  absList.innerHTML = "";
  retList.innerHTML = "";

  if (data.length === 0) {
    absList.innerHTML = "<li>Aucune donnée</li>";
    retList.innerHTML = "<li>Aucune donnée</li>";
    return;
  }

  data.forEach((p) => {
    const app = apprenants.find((a) => a.id == p.id);
    const name = app ? `${app.nom} ${app.prenom}` : "Inconnu";

    if (p.status === "absent") {
      absList.innerHTML += `<li>${name} — <i>${p.motif || "Sans motif"}</i></li>`;
    }

    if (p.status === "late") {
      retList.innerHTML += `<li>${name} — ${p.time || "-"} <i>(${p.motif || "—"})</i></li>`;
    }
  });
}


function formatDate(dateStr) {
  const d = new Date(dateStr);
  return isNaN(d)
    ? dateStr
    : d.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
}
