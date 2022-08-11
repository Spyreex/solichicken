document.querySelector("input#dark-toggle").addEventListener("click", (event) => {
    document.querySelector("html").classList.toggle("dark");
    
    let dark = localStorage.getItem("dark-mode");
    if (dark)
        dark = dark === "true" ? "false" : "true";
    else
        dark = "true";
    localStorage.setItem("dark-mode", dark);
});

window.onload = function() {
    if (localStorage.getItem("dark-mode") === "true")
    {
        document.querySelector("html").classList.toggle("dark", true);
        document.querySelector("input#dark-toggle").setAttribute("checked", true);
    }
}