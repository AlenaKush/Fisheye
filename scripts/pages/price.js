import { fetchMedia, getPhotographerIdFromUrl, getPhotographerById } from './fetch.js';

export async function likePriceDisplay(photographerId) {
    const photographer = await getPhotographerById(photographerId);
    const likePricePlate = document.createElement('article');
    const main = document.getElementById('main');

    main.appendChild(likePricePlate);
    likePricePlate.classList.add('like-price-plate');

    const likeTotal = document.createElement('div');
    likeTotal.classList.add('total-likes');
    const paragraph = document.createElement('p');
    const heart = document.createElement('img');
    heart.setAttribute('src', '../../assets/icons/black_heart.svg');
    heart.setAttribute('alt', 'likes');
    likePricePlate.appendChild(likeTotal);
    likeTotal.appendChild(paragraph);
    const media = await fetchMedia();
    const photographerMedia = media.filter(item => item.photographerId === photographerId);
    
    function calculateTotalLikes(photographerMedia) {
        let likeCount = 0;
        photographerMedia.forEach(item => {
        likeCount += item.likes;
        });
        return likeCount;
    }

    function updateTotalLikes(value) {
        let curentLike = parseInt(paragraph.textContent, 10);
        curentLike += value;
        paragraph.textContent = curentLike;
    }

    paragraph.textContent = calculateTotalLikes(photographerMedia);
    likeTotal.appendChild(heart);
    const price = document.createElement('p');
    likePricePlate.appendChild(price);
    price.textContent = `${photographer.price}€ / jour`;

    return updateTotalLikes;
}

const photographerId = getPhotographerIdFromUrl();

likePriceDisplay(photographerId);
