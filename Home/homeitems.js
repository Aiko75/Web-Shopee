document.addEventListener( "DOMContentLoaded", () =>{
    const apiUrl = "https://fakestoreapi.com/products";
    const container = document.querySelector("#bodyMain");

    fetch(apiUrl).then( response => response.json() ).then( products =>{
            container.innerHTML = "";

            products.forEach( product =>{
                const pCard = document.createElement("div");
                pCard.className = "product-card uniform-size";

                pCard.innerHTML =
                    `<img src="${ product.image }" alt="${ product.title }" class="product-image uniform-image">
                        <div class="product-info">
                            <h2>${ product.title }</h2>
                            <p class="price">$${ product.price.toLocaleString() }</p>
                            <p class="rating">${ product.rating.rate }⭐ (${ product.rating.count } reviews)</p>
                            <button class="buy-btn">Buy</button>
                        </div>
                    `;

                const buyBtn = pCard.querySelector('.buy-btn');
                buyBtn.addEventListener('click', function() {
                    localStorage.setItem('selectedProductId', product.id);
                    window.location.href = '../Product/product.html';
                });

                container.appendChild(pCard);
            });
    })

    .catch( error =>{
        console.error( "Error fetching roducts :", error );
        container.innerHTML = "<p> Failed to load products. Please try again later. </p>";
    });
});



document.addEventListener( "DOMContentLoaded", () =>{
    const featuredContainer = document.getElementById("featured");
    const visibleProd = 4;
    const invisibleProd = 6;
    const changeTime = 500;
    const stayTime = 4500; 

    function getDate(){
        return new Date().toDateString();
    }

    function shuffle(arr){
        for( let i = arr.length - 1; i > 0; i-- ){
            const j = Math.floor( Math.random() * (i + 1) );
            [ arr[i], arr[j]] = [arr[j], arr[i] ];
        }
    }

    function pickRandomProd( products, count ){
        shuffle(products);
        return products.slice( 0, count );
    }

    function displayProd(items){
        featuredContainer.innerHTML = '';

        items.forEach( item =>{
            const div = document.createElement("div");
            div.className = "product-card";
            div.innerHTML = 
                `<img src="${item.image}" alt="${item.title}" class="product-image">
                <div class="product-info">
                    <h2>${item.title}</h2>
                    <p class="price">$${item.price.toLocaleString()}</p>
                    <p class="rating">${item.rating.rate}⭐ (${item.rating.count} reviews)</p>
                </div>`;
            featuredContainer.appendChild(div);
        });

        for( let i = 0; i < visibleProd; i++ ){
            const clone = featuredContainer.children[i].cloneNode(true);
            featuredContainer.appendChild(clone);
        }

        let index = 0;
        const movePercent = 100 / visibleProd;

        setInterval( () =>{
            index++;
            featuredContainer.style.transition = `transform ${changeTime}ms ease-in-out`;
            featuredContainer.style.transform = `translateX(-${index * movePercent}%)`;

            if ( index === items.length ){
                setTimeout( () =>{
                    featuredContainer.style.transition = 'none';
                    featuredContainer.style.transform = 'translateX(0)';
                    index = 0;
                }, changeTime );
            }
        }, stayTime );
    }

    const cachedItems = localStorage.getItem('featuredItems');
    const cachedDate = localStorage.getItem('featuredItemsDate');
    const today = getDate();

    if ( cachedItems && cachedDate === today ){
        displayProd( JSON.parse(cachedItems) );
    } else {
        fetch( "https://fakestoreapi.com/products" ).then( res => res.json() ).then( products =>{
                const randomItems = pickRandomProd( products, invisibleProd );

                localStorage.setItem( "featuredItems", JSON.stringify(randomItems) );
                localStorage.setItem( "featuredItemsDate", today );

                displayProd(randomItems);
        }).catch( err =>{
                console.error( "Failed to fetch featured products:", err );
                featuredContainer.innerHTML = "<p> Unable to load featured products. </p>";
        });
    }
});