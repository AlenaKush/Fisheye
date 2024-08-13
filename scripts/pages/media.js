import { fetchMedia, getPhotographerIdFromUrl, getPhotographerById } from "./fetch.js";

function sortByPopularity(a, b) {
    return b.likes - a.likes;
}

function sortByDate(a, b) {
    return new Date(b.date) - new Date(a.date);
}

function sortByTitle(a, b) {
    return a.title.localeCompare(b.title);
}

//Получение медиа
export async function getMedia(photographerId, sortBy = 'popularity') {
    const media = await fetchMedia();
    const photographer = await getPhotographerById(photographerId);
    const mediaGallery = document.getElementById('media-gallery');
    mediaGallery.innerHTML = ''; // Очистить галерею перед добавлением медиа
    const photographerMedia = media.filter(item => item.photographerId === photographerId);
    
    //trie
    if (sortBy === 'popularity') {
        photographerMedia.sort(sortByPopularity);
    } else if (sortBy === 'date') {
        photographerMedia.sort(sortByDate);
    } else if (sortBy === 'title') {
        photographerMedia.sort(sortByTitle);
    }

    const photographerFolder = photographer.name;

    photographerMedia.forEach((item) => {
        const mediaItem = document.createElement('figure'); // Используем <figure> для группировки медиа и подписи
        mediaItem.classList.add('media-item');
        mediaItem.setAttribute('tabindex', '0');

        if (item.image) {
            const img = document.createElement('img');
            img.setAttribute('src', `../../assets/media/${photographerFolder}/${item.image}`);
            img.setAttribute('alt', item.title || 'Media image');
            img.setAttribute('aria-label', item.title || 'Media image');
            img.classList.add('media-image');
            mediaItem.appendChild(img);
        } else if (item.video) {
            const video = document.createElement('video');
            video.setAttribute('src', `../../assets/media/${photographerFolder}/${item.video}`);
            video.setAttribute('aria-label', item.title || 'Media video');
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
        })

        heart.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                heart.click();
            }
        });





/*
        let currentMediaIndex = 0;

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
        });*/

        mediaItem.addEventListener('click', (event) => {
            // Проверяем, что клик не был на элементе лайка
            if (!event.target.closest('.likes')) {
                event.preventDefault();
                const lightBox = document.getElementById('lightBox');
                const lightBoxContent = document.querySelector('.lightBox_content');
                lightBoxContent.innerHTML = '';
        
                // Создаем элемент <figure> для лайтбокса
                const figure = document.createElement('figure');
        
                // Клонируем медиа (изображение или видео) и добавляем его в <figure>
                const clickedMedia = mediaItem.querySelector('img, video').cloneNode(true);
                figure.appendChild(clickedMedia);
        
                // Добавляем название медиа как подпись внутри <figcaption>
                const figcaption = document.createElement('figcaption');
                figcaption.textContent = item.title;
                figure.appendChild(figcaption);
        
                // Добавляем <figure> в содержимое лайтбокса
                lightBoxContent.appendChild(figure);
                lightBox.style.display = 'flex';
                lightBox.setAttribute('aria-hidden', 'false');
                const overlay = document.getElementById('overlay');
                overlay.style.display = 'block';
            }
        });

        mediaItem.addEventListener('keydown', (event) => {
            // Открываем лайтбокс, если нажата клавиша Enter
            if (event.key === 'Enter') {
                const lightBox = document.getElementById('lightBox');
                lightBox.style.display = 'block';
                lightBox.setAttribute('aria-hidden', 'false');
                const overlay = document.getElementById('overlay');
                overlay.style.display = 'block';
            }
        });
        
        
        
    });
}

const photographerId = getPhotographerIdFromUrl();
const filter = document.getElementById('filter');
    filter.addEventListener('change', () => {
        const selectedOption = filter.value;
        getMedia(photographerId, selectedOption);
    })
