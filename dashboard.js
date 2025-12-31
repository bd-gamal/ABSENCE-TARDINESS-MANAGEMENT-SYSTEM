const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) {
    
    window.location.href = "login.html";
} else {
document.querySelector('h1').innerText=`${currentUser.nom} ${currentUser.prenom}`;
}
const allPresences = JSON.parse(localStorage.getItem('attendanceDate')) || [];
let myRecords = [];
allPresences.forEach(day => {
    const record = day.records.find(r => r.apprenant.id == currentUser.id);
    if (record){
        myRecords.push(record);
    }
    
});
const Tjours = myRecords.length;
const nbrA = myRecords.filter(r=>r.status === 'absent').length;
const nbrR = myRecords.filter(r=>r.status === 'retard').length;
const tauxPresence = Tjours > 0 ? (((Tjours-nbrA)/Tjours)*100).toFixed(1):0;


document.getElementById('Tjours').innerText = Tjours;
document.getElementById('Nabsence').innerText = nbrA;
document.getElementById('Nretard').innerText = nbrR;
document.getElementById('Tpresence').innerText = tauxPresence + "%";