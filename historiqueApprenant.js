
if (!localStorage.getItem("currentUser")) localStorage.setItem("currentUser", "1");
const currentUserId = localStorage.getItem("currentUser");


const apprenants = JSON.parse(localStorage.getItem("apprenantsData")) || [];
const userDetails = apprenants.find(a => String(a.id) === String(currentUserId));
if (userDetails) {
    document.getElementById("user-display-name").textContent = `${userDetails.nom || ''} ${userDetails.prenom || ''}`;
}


const rawAttendance = JSON.parse(localStorage.getItem("attendanceData")) || [];


function normalizeStatus(status) {
    if (!status) return "Présent";
    if (status.toLowerCase() === "absent") return "Absent";
    if (status.toLowerCase() === "late") return "En retard";
    return "Présent";
}


const userHistory = rawAttendance
    .filter(record => String(record.id) === String(currentUserId))
    .map(record => ({
        date: record.date || "-",
        statut: normalizeStatus(record.status),
        heure: record.time || "-",
        motif: record.motif || "-"
    }));


const tbody = document.getElementById("history-tbody");
const emptyMsg = document.getElementById("empty-msg");

if (userHistory.length === 0) {
    emptyMsg.classList.remove("hidden");
} else {
    userHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
    userHistory.forEach(item => {
        const row = `
        <tr class="hover:bg-gray-50 transition">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${item.date}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${item.statut}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${item.heure}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${item.motif}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}
