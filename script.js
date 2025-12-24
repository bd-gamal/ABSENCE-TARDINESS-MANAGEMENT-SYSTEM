let idModification = null;

document.addEventListener("DOMContentLoaded", () => {
    applyTheme();
    gérerNavigationActive();

    if (document.getElementById("tableBody")) {
        afficherTableauApprenants();
    }

    const form = document.getElementById("studentForm");
    if (form) {
        form.addEventListener("submit", gererAjoutOuModification);
    }
});

function gererAjoutOuModification(e) {
    e.preventDefault();

    const nom = document.getElementById("nom").value.trim();
    const prenom = document.getElementById("prenom").value.trim();
    const email = document.getElementById("email").value.trim();
    const groupe = document.getElementById("groupe").value.trim();

    if (!nom || !prenom || !groupe) {
        alert("Veuillez remplir tous les champs obligatoires (Nom, Prénom, Groupe).");
        return;
    }

    let apprenants = JSON.parse(localStorage.getItem("apprenantsData")) || [];

    if (idModification !== null) {
        const index = apprenants.findIndex((a) => a.id == idModification);
        if (index !== -1) {
            apprenants[index] = { id: idModification, nom, prenom, email, groupe };
        }
        idModification = null;
    } else {
        let nouvelId = 1;
        if (apprenants.length > 0) {
            const ids = apprenants.map(a => Number(a.id));
            nouvelId = Math.max(...ids) + 1;
        }

        const nouvelApprenant = {
            id: nouvelId,
            nom,
            prenom,
            email,
            groupe
        };
        apprenants.push(nouvelApprenant);
    }

    localStorage.setItem("apprenantsData", JSON.stringify(apprenants));
    afficherTableauApprenants();
    
    document.getElementById("studentForm").reset();
    document.getElementById("modal").classList.add("hidden");
}

function afficherTableauApprenants() {
    const tableBody = document.getElementById("tableBody");
    if (!tableBody) return;

    const apprenants = JSON.parse(localStorage.getItem("apprenantsData")) || [];
    tableBody.innerHTML = "";

    if (apprenants.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center py-6 text-gray-500">Aucun apprenant enregistré.</td></tr>`;
        return;
    }

    apprenants.forEach((apprenant) => {
        tableBody.innerHTML += `
        <tr class="border-b hover:bg-gray-50 transition dark:border-gray-700 dark:hover:bg-gray-600 dark:text-gray-300">
            <td class="px-6 py-4 font-medium">${apprenant.id}</td>
            <td class="px-6 py-4">${apprenant.nom}</td>
            <td class="px-6 py-4">${apprenant.prenom}</td>
            <td class="px-6 py-4 text-center">${apprenant.groupe}</td>
            <td class="px-6 py-4 flex items-center">
                <button onclick="preparerModification(${apprenant.id})" class="text-blue-500 hover:text-blue-700 mx-2 p-2 hover:bg-blue-100 rounded-full transition" title="Modifier">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button onclick="supprimerApprenant(${apprenant.id})" class="text-red-500 hover:text-red-700 mx-2 p-2 hover:bg-red-100 rounded-full transition" title="Supprimer">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
        `;
    });
}

function preparerModification(id) {
    const apprenants = JSON.parse(localStorage.getItem("apprenantsData")) || [];
    const apprenant = apprenants.find((a) => a.id == id);

    if (apprenant) {
        document.getElementById("nom").value = apprenant.nom;
        document.getElementById("prenom").value = apprenant.prenom;
        document.getElementById("email").value = apprenant.email || "";
        document.getElementById("groupe").value = apprenant.groupe;

        idModification = id;
        document.getElementById("modal").classList.remove("hidden");
    }
}

function supprimerApprenant(id) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet apprenant ?")) {
        let apprenants = JSON.parse(localStorage.getItem("apprenantsData")) || [];
        apprenants = apprenants.filter((a) => a.id != id);
        
        localStorage.setItem("apprenantsData", JSON.stringify(apprenants));
        afficherTableauApprenants();
    }
}

function gérerNavigationActive() {
    const currentPage = window.location.pathname.split("/").pop().toLowerCase() || "home.html";
    document.querySelectorAll("aside nav a").forEach((link) => {
        const linkPage = link.getAttribute("href")?.toLowerCase();
        link.classList.remove("bg-blue-900", "dark:bg-gray-700");
        if (linkPage === currentPage) {
            link.classList.add("bg-blue-900", "dark:bg-gray-700");
        }
    });
}

function applyTheme() {
    const html = document.documentElement;
    const isDark = localStorage.getItem("theme") === "dark";
    
    html.classList.toggle("dark", isDark);

    const icon = document.querySelector("#darkToggle i");
    const label = document.querySelector("#darkToggle span");
    if (icon) icon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
    if (label) label.textContent = isDark ? "Light Mode" : "Dark Mode";
}

function darkmode() {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    applyTheme();
}