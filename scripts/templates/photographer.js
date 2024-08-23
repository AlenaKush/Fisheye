export function photographerTemplate(data) {
    const { id, name, portrait, city, country, tagline, price } = data;

    const picture = `/assets/photographers/${portrait}`;

    function getUserCardDOM() {
        const article = document.createElement( 'article' );
        
        const link = document.createElement('a'); 
        link.setAttribute('href', `photographer.html?id=${id}`); 
        link.setAttribute('aria-label', `View details for ${name}`); 

        const img = document.createElement( 'img' );
        img.setAttribute("src", picture);
        img.setAttribute("alt", `${name}'s portrait`);

        const h2 = document.createElement( 'h2' );
        h2.textContent = name;

        const location = document.createElement( 'p' );
        location.textContent = `${city}, ${country}`;
        location.classList.add('photographer-location');

        const tag = document.createElement( 'p' );
        tag.textContent = tagline;
        tag.classList.add('photographer-tagline');

        const cost = document.createElement( 'p' );
        cost.textContent = `${price}€/jour`;
        cost.classList.add('photographer-price');

        link.appendChild(img); 
        link.appendChild(h2); 
        article.appendChild(link); 

        article.appendChild(location);
        article.appendChild(tag);
        article.appendChild(cost)
        return (article);
    }
    return { id, name, picture, city, country, tagline, price, getUserCardDOM }
}