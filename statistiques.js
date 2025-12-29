document.addEventListener("DOMContentLoaded", () => {
  const history = readJSON("attendanceHistory", {});
  const apprenants = readJSON("apprenantsData", []);

  const days = Object.keys(history);
  if (days.length === 0 || apprenants.length === 0) return;

  let totalAbs = 0;
  let totalRet = 0;
  const statsByStudent = {};

  days.forEach((date) => {
    history[date].forEach((p) => {
      if (!statsByStudent[p.id]) {
        statsByStudent[p.id] = { abs: 0, ret: 0 };
      }
      if (p.status === "absent") {
        totalAbs++;
        statsByStudent[p.id].abs++;
      }
      if (p.status === "late") {
        totalRet++;
        statsByStudent[p.id].ret++;
      }
    });
  });

  const totalPossible = days.length * apprenants.length;

  document.getElementById("tauxAbs").textContent =
    ((totalAbs / totalPossible) * 100).toFixed(1) + "%";

  document.getElementById("tauxRet").textContent =
    ((totalRet / totalPossible) * 100).toFixed(1) + "%";

 
  const topAbs = Object.entries(statsByStudent)
    .sort((a, b) => b[1].abs - a[1].abs)
    .slice(0, 3);

  document.getElementById("topAbsents").innerHTML = topAbs
    .map(([id, s]) => {
      const a = apprenants.find((x) => x.id == id);
      return `<div>${a ? a.nom + " " + a.prenom : id} — ${s.abs} absences</div>`;
    })
    .join("");
});
