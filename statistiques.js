function applyTheme() {
    const isDark = localStorage.getItem("theme") === "dark";
    document.documentElement.classList.toggle("dark", isDark);
    const icon = document.querySelector("#darkToggle i");
    if (icon) icon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
}

function darkmode() {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    applyTheme();
}

document.addEventListener("DOMContentLoaded", () => {
    applyTheme();

    const apprenants = JSON.parse(localStorage.getItem("apprenantsData")) || [];
    const attendanceData = JSON.parse(localStorage.getItem("attendanceData")) || [];

    const tauxAbs = document.getElementById("tauxAbs");
    const tauxRet = document.getElementById("tauxRet");
    const avgTime = document.getElementById("avgTime");
    const topAbsents = document.getElementById("topAbsents");
    const topRetards = document.getElementById("topRetards");

    if (!tauxAbs || !tauxRet || !avgTime || !topAbsents || !topRetards) return;

    if (attendanceData.length === 0 || apprenants.length === 0) {
        tauxAbs.textContent = "0%";
        tauxRet.textContent = "0%";
        avgTime.textContent = "--:--";
        topAbsents.textContent = "Aucune donnée";
        topRetards.textContent = "Aucune donnée";
        return;
    }

    let totalAbs = 0, totalRet = 0, totalTime = 0, timeCount = 0;
    const absCount = {}, retCount = {};

    attendanceData.forEach(record => {
        if (!record || !record.id) return;

        if (record.status === "absent") {
            totalAbs++;
            absCount[record.id] = (absCount[record.id] || 0) + 1;
        }
        if (record.status === "late") {
            totalRet++;
            retCount[record.id] = (retCount[record.id] || 0) + 1;
            if (record.time) {
                const [h, m] = record.time.split(":").map(Number);
                if (!isNaN(h) && !isNaN(m)) {
                    totalTime += h * 60 + m;
                    timeCount++;
                }
            }
        }
    });

    const totalDays = new Set(attendanceData.map(r => r.date)).size || 1;
    const totalApprenants = apprenants.length;
    const totalPresences = totalDays * totalApprenants;

    tauxAbs.textContent = `${((totalAbs / totalPresences) * 100).toFixed(2)} %`;
    tauxRet.textContent = `${((totalRet / totalPresences) * 100).toFixed(2)} %`;

    if (timeCount > 0) {
        const avgMin = Math.round(totalTime / timeCount);
        const h = String(Math.floor(avgMin / 60)).padStart(2, "0");
        const m = String(avgMin % 60).padStart(2, "0");
        avgTime.textContent = `${h}:${m}`;
    } else {
        avgTime.textContent = "--:--";
    }

    function getTop(obj, n) {
        return Object.entries(obj)
            .sort((a, b) => b[1] - a[1])
            .slice(0, n)
            .map(([id, count]) => {
                const a = apprenants.find(ap => ap.id == id);
                return a ? `${a.nom} ${a.prenom} (${count})` : id;
            })
            .filter(Boolean);
    }

    topAbsents.innerHTML = getTop(absCount, 5).join("<br>") || "Aucune donnée";
    topRetards.innerHTML = getTop(retCount, 5).join("<br>") || "Aucune donnée";
});
