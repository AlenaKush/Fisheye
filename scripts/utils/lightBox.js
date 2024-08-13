import { fetchPhotographers, fetchMedia, getPhotographerIdFromUrl, getPhotographerById } from '../pages/fetch.js';

export function closeLightBox() {
    const lightBox = document.getElementById('lightBox');
    lightBox.style.display = "none";
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'none';
    lightBox.setAttribute('aria-hidden', 'true');
}