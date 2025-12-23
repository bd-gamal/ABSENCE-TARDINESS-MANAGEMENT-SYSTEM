let apprenants = JSON.parse(localStorage.getItem("apprenantsData")) || [];
let idModif = null;

document.addEventListener("DOMContentLoaded", () => {
  afficherTableau();

  const form = document.getElementById("studentform");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nom = document.getElementById("nom").value.trim();
    const prenom = document.getElementById("prenom").value.trim();
    const email = document.getElementById("email").value.trim();
    const groupe = document.getElementById("groupe").value.trim();

    if (!nom || !prenom) {
      alert("make sure to fill all fields");
      return;
    }

    function getNextId() {
      const key = "apprenantsNextId";
      const current = Number(localStorage.getItem(key) || "1");
      localStorage.setItem(key, String(current + 1));
      return current;
    }

    if (idModif !== null) {
      const idx = apprenants.findIndex((a) => a.id === idModif);
      if (idx !== -1) {
        apprenants[idx] = {
          ...apprenants[idx],
          nom,
          prenom,
          email,
          groupe,
        };
      }
      idModif = null;
    } else {
      const apprenant = {
        id: getNextId(),
        nom,
        prenom,
        email,
        groupe,
        createdAt: new Date().toISOString(),
      };
      apprenants.push(apprenant);
    }

    localStorage.setItem("apprenantsData", JSON.stringify(apprenants));
    afficherTableau();

    form.reset();
    document.getElementById("modal").classList.add("hidden");
  });
});

function afficherTableau() {
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";

  apprenants.forEach((apprenant) => {
    tableBody.innerHTML += `
      <tr class="border-b hover:bg-gray-50 transition">
        <td class="px-6 py-4">${apprenant.id}</td>
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
  });
}

function supprimerApprenant(id) {
  if (confirm("واش متأكد بغيتي تمسح هاد التلميذ؟")) {
    apprenants = apprenants.filter((a) => a.id !== id);
    localStorage.setItem("apprenantsData", JSON.stringify(apprenants));
    afficherTableau();
  }
}

function preparerModification(id) {
  const el = apprenants.find((a) => a.id === id);
  if (!el) return;

  document.getElementById("nom").value = el.nom;
  document.getElementById("prenom").value = el.prenom;
  document.getElementById("email").value = el.email || "";
  document.getElementById("groupe").value = el.groupe;

  idModif = id;
  document.getElementById("modal").classList.remove("hidden");
}



document.addEventListener("DOMContentLoaded", () => {
  const currentPage =
    window.location.pathname.split("/").pop().toLowerCase() || "home.html";
  
  
  
  document.querySelectorAll("aside nav a").forEach((link) => {
    const linkPage = link.getAttribute("href")?.toLowerCase();

    
    link.classList.remove(
      "bg-blue-900",
      "dark:bg-gray-700"
    );

    
    if (linkPage === currentPage) {
      link.classList.add(
        "bg-blue-900",
        "dark:bg-gray-700"
      );
    }
  });
});



