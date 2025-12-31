document.addEventListener("DOMContentLoaded", () => {

  const apprenants = JSON.parse(localStorage.getItem("apprenantsData")) || [];
  const attendanceData = JSON.parse(localStorage.getItem("attendanceData")) || [];

  const historiqueData = document.getElementById("historiqueData");
  const listDetails = document.getElementById("detailsabsences");
  const absentes = document.getElementById("detailsretards");

  if (attendanceData.length === 0) {
    historiqueData.innerHTML = `
      <tr><td colspan="4" class="text-center text-gray-500 py-4">Aucune donnée disponible</td></tr>
    `;
    return;
  }

  
  const groupedByDate = {};
  attendanceData.forEach(r => {
    if (!groupedByDate[r.date]) groupedByDate[r.date] = [];
    groupedByDate[r.date].push(r);
  });

  Object.keys(groupedByDate).forEach(date => {
    const records = groupedByDate[date];
    let absenteNum = 0, retardNum = 0;

    records.forEach(r => {
      if (r.status === "absent") absenteNum++;
      if (r.status === "late") retardNum++;
    });

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${date}</td>
      <td class="text-center">${absenteNum}</td>
      <td class="text-center">${retardNum}</td>
      <td><button class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">Détails</button></td>
    `;

    const button = tr.querySelector("button");
    historiqueData.appendChild(tr);

    button.addEventListener("click", () => {
      listDetails.innerHTML = "";
      absentes.innerHTML = "";

      records.forEach(r => {
        const apprenant = apprenants.find(a => a.id == r.id);
        const name = apprenant ? `${apprenant.nom} ${apprenant.prenom} (${apprenant.groupe})` : `ID: ${r.id}`;
        
        if (r.status === "absent") {
          const li = document.createElement("li");
          li.textContent = `${name} - Absent - Motif: ${r.motif || "-"}`;
          listDetails.appendChild(li);
        }

        if (r.status === "late") {
          const li = document.createElement("li");
          li.textContent = `${name} - Retard - Heure: ${r.time || "--"} - Motif: ${r.motif || "-"}`;
          absentes.appendChild(li);
        }
      });
    });
  });

});
