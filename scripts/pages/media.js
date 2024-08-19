import { fetchMedia, getPhotographerIdFromUrl, getPhotographerById } from "./fetch.js";
import { likePriceDisplay } from "./price.js";

let photographerMedia = [];
let currentMediaIndex = 0;
let photographerFolder = '';
let navigationInitialized = false;  // Добавляем флаг для предотвращения многократного добавления обработчиков

function sortByPopularity(a, b) {
    return b.likes - a.likes;
}

function sortByDate(a, b) {
    return new Date(b.date) - new Date(a.date);
}

function sortByTitle(a, b) {
    return a.title.localeCompare(b.title);
}

export async function getMedia(photographerId, sortBy = 'popularity') {
    const media = await fetchMedia();
    const photographer = await getPhotographerById(photographerId);
    const updateTotalLikes = await likePriceDisplay(photographerId);
    const mediaGallery = document.getElementById('media-gallery');
    mediaGallery.innerHTML = '';
    photographerMedia = media.filter(item => item.photographerId === photographerId);
    photographerFolder = photographer.name;

    if (sortBy === 'popularity') {
        photographerMedia.sort(sortByPopularity);
    } else if (sortBy === 'date') {
        photographerMedia.sort(sortByDate);
    } else if (sortBy === 'title') {
        photographerMedia.sort(sortByTitle);
    }

    photographerMedia.forEach((item, index) => {
        const mediaItem = document.createElement('figure');
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
                updateTotalLikes(-1);
            } else {
                item.likes += 1;
                item.hasLiked = true;
                heart.setAttribute('src', '../../assets/icons/black_heart.svg');
                updateTotalLikes(1);
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
                currentMediaIndex = index;
                openLightBox();
            }
        });

        mediaItem.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                currentMediaIndex = index;
                openLightBox();
            }
        });
    });
}

function openLightBox() {
    const lightBox = document.getElementById('lightBox');
    createLightBoxContent();
    updateLightBoxVisibility(currentMediaIndex);

    lightBox.style.display = 'flex';
    lightBox.setAttribute('aria-hidden', 'false');
    document.getElementById('overlay').style.display = 'block';


    const closeButton = document.getElementById('close_lightbox');
    closeButton.focus();

    setupNavigation();
}

window.closeLightBox = closeLightBox;
function closeLightBox() {
    const lightBox = document.getElementById('lightBox');
    lightBox.style.display = 'none';
    lightBox.setAttribute('aria-hidden', 'true');
    document.getElementById('overlay').style.display = 'none';
}


function createLightBoxContent() {
    const lightBoxContent = document.querySelector('.lightBox_content');
    const ul = document.createElement('ul');
    ul.classList.add('media_list');

    photographerMedia.forEach((mediaItem, index) => {
        const li = document.createElement('li');
        li.classList.add('media_element');
        li.setAttribute('data-index', index);
        li.style.display = 'none';

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

        li.appendChild(figure);
        ul.appendChild(li);
    });

    lightBoxContent.innerHTML = '';
    lightBoxContent.appendChild(ul);

    
    document.getElementById('lightBox').addEventListener('keydown', trapFocus);
}

function updateLightBoxVisibility(index) {
    const mediaItems = document.querySelectorAll('.media_list .media_element');
    mediaItems.forEach(item => {
        item.style.display = 'none';
    });
    
    const currentItem = document.querySelector(`.media_list .media_element[data-index="${index}"]`);
    if (currentItem) {
        currentItem.style.display = 'block';
    }
}

function setupNavigation() {
    if (navigationInitialized) return;  // Проверяем, была ли навигация уже инициализирована

    const navNext = document.getElementById('nav_next');
    const navPrev = document.getElementById('nav_prev');

    navNext.addEventListener('click', () => {
        currentMediaIndex = (currentMediaIndex + 1) % photographerMedia.length;
        console.log('Next index:', currentMediaIndex);
        updateLightBoxVisibility(currentMediaIndex);
    });

    navPrev.addEventListener('click', () => {
        currentMediaIndex = (currentMediaIndex - 1 + photographerMedia.length) % photographerMedia.length;
        console.log('Previous index:', currentMediaIndex);
        updateLightBoxVisibility(currentMediaIndex);
    });

    navigationInitialized = true;  // Помечаем навигацию как инициализированную
}

document.querySelector('[aria-label="Close lightBox"]').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        closeLightBox();
    }
});


function handleNavigationKey(event, direction) {
    if (event.key === 'Enter') {
        event.preventDefault();
        if (direction === 'next') {
            document.getElementById('nav_next').click();
        } else if (direction === 'prev') {
            document.getElementById('nav_prev').click();
        }
    }
}

document.querySelector('[aria-label="Show previous image"]').addEventListener('keydown', function(event) {
    handleNavigationKey(event, 'prev');
});

document.querySelector('[aria-label="Show next image"]').addEventListener('keydown', function(event) {
    handleNavigationKey(event, 'next');
});

function trapFocus(event) {
    const focusableElements = 'img';
    const lightBox = document.getElementById('lightBox');
    const focusableContent = lightBox.querySelectorAll(focusableElements);
    const firstFocusableElement = focusableContent[0];
    const lastFocusableElement = focusableContent[focusableContent.length - 1];

    if (event.key === 'Tab') {
        if (document.activeElement === lastFocusableElement) {
            event.preventDefault();
            firstFocusableElement.focus();
        }
    }

    if (!lightBox.contains(document.activeElement)) {
        event.preventDefault();
        firstFocusableElement.focus();
    }
}

document.getElementById('lightBox').addEventListener('keydown', trapFocus);

const photographerId = getPhotographerIdFromUrl();
const filter = document.getElementById('filter');
filter.addEventListener('change', () => {
    const selectedOption = filter.value;
    getMedia(photographerId, selectedOption);
});
