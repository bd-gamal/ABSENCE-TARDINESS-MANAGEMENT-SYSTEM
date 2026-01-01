function applyTheme() {
    const isDark = localStorage.getItem("theme") === "dark";
    document.documentElement.classList.toggle("dark", isDark);
    const icon = document.querySelector("#darkToggle i");
    if (icon) icon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
}

function toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    applyTheme();
}

document.addEventListener("DOMContentLoaded", () => {
    
    applyTheme();

    
    const darkBtn = document.getElementById("darkToggle");
    if (darkBtn) darkBtn.addEventListener("click", toggleDarkMode);

    const table = document.getElementById("historiqueData");
    const absList = document.getElementById("detailsabsences");
    const retList = document.getElementById("detailsretards");

    const attendanceData = JSON.parse(localStorage.getItem("attendanceData")) || [];
    const apprenants = JSON.parse(localStorage.getItem("apprenantsData")) || [];

  
    const byDate = {};
    attendanceData.forEach(r => {
        if (!r.date) return;
        if (!byDate[r.date]) byDate[r.date] = { absents: [], retards: [] };
        const student = apprenants.find(a => a.id == r.id);
        const name = student ? `${student.nom} ${student.prenom}` : "Inconnu";

        if (r.status === "absent") byDate[r.date].absents.push(name);
        if (r.status === "late") byDate[r.date].retards.push(name);
    });

    
    table.innerHTML = "";
    if (!Object.keys(byDate).length) {
        table.innerHTML = `<tr><td colspan="4" class="text-center py-4">Aucune donnée</td></tr>`;
    } else {
        Object.keys(byDate).forEach(date => {
            const tr = document.createElement("tr");
            tr.className = "hover:bg-gray-50 dark:hover:bg-gray-600 transition";

            tr.innerHTML = `
                <td class="px-6 py-3">${date}</td>
                <td class="px-6 py-3 text-center">${byDate[date].absents.length}</td>
                <td class="px-6 py-3 text-center">${byDate[date].retards.length}</td>
                <td class="px-6 py-3">
                  <button class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                          onclick="showDetails('${date}')">
                    Détails
                  </button>
                </td>
            `;
            table.appendChild(tr);
        });
    }

    
    window.showDetails = function(date) {
        if (!byDate[date]) return;
        absList.innerHTML = byDate[date].absents.length
            ? byDate[date].absents.map(n => `<li>${n}</li>`).join("")
            : "<li>Aucune absence</li>";

        retList.innerHTML = byDate[date].retards.length
            ? byDate[date].retards.map(n => `<li>${n}</li>`).join("")
            : "<li>Aucun retard</li>";
    };
});
