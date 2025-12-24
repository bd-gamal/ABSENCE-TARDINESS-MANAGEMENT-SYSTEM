// script.js (CORRECTED)
document.addEventListener("DOMContentLoaded", () => {
  applyTheme();
  
  // Correction: Gher ila l9ina tableBody 3ad n-affichiw
  if (document.getElementById("tableBody")) {
    afficherTableau();
  }

  // Navigation Active State
  const currentPage = window.location.pathname.split("/").pop().toLowerCase() || "home.html";
  document.querySelectorAll("aside nav a").forEach((link) => {
    const linkPage = link.getAttribute("href")?.toLowerCase();
    link.classList.remove("bg-blue-900", "dark:bg-gray-700");
    if (linkPage === currentPage) {
      link.classList.add("bg-blue-900", "dark:bg-gray-700");
    }
  });

  // Form Handling
  const form = document.getElementById("studentForm");
  if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        let apprenants = JSON.parse(localStorage.getItem("apprenantsData")) || [];
        
        const nom = document.getElementById("nom").value.trim();
        const prenom = document.getElementById("prenom").value.trim();
        const email = document.getElementById("email").value.trim();
        const groupe = document.getElementById("groupe").value.trim();

        if (!nom || !prenom) {
          alert("Please fill all fields");
          return;
        }

        // Logic d'ajout (simplifié pour l'exemple)
        // ... (Rjje3 logic li kan 3ndk dyal getNextId w idModif) ...
        // Hna ghan3tik l-mohim:
        
        const newItem = {
            id: Date.now(), // ola getNextId() dyalk
            nom, prenom, email, groupe
        };
        
        apprenants.push(newItem);
        localStorage.setItem("apprenantsData", JSON.stringify(apprenants));
        
        afficherTableau();
        form.reset();
        document.getElementById("modal").classList.add("hidden");
      });
  }
});

// Fonction d'affichage pour page Apprenants seulement
function afficherTableau() {
  const tableBody = document.getElementById("tableBody");
  if (!tableBody) return; // Sécurité

  let apprenants = JSON.parse(localStorage.getItem("apprenantsData")) || [];
  tableBody.innerHTML = "";

  apprenants.forEach((apprenant) => {
    tableBody.innerHTML += `
      <tr class="border-b hover:bg-gray-50 transition dark:border-gray-700 dark:hover:bg-gray-600 dark:text-gray-300">
        <td class="px-6 py-4">${apprenant.id}</td>
        <td class="px-6 py-4">${apprenant.nom}</td>
        <td class="px-6 py-4">${apprenant.prenom}</td>
        <td class="px-6 py-4 text-center">${apprenant.groupe}</td>
        <td class="px-6 py-4">
           <button class="text-red-500"><i class="fa-solid fa-trash"></i></button>
        </td>
      </tr>
    `;
  });
}

function applyTheme() {
  const html = document.documentElement;
  const isDark = localStorage.getItem("theme") === "dark";
  html.classList.toggle("dark", isDark);
  
  // Icon update
  const icon = document.querySelector("#darkToggle i");
  const label = document.querySelector("#darkToggle span");
  if(icon) icon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
  if(label) label.textContent = isDark ? "Light Mode" : "Dark Mode";
}

function darkmode() {
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  applyTheme();
}