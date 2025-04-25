window.addEventListener( "DOMContentLoaded", () =>{
    fetch( "../Shared Page Layout/navbar.html" ).then( (res) => res.text()).then((data) =>{
        document.getElementById("navHolder").innerHTML = data;
        const searchbtn = document.getElementById("searchbtn");
        if (searchbtn){
            searchbtn.addEventListener( "click", function (event){
                event.preventDefault();
                window.location.href = "../NavBarComponent/search.html";
                console.log( "Search button clicked" );
            });
        } else {
            console.log( "searchbtn không tồn tại" );
        }
        });

    fetch( "../Shared Page Layout/footer.html" ).then((res) => res.text()).then((data) =>{
        document.getElementById("footHolder").innerHTML = data;
    });
});