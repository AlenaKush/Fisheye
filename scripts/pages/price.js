import { fetchPhotographers, fetchMedia, getPhotographerIdFromUrl, getPhotographerById } from './fetch.js';

export async function likePriceDisplay(photographerId) {
    const photographer = await getPhotographerById(photographerId);
    const likePricePlate = document.createElement('article');
    const main = document.getElementById('main');

    main.appendChild(likePricePlate);
    likePricePlate.classList.add('like-price-plate');

    const likeTotal = document.createElement('p');
    likePricePlate.appendChild(likeTotal);
    const media = await fetchMedia();
    const photographerMedia = media.filter(item => item.photographerId === photographerId);
    let likeCount = 0;
    photographerMedia.forEach(item => {
        likeCount += item.likes;
    });
    likeTotal.textContent = likeCount;

    const price = document.createElement('p');
    likePricePlate.appendChild(price);
    price.textContent = `${photographer.price}€/jour`;

}

const photographerId = getPhotographerIdFromUrl();

likePriceDisplay(photographerId);