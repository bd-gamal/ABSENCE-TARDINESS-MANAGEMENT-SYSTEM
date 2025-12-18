

document.addEventListener("DOMContentLoaded", () =>{
    const form = document.getElementById("studentform");

    form.addEventListener("submit", (e)=>{
        e.preventDefault();
    const nom = document.getElementById("nom").value.trim();
    const prenom = document.getElementById("prenom").value.trim();
    const email = document.getElementById("email").value.trim();
    const groupe = document.getElementById("groupe").value.trim();  


    if(!nom || !prenom){
        alert("make sure to fill all fields");
        return;
    }

    const apprenants ={
        nom,
        prenom,
        email,
        groupe,
        createdAt: new Date().toISOString()
    };
    const storedData = JSON.parse(localStorage.getItem("apprenants")) || []
    storedData.push(apprenants);
    localStorage.setItem("apprenants", JSON.stringify(storedData));

    alert("saved to localStorage")
    form.reset();



    })
    



})