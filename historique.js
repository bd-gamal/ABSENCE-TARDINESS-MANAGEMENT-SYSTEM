const apprenants = JSON.parse(localStorage.getItem("apprenantsData")) || [];
const historiquesObj = JSON.parse(localStorage.getItem("attendanceHistory")) || {};

const historiqueData = document.getElementById("historiqueData");
const listDetails = document.getElementById("detailsabsences");
const absentes = document.getElementById("detailsretards");

Object.keys(historiquesObj).forEach(date => {
  const records = historiquesObj[date];

  const tr = document.createElement("tr");
  const dateTd = document.createElement("td");
  const absenteTd = document.createElement("td");
  const retardTd = document.createElement("td");
  const button = document.createElement("button");

  
  let absenteNum = 0;
  let retardNum = 0;

  records.forEach(r => {
    if (r.status === "absent"){
       absenteNum++;
    } 
    if (r.status === "late"){
        retardNum++;
    } 
  });

  dateTd.textContent = date;
  absenteTd.textContent = absenteNum;
  retardTd.textContent = retardNum;
  button.textContent = "details";

  button.className = "bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600";

  tr.appendChild(dateTd);
  tr.appendChild(absenteTd);
  tr.appendChild(retardTd);
  tr.appendChild(button);

  historiqueData.appendChild(tr);

 
  button.addEventListener("click", () => {
    listDetails.innerHTML = "";
    absentes.innerHTML = "";

    records.forEach(r => {
      const apprenant = apprenants.find(a => a.id == r.id);
      if (!apprenant){
          return;
      } 

      if (r.status === "absent") {
        const li = document.createElement("li");
        li.textContent = `ID: ${r.id} - ${apprenant.nom} ${apprenant.prenom} - ${apprenant.groupe} - Absent - Motif: ${r.motif}`;
        listDetails.appendChild(li);
      }

      if (r.status === "late") {
        const li = document.createElement("li");
        li.textContent = `ID: ${r.id} - ${apprenant.nom} ${apprenant.prenom} - ${apprenant.groupe} - Retard - Heure: ${r.time} - Motif: ${r.motif}`;
        absentes.appendChild(li);
      }
    });
  });
});
