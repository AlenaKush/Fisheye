

import { getMedia } from './media.js';
import { photographerTemplate, photographePortrait, displayData } from './photographer.js';
import { fetchPhotographers, fetchMedia, getPhotographerIdFromUrl, getPhotographerById } from './fetch.js';
import { likePriceDisplay } from './price.js';

async function init() {
    const photographerId = getPhotographerIdFromUrl(); //храним id  в переменной
    const photographer = await getPhotographerById(photographerId); //храним данные фотографа из json найденого по id
    await displayData(photographer);
    await getMedia(photographerId);

}

init();
