function verifyLogin() {
  const inputNom = document.getElementById("nom").value.trim();
  const inputPrenom = document.getElementById("prenom").value.trim();
  const StoredApprenants = localStorage.getItem("apprenantsData");
  if (!StoredApprenants) {
    alert("Ereur");
    return;
  }
  const apprenants = JSON.parse(StoredApprenants);

  const foundUser = apprenants.find((user) => {
    return (
      user.nom.toLowerCase() === inputNom.toLowerCase() &&
      user.prenom.toLowerCase() === inputPrenom.toLowerCase()
    );
  });
  if (foundUser) {
    localStorage.setItem("currentUser", JSON.stringify(foundUser));

    alert("WELCOME");
    window.location.href = "dashboard.html";
  } else {
    alert("NOT FOUND");
  }
}
function verifyLoginF() {
   const inputNom = document.getElementById("nomF").value.trim();
  const inputPrenom = document.getElementById("prenomF").value.trim();
  if('admin' === inputNom.toLowerCase() && 'admin'=== inputPrenom.toLowerCase()){
     alert("WELCOME");
    window.location.href = "home.html";
  } else {
    alert("NOT FOUND");
  }
  }
