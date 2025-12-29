["apprenantsData", "attendanceData"].forEach((k) => {
  const v = localStorage.getItem(k);
  if (v === "undefined" || v === "null" || v === "") localStorage.removeItem(k);
});

function readJSON(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw || raw === "undefined" || raw === "null") return fallback;
  try {
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

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

  const nomEl = document.getElementById("nom");
  const prenomEl = document.getElementById("prenom");
  const emailEl = document.getElementById("email");
  const groupeEl = document.getElementById("groupe");

  const nom = (nomEl?.value || "").trim();
  const prenom = (prenomEl?.value || "").trim();
  const email = (emailEl?.value || "").trim();
  const groupe = (groupeEl?.value || "").trim();

  if (!nom || !prenom || !groupe) {
    alert("Veuillez remplir tous les champs obligatoires (Nom, Prénom, Groupe).");
    return;
  }

  let apprenants = readJSON("apprenantsData", []);
  if (!Array.isArray(apprenants)) apprenants = [];

  if (idModification !== null) {
    const index = apprenants.findIndex((a) => String(a.id) === String(idModification));
    if (index !== -1) {
      apprenants[index] = { id: apprenants[index].id, nom, prenom, email, groupe };
    }
    idModification = null;
  } else {
    let nouvelId = 1;
    if (apprenants.length > 0) {
      const ids = apprenants.map((a) => Number(a.id)).filter((n) => Number.isFinite(n));
      nouvelId = ids.length ? Math.max(...ids) + 1 : 1;
    }

    apprenants.push({ id: nouvelId, nom, prenom, email, groupe });
  }

  writeJSON("apprenantsData", apprenants);
  afficherTableauApprenants();

  const form = document.getElementById("studentForm");
  if (form) form.reset();

  const modal = document.getElementById("modal");
  if (modal) modal.classList.add("hidden");
}

function afficherTableauApprenants() {
  const tableBody = document.getElementById("tableBody");
  if (!tableBody) return;

  let apprenants = readJSON("apprenantsData", []);
  if (!Array.isArray(apprenants)) apprenants = [];

  tableBody.innerHTML = "";

  if (apprenants.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5" class="text-center py-6 text-gray-500">Aucun apprenant enregistré.</td></tr>`;
    return;
  }

  apprenants.forEach((apprenant) => {
    const id = apprenant?.id ?? "";
    const nom = apprenant?.nom ?? "";
    const prenom = apprenant?.prenom ?? "";
    const groupe = apprenant?.groupe ?? "";

    tableBody.innerHTML += `
      <tr class="border-b hover:bg-gray-50 transition dark:border-gray-700 dark:hover:bg-gray-600 dark:text-gray-300">
        <td class="px-6 py-4 font-medium">${id}</td>
        <td class="px-6 py-4">${nom}</td>
        <td class="px-6 py-4">${prenom}</td>
        <td class="px-6 py-4 text-center">${groupe}</td>
        <td class="px-6 py-4 flex items-center">
          <button onclick="preparerModification('${String(id).replace(/'/g, "\\'")}')" class="text-blue-500 hover:text-blue-700 mx-2 p-2 hover:bg-blue-100 rounded-full transition" title="Modifier">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button onclick="supprimerApprenant('${String(id).replace(/'/g, "\\'")}')" class="text-red-500 hover:text-red-700 mx-2 p-2 hover:bg-red-100 rounded-full transition" title="Supprimer">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  });
}

function preparerModification(id) {
  let apprenants = readJSON("apprenantsData", []);
  if (!Array.isArray(apprenants)) apprenants = [];

  const apprenant = apprenants.find((a) => String(a.id) === String(id));
  if (!apprenant) return;

  const nomEl = document.getElementById("nom");
  const prenomEl = document.getElementById("prenom");
  const emailEl = document.getElementById("email");
  const groupeEl = document.getElementById("groupe");

  if (nomEl) nomEl.value = apprenant.nom || "";
  if (prenomEl) prenomEl.value = apprenant.prenom || "";
  if (emailEl) emailEl.value = apprenant.email || "";
  if (groupeEl) groupeEl.value = apprenant.groupe || "";

  idModification = apprenant.id;

  const modal = document.getElementById("modal");
  if (modal) modal.classList.remove("hidden");
}

function supprimerApprenant(id) {
  if (!confirm("Êtes-vous sûr de vouloir supprimer cet apprenant ?")) return;

  let apprenants = readJSON("apprenantsData", []);
  if (!Array.isArray(apprenants)) apprenants = [];

  apprenants = apprenants.filter((a) => String(a.id) !== String(id));
  writeJSON("apprenantsData", apprenants);
  afficherTableauApprenants();
}

function gérerNavigationActive() {
  const currentPage =
    window.location.pathname.split("/").pop().toLowerCase() || "home.html";

  document.querySelectorAll("aside nav a").forEach((link) => {
    const linkPage = (link.getAttribute("href") || "").toLowerCase();
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


