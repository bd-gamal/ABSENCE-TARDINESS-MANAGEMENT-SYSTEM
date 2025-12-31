document.addEventListener("DOMContentLoaded", () => {

  const apprenants = JSON.parse(localStorage.getItem("apprenantsData")) || [];
  const attendanceData = JSON.parse(localStorage.getItem("attendanceData")) || [];

  const tauxAbs = document.getElementById("tauxAbs");
  const tauxRet = document.getElementById("tauxRet");
  const avgTime = document.getElementById("avgTime");
  const topAbsents = document.getElementById("topAbsents");
  const topRetards = document.getElementById("topRetards");

  if (attendanceData.length === 0) {
    tauxAbs.textContent = "0%";
    tauxRet.textContent = "0%";
    avgTime.textContent = "--:--";
    topAbsents.textContent = "Aucune donnée";
    topRetards.textContent = "Aucune donnée";
    return;
  }

  let totalAbs = 0, totalRet = 0, totalTime = 0, timeCount = 0;
  const absCount = {}, retCount = {};

  attendanceData.forEach(r => {
    const id = r.id;
    if (r.status === "absent") {
      totalAbs++;
      absCount[id] = (absCount[id] || 0) + 1;
    }
    if (r.status === "late") {
      totalRet++;
      retCount[id] = (retCount[id] || 0) + 1;
      if (r.time) {
        const [h, m] = r.time.split(":").map(Number);
        totalTime += h * 60 + m;
        timeCount++;
      }
    }
  });

  const totalDays = new Set(attendanceData.map(r => r.date)).size;
  const totalApprenants = apprenants.length;
  const totalPresences = totalDays * totalApprenants;

  tauxAbs.textContent = `${((totalAbs / totalPresences) * 100).toFixed(2)} %`;
  tauxRet.textContent = `${((totalRet / totalPresences) * 100).toFixed(2)} %`;

  if (timeCount > 0) {
    const avgMinutes = Math.round(totalTime / timeCount);
    const h = Math.floor(avgMinutes / 60).toString().padStart(2, "0");
    const m = (avgMinutes % 60).toString().padStart(2, "0");
    avgTime.textContent = `${h}:${m}`;
  } else avgTime.textContent = "--:--";

  function getTop(countObj, n) {
    return Object.entries(countObj)
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([id, count]) => {
        const a = apprenants.find(ap => ap.id == id);
        if (!a) return null;
        return `${a.nom} ${a.prenom} (${count})`;
      })
      .filter(x => x);
  }

  topAbsents.innerHTML = getTop(absCount, 5).join("<br>") || "Aucune donnée";
  topRetards.innerHTML = getTop(retCount, 5).join("<br>") || "Aucune donnée";

});
