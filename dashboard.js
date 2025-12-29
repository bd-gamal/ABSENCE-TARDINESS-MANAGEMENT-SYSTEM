function activepage(){
    const currentpage = window.location.pathname.split("/").pop() || "dashboard.html";
    document.querySelectorAll("aside nav a").forEach((link) => {
        const linkpage = (link.getAttribute("href")|| "");
        link.classList.remove("bg-blue-50", "text-blue-600","border-r-4", "border-blue-600")
        if (linkpage === currentpage){
            link.classList.add("bg-blue-50", "text-blue-600","border-r-4", "border-blue-600")
            
        }
    });
}
activepage()