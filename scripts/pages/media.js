import { fetchMedia } from "./fetch.js";

//Получение медиа
export async function getMedia(photographerId, sortBy = 'Popularité') {
    const media = await fetchMedia();
    const photographer = await getPhotographerById(photographerId);
    const mediaGallery = document.getElementById('media-gallery');
    mediaGallery.innerHTML = ''; // Очистить галерею перед добавлением отсортированных медиа

    const photographerMedia = media.filter(item => item.photographerId === photographerId);

    //trie
    photographerMedia.sort() // функция которая будет сортировать фото дописать

    const photographerFolder = photographer.name;

    photographerMedia.forEach(item => {
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
        caption.textContent = item.title || 'No title'; // Устанавливаем текст подписи
        mediaItem.appendChild(caption);

        mediaGallery.appendChild(mediaItem);
    });
}