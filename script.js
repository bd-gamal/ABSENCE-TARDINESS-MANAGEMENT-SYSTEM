document.addEventListener("DOMContentLoaded", () => {

    const html = document.documentElement;
    const themeBtn = document.getElementById("darkModeBtn");

    const historiqueSection = document.getElementById("historiqueSection");
    const statistiquesSection = document.getElementById("statistiquesSection");
    const btnHistorique = document.getElementById("btnHistorique");
    const btnStatistiques = document.getElementById("btnStatistiques");

    btnHistorique.addEventListener("click", e => {
        e.preventDefault();
        historiqueSection.classList.remove("hidden");
        statistiquesSection.classList.add("hidden");
    });

    btnStatistiques.addEventListener("click", e => {
        e.preventDefault();
        historiqueSection.classList.add("hidden");
        statistiquesSection.classList.remove("hidden");
    });

    if (localStorage.getItem("theme") === "dark") html.classList.add("dark");
    themeBtn.addEventListener("click", () => {
        html.classList.toggle("dark");
        localStorage.setItem("theme", html.classList.contains("dark") ? "dark" : "light");
    });

    const storedApprenants = [
        { id: "student_1", nom: "YOUSSEF" },
        { id: "student_2", nom: "AHMED" },
        { id: "student_3", nom: "NAJIB" },
        { id: "student_4", nom: "SARA" },
        { id: "student_5", nom: "KHALID" },
        { id: "student_6", nom: "YASSIN" }
    ];

    const storedHistorique = [
        {
            date: "2024-12-15",
            records: [
                { id: "student_1", status: "absent", motif: "Maladie" },
                { id: "student_2", status: "late", time: "08:45", motif: "Transport" },
                { id: "student_3", status: "late", time: "08:45", motif: "Transport" },
                { id: "student_4", status: "absent", motif: "Maladie" },
                { id: "student_5", status: "late", time: "08:50", motif: "Traffic" },
                { id: "student_6", status: "absent", motif: "Autorisation" }
            ]
        },
        {
            date: "2024-12-16",
            records: [
                { id: "student_1", status: "late", time: "09:10", motif: "Réveil tard" },
                { id: "student_2", status: "absent", motif: "Autorisation" },
                { id: "student_3", status: "absent", motif: "Autorisation" },
                { id: "student_4", status: "late", time: "09:05", motif: "Réveil tard" },
                { id: "student_5", status: "late", time: "09:15", motif: "Transport" },
                { id: "student_6", status: "absent", motif: "Maladie" }
            ]
        }
    ];

    const historiqueData = document.getElementById("historiqueData");
    const listAbsences = document.getElementById("detailsabsences");
    const listRetards = document.getElementById("detailsretards");

    storedHistorique.forEach(histo => {
        const tr = document.createElement("tr");
        tr.className = "hover:bg-gray-50 dark:hover:bg-gray-700/50 transition";

        const absCount = histo.records.filter(r => r.status === "absent").length;

        const retCount = histo.records.filter(r => r.status === "late").length;

        tr.innerHTML = `
            <td class="p-3 border-b dark:border-gray-700 font-medium dark:text-white">${histo.date}</td>
            <td class="p-3 border-b dark:border-gray-700 text-center text-red-500 font-bold">${absCount}</td>
            <td class="p-3 border-b dark:border-gray-700 text-center text-orange-500 font-bold">${retCount}</td>
            <td class="p-3 border-b dark:border-gray-700">
                <button class="view-btn bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">Détails</button>
            </td>
        `;
        historiqueData.appendChild(tr);

        tr.querySelector(".view-btn").addEventListener("click", () => {
            listAbsences.innerHTML = "";
            listRetards.innerHTML = "";

            histo.records.forEach(rec => {
              const app = storedApprenants.find(a => a.id === rec.id);
             const nom = app ? app.nom : rec.id;

                if (rec.status === "absent") {
                 const li = document.createElement("li");
                    li.className = "p-2 rounded text-sm bg-red-50 text-red-700 dark:bg-red-900/20";
                    li.textContent = `${nom} - Motif: ${rec.motif || "Non justifié"}`;
                    listAbsences.appendChild(li);
                } else if (rec.status === "late") {
                    const li = document.createElement("li");
                    li.className = "p-2 rounded text-sm bg-orange-50 text-orange-700 dark:bg-orange-900/20";
                    li.textContent = `${nom} - Arrivé à: ${rec.time || "--:--"} - Motif: ${rec.motif || "Aucun"}`;
                    listRetards.appendChild(li);
               }
         });
        });
    });

    function calculerStats() {
         let totalAbs = 0;
        let totalRet = 0;
        let absentsList = [];
        let retardsList = [];

        storedHistorique.forEach(day => {
            day.records.forEach(r => {
            const student = storedApprenants.find(s => s.id === r.id);
            const name = student ? student.nom : r.id;

                if (r.status === "absent") {
                    totalAbs++;
                    absentsList.push(name);
                }
                if (r.status === "late") {
                    totalRet++;
                    retardsList.push(name);
                }
            });
        });

        const totalCases = storedApprenants.length * storedHistorique.length;

        document.getElementById("tauxAbs").textContent = ((totalAbs / totalCases) * 100).toFixed(1) + "%";
        document.getElementById("tauxRet").textContent = ((totalRet / totalCases) * 100).toFixed(1) + "%";

        function getTop3(list) {
         let counted = [];
             list.forEach(name => {
                const existing = counted.find(c => c.name === name);
                if (existing) existing.count++;
                else counted.push({ name: name, count: 1 });
            });
            counted.sort((a, b) => b.count - a.count);
            return counted.slice(0, 3);
        }

        const topAbs = getTop3(absentsList);
        const topRet = getTop3(retardsList);

        const topAbsentsEl = document.getElementById("topAbsents");
        topAbsentsEl.innerHTML = "";
        topAbs.forEach(s => {
            const div = document.createElement("div");
            div.className = "text-sm dark:text-gray-400";
            div.textContent = `${s.name} (${s.count} fois)`;
            topAbsentsEl.appendChild(div);
        });

        const topRetardsEl = document.getElementById("topRetards");
        topRetardsEl.innerHTML = "";
        topRet.forEach(s => {
            const div = document.createElement("div");
            div.className = "text-sm dark:text-gray-400";
            div.textContent = `${s.name} (${s.count} fois)`;
            topRetardsEl.appendChild(div);
        });
    }

    calculerStats();
});
