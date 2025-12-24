document.addEventListener("DOMContentLoaded", () => {
    initPresenceTable();
});

function initPresenceTable() {
    // Kanjibo ID li f presence.html
    const tableBody = document.getElementById("presenceTableBody");
    const dateInput = document.getElementById("dateInput");

    if (!tableBody) return;

    // Gestion Date
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = localStorage.getItem("attendanceDate") || today;
        dateInput.addEventListener("change", (e) => localStorage.setItem("attendanceDate", e.target.value));
    }

    // 1. Jib Data mn LocalStorage (Nfs Key li f script.js)
    const apprenants = JSON.parse(localStorage.getItem("apprenantsData")) || [];
    const attendanceData = JSON.parse(localStorage.getItem("attendanceData")) || [];

    tableBody.innerHTML = "";

    // Ila kan khawi
    if (apprenants.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4">0 Apprenants. Sir l page Apprenants w zidhom b3da.</td></tr>`;
        return;
    }

    // Boucle
    apprenants.forEach((apprenant) => {
        // Nchoufo wach deja 3ndna statut msjl 3lih
        const record = attendanceData.find(d => d.id == apprenant.id);
        const status = record ? record.status : null;
        const time = record ? record.time : "";
        const motif = record ? record.motif : "";

        const row = document.createElement("tr");
        row.className = "hover:bg-gray-50 dark:hover:bg-gray-600 transition";
        row.setAttribute("data-id", apprenant.id);

        row.innerHTML = `
            <td class="px-6 py-4">${apprenant.id}</td>
            <td class="px-6 py-4 font-bold">${apprenant.nom} ${apprenant.prenom}</td>
            <td class="px-6 py-4">
                <div class="flex gap-2 justify-center">
                   <label class="cursor-pointer">
                        <input type="radio" name="status-${apprenant.id}" value="present" ${status === 'present' ? 'checked' : ''} class="hidden peer">
                        <div class="px-3 py-1 rounded-full border border-green-500 text-green-500 peer-checked:bg-green-500 peer-checked:text-white text-xs font-bold">P</div>
                   </label>
                   <label class="cursor-pointer">
                        <input type="radio" name="status-${apprenant.id}" value="absent" ${status === 'absent' ? 'checked' : ''} class="hidden peer">
                        <div class="px-3 py-1 rounded-full border border-red-500 text-red-500 peer-checked:bg-red-500 peer-checked:text-white text-xs font-bold">A</div>
                   </label>
                   <label class="cursor-pointer">
                        <input type="radio" name="status-${apprenant.id}" value="late" ${status === 'late' ? 'checked' : ''} class="hidden peer">
                        <div class="px-3 py-1 rounded-full border border-orange-400 text-orange-400 peer-checked:bg-orange-400 peer-checked:text-white text-xs font-bold">R</div>
                   </label>
                </div>
            </td>
            <td class="px-6 py-4">
                <input type="time" class="time-input bg-transparent border rounded px-2 py-1 text-xs dark:border-gray-500" value="${time}" ${status !== 'late' ? 'disabled' : ''}>
            </td>
            <td class="px-6 py-4">
                <input type="text" class="motif-input bg-transparent border rounded px-2 py-1 text-xs w-full dark:border-gray-500" placeholder="..." value="${motif}" ${status !== 'late' ? 'disabled' : ''}>
            </td>
        `;

        tableBody.appendChild(row);
        attachRowEvents(row);
    });
}

function attachRowEvents(row) {
    const radios = row.querySelectorAll('input[type="radio"]');
    const timeIn = row.querySelector('.time-input');
    const motifIn = row.querySelector('.motif-input');

    radios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'late') {
                timeIn.disabled = false;
                motifIn.disabled = false;
            } else {
                timeIn.disabled = true;
                motifIn.disabled = true;
                timeIn.value = '';
                motifIn.value = '';
            }
            saveData();
        });
    });

    timeIn.addEventListener('input', saveData);
    motifIn.addEventListener('input', saveData);
}

function saveData() {
    const rows = document.querySelectorAll('#presenceTableBody tr');
    const data = [];

    rows.forEach(row => {
        const id = row.getAttribute('data-id');
        const checked = row.querySelector('input[type="radio"]:checked');
        if (checked) {
            data.push({
                id: id,
                status: checked.value,
                time: row.querySelector('.time-input').value,
                motif: row.querySelector('.motif-input').value
            });
        }
    });
    localStorage.setItem("attendanceData", JSON.stringify(data));
}