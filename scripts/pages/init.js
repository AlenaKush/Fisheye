

import { getMedia } from './media.js';
import { displayData } from './photographer.js';
import { getPhotographerIdFromUrl, getPhotographerById } from './fetch.js';


async function init() {
    const photographerId = getPhotographerIdFromUrl(); //храним id  в переменной
    const photographer = await getPhotographerById(photographerId); //храним данные фотографа из json найденого по id
    await displayData(photographer);
    await getMedia(photographerId);

}

init();
