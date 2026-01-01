document.addEventListener("DOMContentLoaded", () => {

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));



    document.querySelector('h1').innerText = `${currentUser.nom} ${currentUser.prenom}`;


    const allPresences = JSON.parse(localStorage.getItem('attendanceData')) || [];


    const myRecords = allPresences.filter(record => record.id == currentUser.id);



    const Tjours = myRecords.length;
    const nbrA = myRecords.filter(r => r.status === 'absent').length;
    const nbrR = myRecords.filter(r => r.status === 'late').length;


    const tauxPresence = Tjours > 0
        ? (((Tjours - nbrA) / Tjours) * 100).toFixed(0)
        : 0;


    const tjoursElement = document.getElementById('Tjours');
    if (tjoursElement) tjoursElement.innerText = Tjours;


    const nbrAElement = document.getElementById('Nabsence');
    if (nbrAElement) nbrAElement.innerText = nbrA;


    const nbrRElement = document.getElementById('Nretard');
    if (nbrRElement) nbrRElement.innerText = nbrR;

});