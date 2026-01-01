document.addEventListener("DOMContentLoaded", () => {
    const activeStudent = getActiveStudent(); 
    if (activeStudent) {
        updateDashboardUI(activeStudent);
    }
});

function getActiveStudent() {
    const allStudents = readJSON("apprenantsData", []);
    return allStudents[0] || null;
}

function updateDashboardUI(student) {
    const history = readJSON("attendanceHistory", {});
    const dates = Object.keys(history);

    let myAbsences = 0;
    let myLates = 0;

    dates.forEach(date => {
        const myRecord = history[date].find(r => r.id == student.id);
        if (myRecord) {
            if (myRecord.status === "absent") myAbsences++;
            if (myRecord.status === "late") myLates++;
        }
    });

    
    const nameDisplay = document.getElementById("header-user-name");
    if (nameDisplay) nameDisplay.textContent = `${student.nom} ${student.prenom}`;

    
    const profileName = document.querySelector("h2.text-2xl.font-bold");
    if (profileName) profileName.textContent = `${student.nom} ${student.prenom}`;

   
    const inputs = document.querySelectorAll("input[type='text'], input[type='email']");
    if (inputs.length > 0) {
        inputs[0].value = student.nom || "";
        inputs[1].value = student.prenom || "";
        inputs[2].value = student.email || "";
    }
}