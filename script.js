
["apprenantsData", "attendanceData"].forEach((k) => {
  const v = localStorage.getItem(k);
  if (!v || v === "undefined" || v === "null") {
    localStorage.removeItem(k);
  }
});


function readJSON(key, fallback = []) {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
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


function gérerNavigationActive() {
  const path = window.location.pathname.split("/").pop().toLowerCase();
  document.querySelectorAll("aside nav a").forEach((link) => {
    const href = (link.getAttribute("href") || "").toLowerCase();
    link.classList.remove("bg-blue-900", "dark:bg-gray-700");
    if (href === path) {
      link.classList.add("bg-blue-900", "dark:bg-gray-700");
    }
  });
}


function applyTheme() {
  const isDark = localStorage.getItem("theme") === "dark";
  document.documentElement.classList.toggle("dark", isDark);

  const icon = document.querySelector("#darkToggle i");
  if (icon) {
    icon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }
}

function darkmode() {
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  applyTheme();
}


function afficherTableauApprenants() {
  const body = document.getElementById("tableBody");
  if (!body) return;

  const apprenants = readJSON("apprenantsData", []);

  body.innerHTML = "";

  if (apprenants.length === 0) {
    body.innerHTML = `
      <tr>
        <td colspan="5" class="text-center py-6 text-gray-500 dark:text-gray-400">
          Aucun apprenant trouvé.
        </td>
      </tr>
    `;
    return;
  }

  apprenants.forEach((a) => {
    body.innerHTML += `
      <tr class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition">
        <td class="px-6 py-4">${a.id}</td>
        <td class="px-6 py-4">${a.nom}</td>
        <td class="px-6 py-4">${a.prenom}</td>
        <td class="px-6 py-4 text-center">${a.groupe}</td>
        <td class="px-6 py-4">
          <button onclick="preparerModification(${a.id})" class="text-blue-500 mr-2">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button onclick="supprimerApprenant(${a.id})" class="text-red-500">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  });
}


function gererAjoutOuModification(e) {
  e.preventDefault();

  const nom = document.getElementById("nom").value.trim();
  const prenom = document.getElementById("prenom").value.trim();
  const email = document.getElementById("email").value.trim();
  const groupe = document.getElementById("groupe").value.trim();

  if (!nom || !prenom || !email || !groupe) {
    alert("Veuillez remplir tous les champs !");
    return;
  }

  let list = readJSON("apprenantsData", []);

  if (idModification) {
    const idx = list.findIndex((a) => a.id === idModification);
    if (idx !== -1) {
      list[idx] = { ...list[idx], nom, prenom, email, groupe };
    }
    idModification = null;
  } else {
    const newId = list.length ? Math.max(...list.map((a) => a.id)) + 1 : 1;
    list.push({ id: newId, nom, prenom, email, groupe });
  }

  writeJSON("apprenantsData", list);

  document.getElementById("modal").classList.add("hidden");
  document.getElementById("studentForm").reset();

  afficherTableauApprenants();
}


function supprimerApprenant(id) {
  if (!confirm("Supprimer cet apprenant ?")) return;

  let list = readJSON("apprenantsData", []);
  list = list.filter((a) => a.id !== id);
  writeJSON("apprenantsData", list);

  let attendance = readJSON("attendanceData", []);
  attendance = attendance.filter((d) => d.id != id);
  writeJSON("attendanceData", attendance);

  afficherTableauApprenants();
}


function preparerModification(id) {
  const a = readJSON("apprenantsData", []).find((x) => x.id === id);
  if (!a) return;

  idModification = id;
  document.getElementById("nom").value = a.nom;
  document.getElementById("prenom").value = a.prenom;
  document.getElementById("email").value = a.email;
  document.getElementById("groupe").value = a.groupe;
  document.getElementById("modal").classList.remove("hidden");
}
