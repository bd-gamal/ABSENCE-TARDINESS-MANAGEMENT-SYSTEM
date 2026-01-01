
if(!localStorage.getItem("currentUser")) localStorage.setItem("currentUser", "1");
const currentUserId = localStorage.getItem("currentUser");


const apprenants = JSON.parse(localStorage.getItem("apprenantsData")) || [];
const userDetails = apprenants.find(a => String(a.id) === String(currentUserId));
if(userDetails) {
    document.getElementById("user-display-name").textContent = `${userDetails.nom || ''} ${userDetails.prenom || ''}`;
}


const rawAttendance = JSON.parse(localStorage.getItem("attendanceData")) || [];

const userRecords = rawAttendance.filter(r => String(r.id) === String(currentUserId));

let totalAbs = 0, totalLate = 0;
const daysSet = new Set();

userRecords.forEach(r => {
    daysSet.add(r.date);
    if(r.status === "absent") totalAbs++;
    if(r.status === "late") totalLate++;
});

document.getElementById("totalAbsences").textContent = totalAbs;
document.getElementById("totalRetards").textContent = totalLate;
document.getElementById("totalDays").textContent = daysSet.size;
