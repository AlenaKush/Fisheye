

import { getMedia } from './media.js';
import { displayData } from './photographer.js';
import { getPhotographerIdFromUrl, getPhotographerById } from './fetch.js';


async function init() {
    const photographerId = getPhotographerIdFromUrl(); // Stocker l'ID dans une variable
    const photographer = await getPhotographerById(photographerId); // Stocker les données du photographe à partir du JSON trouvé par ID
    await displayData(photographer);
    await getMedia(photographerId);

}

init();
