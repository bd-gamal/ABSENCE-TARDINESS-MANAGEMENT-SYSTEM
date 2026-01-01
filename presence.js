document.addEventListener("DOMContentLoaded", () => {
  initialiserTableauPresence();
});

function initialiserTableauPresence() {
  const tableBody = document.getElementById("presenceTableBody");
  const dateInput = document.getElementById("dateInput");

  if (!tableBody || !dateInput) return;

  const today = new Date().toISOString().split("T")[0];
  dateInput.value = localStorage.getItem("attendanceDate") || today;

  dateInput.addEventListener("change", () => {
    localStorage.setItem("attendanceDate", dateInput.value);
    initialiserTableauPresence();
  });

  const apprenants = JSON.parse(localStorage.getItem("apprenantsData")) || [];
  const attendanceData = JSON.parse(localStorage.getItem("attendanceData")) || [];

  tableBody.innerHTML = "";

  if (apprenants.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-gray-500 dark:text-gray-400">Aucun apprenant trouvé.</td></tr>`;
    return;
  }

  apprenants.forEach((apprenant) => {
    const record = attendanceData.find(
      (d) => d.id == apprenant.id && d.date === dateInput.value
    );

    const statut = record ? record.status : "";
    const time = record ? record.time : "";
    const motif = record ? record.motif : "";

    const row = document.createElement("tr");
    row.className =
      "border-b hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-600 dark:text-gray-300";
    row.setAttribute("data-id", apprenant.id);

    row.innerHTML = `
      <td class="px-6 py-4 font-medium text-gray-400">${apprenant.id}</td>
      <td class="px-6 py-4 font-bold">${apprenant.nom} ${apprenant.prenom}</td>
      <td class="px-6 py-4 text-center"><span class="bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded text-xs">G${apprenant.groupe}</span></td>
      <td class="px-6 py-4">
        <div class="flex gap-2 justify-center">
          <label class="cursor-pointer">
            <input type="radio" name="status-${apprenant.id}" value="present" ${statut === "present" ? "checked" : ""} class="hidden peer">
            <div class="w-8 h-8 rounded-full border border-green-500 text-green-500 peer-checked:bg-green-500 peer-checked:text-white flex items-center justify-center font-bold">P</div>
          </label>
          <label class="cursor-pointer">
            <input type="radio" name="status-${apprenant.id}" value="absent" ${statut === "absent" ? "checked" : ""} class="hidden peer">
            <div class="w-8 h-8 rounded-full border border-red-500 text-red-500 peer-checked:bg-red-500 peer-checked:text-white flex items-center justify-center font-bold">A</div>
          </label>
          <label class="cursor-pointer">
            <input type="radio" name="status-${apprenant.id}" value="late" ${statut === "late" ? "checked" : ""} class="hidden peer">
            <div class="w-8 h-8 rounded-full border border-orange-400 text-orange-400 peer-checked:bg-orange-400 peer-checked:text-white flex items-center justify-center font-bold">R</div>
          </label>
        </div>
      </td>
      <td class="px-6 py-4"><input type="time" class="time-input bg-transparent border rounded px-2 py-1 text-sm dark:border-gray-500" value="${time}" ${statut === "late" ? "" : "disabled"}></td>
      <td class="px-6 py-4"><input type="text" class="motif-input bg-transparent border rounded px-2 py-1 text-sm w-full dark:border-gray-500" placeholder="Motif..." value="${motif}" ${statut === "late" ? "" : "disabled"}></td>
    `;

    tableBody.appendChild(row);
    attacherEvenementsLigne(row);
  });
}

function attacherEvenementsLigne(row) {
  const radios = row.querySelectorAll('input[type="radio"]');
  const timeInput = row.querySelector('.time-input');
  const motifInput = row.querySelector('.motif-input');

  radios.forEach(radio => {
    radio.addEventListener("change", () => {
      const isLate = radio.value === "late";
      timeInput.disabled = !isLate;
      motifInput.disabled = !isLate;
      if (!isLate) {
        timeInput.value = "";
        motifInput.value = "";
      }
      sauvegarderPresence();
    });
  });

  timeInput.addEventListener("input", sauvegarderPresence);
  motifInput.addEventListener("input", sauvegarderPresence);
}

function sauvegarderPresence() {
  const rows = document.querySelectorAll("#presenceTableBody tr");
  const date = document.getElementById("dateInput").value;
  let attendanceData = JSON.parse(localStorage.getItem("attendanceData")) || [];

  rows.forEach(row => {
    const id = parseInt(row.getAttribute("data-id"));
    const radioChecked = row.querySelector('input[type="radio"]:checked');

    if (radioChecked) {
      const record = { id, date, status: radioChecked.value, time: row.querySelector(".time-input").value, motif: row.querySelector(".motif-input").value };
      const index = attendanceData.findIndex(r => r.id === id && r.date === date);

      if (index > -1) attendanceData[index] = record;
      else attendanceData.push(record);
    }
  });

  localStorage.setItem("attendanceData", JSON.stringify(attendanceData));
}
