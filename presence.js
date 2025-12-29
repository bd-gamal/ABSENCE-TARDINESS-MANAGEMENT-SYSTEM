document.addEventListener("DOMContentLoaded", () => {
    const dateInput = document.getElementById("dateInput");
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;

    const render = () => {
        const apprenants = readJSON("apprenantsData", []);
        const history = readJSON("attendanceHistory", {});
        const currentPresence = history[dateInput.value] || [];
        const body = document.getElementById("presenceTableBody");
        body.innerHTML = "";

        apprenants.forEach(app => {
            const entry = currentPresence.find(p => p.id == app.id) || { status: 'present', time: '', motif: '' };
            const row = document.createElement("tr");
            row.className = "border-b dark:border-gray-700";
            row.innerHTML = `
                <td class="px-6 py-4">${app.id}</td>
                <td class="px-6 py-4 font-bold">${app.nom} ${app.prenom}</td>
                <td class="px-6 py-4 text-center">
                    <select class="status-select bg-transparent border rounded p-1 dark:text-white" data-id="${app.id}">
                        <option value="present" ${entry.status === 'present' ? 'selected' : ''}>Présent</option>
                        <option value="absent" ${entry.status === 'absent' ? 'selected' : ''}>Absent</option>
                        <option value="late" ${entry.status === 'late' ? 'selected' : ''}>Retard</option>
                    </select>
                </td>
                <td class="px-6 py-4">
                    <input type="time" class="time-input bg-transparent border rounded p-1 ${entry.status !== 'late' ? 'hidden' : ''}" value="${entry.time}">
                </td>
                <td class="px-6 py-4">
                    <input type="text" class="motif-input bg-transparent border rounded p-1 w-full ${entry.status === 'present' ? 'hidden' : ''}" placeholder="Motif..." value="${entry.motif}">
                </td>
            `;
            body.appendChild(row);
        });
    };

    document.getElementById("presenceTableBody").addEventListener("change", (e) => {
        const row = e.target.closest("tr");
        const status = row.querySelector(".status-select").value;
        row.querySelector(".time-input").classList.toggle("hidden", status !== "late");
        row.querySelector(".motif-input").classList.toggle("hidden", status === "present");
        save();
    });

    const save = () => {
        const history = readJSON("attendanceHistory", {});
        const rows = document.querySelectorAll("#presenceTableBody tr");
        const dailyData = Array.from(rows).map(row => ({
            id: row.querySelector(".status-select").dataset.id,
            status: row.querySelector(".status-select").value,
            time: row.querySelector(".time-input").value,
            motif: row.querySelector(".motif-input").value
        }));
        history[dateInput.value] = dailyData;
        writeJSON("attendanceHistory", history);
    };

    dateInput.addEventListener("change", render);
    render();
});