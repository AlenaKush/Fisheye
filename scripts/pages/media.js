import { fetchMedia, getPhotographerIdFromUrl, getPhotographerById } from "./fetch.js";

let photographerMedia = [];
let currentMediaIndex = 0;
let photographerFolder = '';

function sortByPopularity(a, b) {
    return b.likes - a.likes;
}

function sortByDate(a, b) {
    return new Date(b.date) - new Date(a.date);
}

function sortByTitle(a, b) {
    return a.title.localeCompare(b.title);
}

// Получение медиа
export async function getMedia(photographerId, sortBy = 'popularity') {
    const media = await fetchMedia();
    const photographer = await getPhotographerById(photographerId);
    const mediaGallery = document.getElementById('media-gallery');
    mediaGallery.innerHTML = ''; // Очистить галерею перед добавлением медиа
    photographerMedia = media.filter(item => item.photographerId === photographerId);
    photographerFolder = photographer.name;

    // Сортировка медиа
    if (sortBy === 'popularity') {
        photographerMedia.sort(sortByPopularity);
    } else if (sortBy === 'date') {
        photographerMedia.sort(sortByDate);
    } else if (sortBy === 'title') {
        photographerMedia.sort(sortByTitle);
    }

    photographerMedia.forEach((item, index) => {
        const mediaItem = document.createElement('figure'); // Используем <figure> для группировки медиа и подписи
        mediaItem.classList.add('media-item');
        mediaItem.setAttribute('tabindex', '0');

        if (item.image) {
            const img = document.createElement('img');
            img.setAttribute('src', `../../assets/media/${photographerFolder}/${item.image}`);
            img.setAttribute('alt', item.title);
            img.setAttribute('aria-label', item.title);
            img.classList.add('media-image');
            mediaItem.appendChild(img);
        } else if (item.video) {
            const video = document.createElement('video');
            video.setAttribute('src', `../../assets/media/${photographerFolder}/${item.video}`);
            video.setAttribute('aria-label', item.title);
            video.setAttribute('controls', true);
            video.classList.add('media-video');
            mediaItem.appendChild(video);
        }

        // Создаем и добавляем подпись
        const caption = document.createElement('figcaption');
        const captionTitle = document.createElement('p');
        captionTitle.textContent = item.title;
        mediaGallery.appendChild(mediaItem);
        mediaItem.appendChild(caption);
        caption.appendChild(captionTitle);

        const captionLikes = document.createElement('div');
        captionLikes.classList.add('likes');
        const heart = document.createElement('img');
        heart.setAttribute('alt', 'likes');
        heart.setAttribute('src', '../../assets/icons/heart.svg');
        heart.setAttribute('tabindex', '0');
        const paragraph = document.createElement('p');
        paragraph.textContent = item.likes;
        caption.appendChild(captionLikes);
        captionLikes.appendChild(paragraph);
        captionLikes.appendChild(heart);

        item.hasLiked = false;
        heart.addEventListener('click', () => {
            if (item.hasLiked) {
                item.likes -= 1;
                item.hasLiked = false;
                heart.setAttribute('src', '../../assets/icons/heart.svg');
            } else {
                item.likes += 1;
                item.hasLiked = true;
                heart.setAttribute('src', '../../assets/icons/black_heart.svg');
            }
            paragraph.textContent = item.likes;
        });

        heart.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                heart.click();
            }
        });

        mediaItem.addEventListener('click', (event) => {
            if (!event.target.closest('.likes')) {
                event.preventDefault();
                currentMediaIndex = index; // Сохраняем индекс выбранного медиа
                openLightBox();
            }
        });

        mediaItem.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                currentMediaIndex = index; // Сохраняем индекс выбранного медиа
                openLightBox();
            }
        });
    });
}

function setupNavigation() {
    const lightBox = document.getElementById('lightBox');
    const navNext = document.getElementById('nav_next');
    const navPrev = document.getElementById('nav_prev');

    function updateLightBoxContent(index) {
        const lightBoxContent = document.querySelector('.lightBox_content');
        lightBoxContent.innerHTML = '';

        const mediaItem = photographerMedia[index];
        const figure = document.createElement('figure');

        if (mediaItem.image) {
            const img = document.createElement('img');
            img.setAttribute('src', `../../assets/media/${photographerFolder}/${mediaItem.image}`);
            img.setAttribute('alt', mediaItem.title || 'Media image');
            img.setAttribute('aria-label', mediaItem.title || 'Media image');
            figure.appendChild(img);
        } else if (mediaItem.video) {
            const video = document.createElement('video');
            video.setAttribute('src', `../../assets/media/${photographerFolder}/${mediaItem.video}`);
            video.setAttribute('aria-label', mediaItem.title || 'Media video');
            video.setAttribute('controls', true);
            figure.appendChild(video);
        }

        const figcaption = document.createElement('figcaption');
        figcaption.textContent = mediaItem.title;
        figure.appendChild(figcaption);

        lightBoxContent.appendChild(figure);
    }

    navNext.addEventListener('click', () => {
        currentMediaIndex = (currentMediaIndex + 1) % photographerMedia.length;
        updateLightBoxContent(currentMediaIndex);
    });

    navPrev.addEventListener('click', () => {
        currentMediaIndex = (currentMediaIndex - 1 + photographerMedia.length) % photographerMedia.length;
        updateLightBoxContent(currentMediaIndex);
    });

    lightBox.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') {
            navNext.click();
        } else if (event.key === 'ArrowLeft') {
            navPrev.click();
        }
    });

    navNext.setAttribute('tabindex', '0');
    navPrev.setAttribute('tabindex', '0');
}

function openLightBox() {
    const lightBox = document.getElementById('lightBox');
    const lightBoxContent = document.querySelector('.lightBox_content');
    lightBoxContent.innerHTML = '';

    const mediaItem = photographerMedia[currentMediaIndex];
    const figure = document.createElement('figure');

    if (mediaItem.image) {
        const img = document.createElement('img');
        img.setAttribute('src', `../../assets/media/${photographerFolder}/${mediaItem.image}`);
        img.setAttribute('alt', mediaItem.title);
        img.setAttribute('aria-label', mediaItem.title);
        figure.appendChild(img);
    } else if (mediaItem.video) {
        const video = document.createElement('video');
        video.setAttribute('src', `../../assets/media/${photographerFolder}/${mediaItem.video}`);
        video.setAttribute('aria-label', mediaItem.title);
        video.setAttribute('controls', true);
        figure.appendChild(video);
    }

    const figcaption = document.createElement('figcaption');
    figcaption.textContent = mediaItem.title;
    figure.appendChild(figcaption);

    lightBoxContent.appendChild(figure);
    lightBox.style.display = 'flex';
    lightBox.setAttribute('aria-hidden', 'false');
    document.getElementById('overlay').style.display = 'block';

    setupNavigation();
}

function closeLightBox() {
    const lightBox = document.getElementById('lightBox');
    lightBox.style.display = 'none';
    lightBox.setAttribute('aria-hidden', 'true');
    document.getElementById('overlay').style.display = 'none';
}

const photographerId = getPhotographerIdFromUrl();
const filter = document.getElementById('filter');
    filter.addEventListener('change', () => {
        const selectedOption = filter.value;
        getMedia(photographerId, selectedOption);
    })
