document.addEventListener("DOMContentLoaded", () => {
    initialiserTableauPresence();
});

function initialiserTableauPresence() {
    const tableBody = document.getElementById("presenceTableBody"); 
    const dateInput = document.getElementById("dateInput");

    if (!tableBody) return;

    if (dateInput) {
        const aujourdhui = new Date().toISOString().split('T')[0];
        dateInput.value = localStorage.getItem("attendanceDate") || aujourdhui;
        
        dateInput.addEventListener("change", (e) => {
            localStorage.setItem("attendanceDate", e.target.value);
        });
    }

    const apprenants = JSON.parse(localStorage.getItem("apprenantsData")) || [];
    const donneesPresence = JSON.parse(localStorage.getItem("attendanceData")) || [];

    tableBody.innerHTML = "";

    if (apprenants.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-gray-500">Aucun apprenant trouvé. Veuillez en ajouter dans la page "Apprenants".</td></tr>`;
        return;
    }

    apprenants.forEach((apprenant) => {
        const enregistrement = donneesPresence.find(d => d.id == apprenant.id);
        const statut = enregistrement ? enregistrement.status : null;
        const heure = enregistrement ? enregistrement.time : "";
        const motif = enregistrement ? enregistrement.motif : "";

        const row = document.createElement("tr");
        row.className = "border-b hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 transition";
        row.setAttribute("data-id", apprenant.id);

        row.innerHTML = `
            <td class="px-6 py-4 font-medium text-gray-400">${apprenant.id}</td>
            <td class="px-6 py-4 font-bold">${apprenant.nom} ${apprenant.prenom}</td>
            <td class="px-6 py-4 text-center">
                <span class="bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded text-xs">G${apprenant.groupe}</span>
            </td>
            <td class="px-6 py-4">
                <div class="flex gap-2 justify-center">
                   <label class="cursor-pointer" title="Présent">
                        <input type="radio" name="status-${apprenant.id}" value="present" ${statut === 'present' ? 'checked' : ''} class="hidden peer">
                        <div class="w-8 h-8 flex items-center justify-center rounded-full border border-green-500 text-green-500 peer-checked:bg-green-500 peer-checked:text-white font-bold transition">P</div>
                   </label>
                   <label class="cursor-pointer" title="Absent">
                        <input type="radio" name="status-${apprenant.id}" value="absent" ${statut === 'absent' ? 'checked' : ''} class="hidden peer">
                        <div class="w-8 h-8 flex items-center justify-center rounded-full border border-red-500 text-red-500 peer-checked:bg-red-500 peer-checked:text-white font-bold transition">A</div>
                   </label>
                   <label class="cursor-pointer" title="Retard">
                        <input type="radio" name="status-${apprenant.id}" value="late" ${statut === 'late' ? 'checked' : ''} class="hidden peer">
                        <div class="w-8 h-8 flex items-center justify-center rounded-full border border-orange-400 text-orange-400 peer-checked:bg-orange-400 peer-checked:text-white font-bold transition">R</div>
                   </label>
                </div>
            </td>
            <td class="px-6 py-4">
                <input type="time" class="time-input bg-transparent border rounded px-2 py-1 text-sm dark:border-gray-500" 
                value="${heure}" ${statut !== 'late' ? 'disabled' : ''}>
            </td>
            <td class="px-6 py-4">
                <input type="text" class="motif-input bg-transparent border rounded px-2 py-1 text-sm w-full dark:border-gray-500" 
                placeholder="Motif..." value="${motif}" ${statut !== 'late' ? 'disabled' : ''}>
            </td>
        `;

        tableBody.appendChild(row);
        attacherEvenementsLigne(row);
    });
}

function attacherEvenementsLigne(row) {
    const radios = row.querySelectorAll('input[type="radio"]');
    const inputs = row.querySelectorAll('.time-input, .motif-input');

    radios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const estEnRetard = e.target.value === 'late';
            
            row.querySelector('.time-input').disabled = !estEnRetard;
            row.querySelector('.motif-input').disabled = !estEnRetard;

            if (!estEnRetard) {
                row.querySelector('.time-input').value = '';
                row.querySelector('.motif-input').value = '';
            }

            sauvegarderPresence();
        });
    });

    inputs.forEach(input => {
        input.addEventListener('input', sauvegarderPresence);
    });
}

function sauvegarderPresence() {
    const rows = document.querySelectorAll('#presenceTableBody tr');
    const data = [];

    rows.forEach(row => {
        const id = row.getAttribute('data-id');
        const radioCoche = row.querySelector('input[type="radio"]:checked');
        
        if (radioCoche) {
            data.push({
                id: id,
                status: radioCoche.value,
                time: row.querySelector('.time-input').value,
                motif: row.querySelector('.motif-input').value
            });
        }
    });

    localStorage.setItem("attendanceData", JSON.stringify(data));
}

function resetAttendance() {
    if(confirm("Voulez-vous vraiment réinitialiser la présence pour aujourd'hui ?")) {
        localStorage.removeItem("attendanceData");
        location.reload();
    }
}