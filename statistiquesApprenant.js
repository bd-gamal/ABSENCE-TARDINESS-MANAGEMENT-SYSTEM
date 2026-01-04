document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Jebna currentUser objet kaml (kif ma derna f dashboard)
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
        console.log("Aucun utilisateur connecté");
        return;
    }

    // 2. Afficher smiya (ila kan l'element kine f page)
    const nameElement = document.getElementById("user-display-name");
    if(nameElement) {
        nameElement.textContent = `${currentUser.nom || ''} ${currentUser.prenom || ''}`;
    }

    // 3. Jebna data dyal l7oudour kamla
    const rawAttendance = JSON.parse(localStorage.getItem("attendanceData")) || [];

    // 4. Filtrer ghir les records dyal had l'utilisateur connecte
    // Kan9arno l IDs b String bach netfadaw machakil dyal types (number vs string)
    const userRecords = rawAttendance.filter(r => String(r.id) === String(currentUser.id));

    // 5. N7esbo les statistiques
    let totalAbs = 0;
    let totalLate = 0;
    
    // Option A: 3adad l'enregistrement howa 3adad l'ayyam
    let totalDays = userRecords.length;

    // Option B: Ila bghiti t7seb les jours uniques (ila kan momkin ykoun kter mn record f nhar)
    // const uniqueDays = new Set(userRecords.map(r => r.date));
    // totalDays = uniqueDays.size;

    userRecords.forEach(r => {
        if(r.status === "absent") totalAbs++;
        if(r.status === "late") totalLate++;
    });

    // 6. Affichage f HTML elements
    // Hado homa IDs li kano f lcode l9dim dyalek
    const absEl = document.getElementById("totalAbsences");
    const retEl = document.getElementById("totalRetards");
    const daysEl = document.getElementById("totalDays");

    if(absEl) absEl.textContent = totalAbs;
    if(retEl) retEl.textContent = totalLate;
    if(daysEl) daysEl.textContent = totalDays;

    // --- (Bonus) Ila kenti baghi t7seb Taux (Pourcentage) b7al dashboard ---
    /*
    const tauxPresence = totalDays > 0 
        ? (((totalDays - totalAbs) / totalDays) * 100).toFixed(0) 
        : 0;
    
    const tauxEl = document.getElementById("tauxPresence"); // Khass ykoun had ID f HTML
    if(tauxEl) tauxEl.textContent = tauxPresence + "%";
    */
});