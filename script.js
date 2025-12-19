let apprenants = JSON.parse(localStorage.getItem('apprenantsData')) || [];
let idModif = null; 

document.addEventListener('DOMContentLoaded', () => {
    afficherTableau();
});


function afficherTableau() {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    apprenants.forEach((apprenant, index) => {
        let row = `
            <tr class="border-b hover:bg-gray-50 transition">
                <td class="px-6 py-4">${index + 1}</td>
                <td class="px-6 py-4">${apprenant.nom}</td>
                <td class="px-6 py-4">${apprenant.prenom}</td>
                <td class="px-6 py-4 text-center">${apprenant.groupe}</td>
                <td class="px-6 py-4">
                    <button onclick="preparerModification(${apprenant.id})" class="text-blue-500 hover:text-blue-700 mx-2">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button onclick="supprimerApprenant(${apprenant.id})" class="text-red-500 hover:text-red-700 mx-2">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;         
    });
}

const form = document.getElementById('studentForm');

form.addEventListener('submit', function(e) {
    e.preventDefault(); 

    const nom = document.getElementById('nom').value;
    const prenom = document.getElementById('prenom').value;
    const groupe = document.getElementById('groupe').value;

    if (idModif === null) {
        const nouveau = {
            id: Date.now(),    
            nom: nom,
            prenom: prenom,
            groupe: groupe
        };
        apprenants.push(nouveau);     
    } else {
        const index = apprenants.findIndex(a => a.id === idModif);
        apprenants[index].nom = nom;
        apprenants[index].prenom = prenom;
        apprenants[index].groupe = groupe;
        idModif = null;   
    }

    localStorage.setItem('apprenantsData', JSON.stringify(apprenants));
    afficherTableau();
    
    form.reset();
    document.getElementById('modal').classList.add('hidden');
});

function supprimerApprenant(id) {
    if(confirm("واش متأكد بغيتي تمسح هاد التلميذ؟")) {
        apprenants = apprenants.filter(a => a.id !== id);
        
        localStorage.setItem('apprenantsData', JSON.stringify(apprenants));
        afficherTableau();
    }
}

function preparerModification(id) {
    const el = apprenants.find(a => a.id === id);
    
    document.getElementById('nom').value = el.nom;
    document.getElementById('prenom').value = el.prenom;
    document.getElementById('groupe').value = el.groupe;

    idModif = id;

    document.getElementById('modal').classList.remove('hidden');
}