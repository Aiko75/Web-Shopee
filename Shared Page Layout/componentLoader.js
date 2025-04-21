window.addEventListener( "DOMContentLoaded", () =>{
    fetch( "../Shared Page Layout/navbar.html" )
        .then((res) => res.text())
        .then((data) => {
            document.getElementById("navHolder").innerHTML = data;
    });
  
    fetch( "../Shared Page Layout/footer.html" )
        .then((res) => res.text())
        .then((data) =>{
            document.getElementById("footHolder").innerHTML = data;
    });
});