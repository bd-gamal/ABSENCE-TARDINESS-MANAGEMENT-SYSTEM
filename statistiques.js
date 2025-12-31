const apprenants = JSON.parse(localStorage.getItem("apprenantsData")) || [];
const attendanceHistory = JSON.parse(localStorage.getItem("attendanceHistory")) || {};

const tauxAbs = document.getElementById("tauxAbs");
const tauxRet = document.getElementById("tauxRet");
const avgTime = document.getElementById("avgTime");
const topAbsents = document.getElementById("topAbsents");
const topRetards = document.getElementById("topRetards");

let totalAbs = 0;
let totalRet = 0;
let totalTime = 0;
let timeCount = 0;
const absCount = {};
const retCount = {};


Object.keys(attendanceHistory).forEach(date => {
const records = attendanceHistory[date];
  
records.forEach(record => {
    const id = record.id;
    if (record.status === "absent") {
      totalAbs++;
      absCount[id] = (absCount[id] || 0) + 1;
    }

    if (record.status === "late") {
      totalRet++;
      retCount[id] = (retCount[id] || 0) + 1;
      if (record.time) {

        const [h, m] = record.time.split(":").map(Number);
        totalTime += h * 60 + m;
        timeCount++;
      }
    }
  });
});


const totalDays = Object.keys(attendanceHistory).length;
const totalApprenants = apprenants.length;
const totalPresences = totalDays * totalApprenants;

 
tauxAbs.textContent = `${((totalAbs / totalPresences) * 100).toFixed(2)} %`;
tauxRet.textContent = `${((totalRet / totalPresences) * 100).toFixed(2)} %`;


if (timeCount > 0) {
  const avgMinutes = Math.round(totalTime / timeCount);
  const h = Math.floor(avgMinutes / 60).toString().padStart(2, "0");
  const m = (avgMinutes % 60).toString().padStart(2, "0");
  avgTime.textContent = `${h}:${m}`;
} else {
  avgTime.textContent = "--:--";
}


function getTop(countObj, n) {
  return Object.entries(countObj)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([id, count]) => {
      const apprenant = apprenants.find(a => a.id == id);
      if (!apprenant) return null;
      return `${apprenant.nom} ${apprenant.prenom} (${count})`;
    })
    .filter(x => x);
}


topAbsents.innerHTML = getTop(absCount, 5).join("<br>");
topRetards.innerHTML = getTop(retCount, 5).join("<br>");
