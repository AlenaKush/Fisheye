import { fetchMedia, getPhotographerIdFromUrl, getPhotographerById } from "./fetch.js";

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

function createLightBoxContent() {
    const lightBoxContent = document.querySelector('.lightBox_content');
    const ul = document.createElement('ul');
    ul.classList.add('media-list');

    photographerMedia.forEach((mediaItem, index) => {
        const li = document.createElement('li');
        li.classList.add('media-item');
        li.setAttribute('data-index', index);
        li.style.display = 'none'; // Скрываем все элементы по умолчанию

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

    lightBoxContent.innerHTML = ''; // Очищаем перед добавлением нового содержимого
    lightBoxContent.appendChild(ul);
}

function updateLightBoxVisibility(index) {
    const mediaItems = document.querySelectorAll('.media-list .media-item');
    mediaItems.forEach(item => {
        item.style.display = 'none'; // Скрыть все элементы
    });
    
    const currentItem = document.querySelector(`.media-list .media-item[data-index="${index}"]`);
    if (currentItem) {
        currentItem.style.display = 'block'; // Показать текущий элемент
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

    document.getElementById('lightBox').addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') {
            navNext.click();
        } else if (event.key === 'ArrowLeft') {
            navPrev.click();
        }
    });

    navigationInitialized = true;  // Помечаем навигацию как инициализированную
}

export async function getMedia(photographerId, sortBy = 'popularity') {
    const media = await fetchMedia();
    const photographer = await getPhotographerById(photographerId);
    const mediaGallery = document.getElementById('media-gallery');
    mediaGallery.innerHTML = ''; // Очистить галерею перед добавлением медиа
    photographerMedia = media.filter(item => item.photographerId === photographerId);
    console.log(photographerMedia);
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

    setupNavigation();  // Инициализируем навигацию
}

window.closeLightBox = closeLightBox;
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
});
