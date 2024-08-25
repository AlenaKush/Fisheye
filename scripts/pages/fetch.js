
//get photographers data from json
export async function fetchPhotographers() {
    const response = await fetch('../../data/photographers.json');
    const data = await response.json();
    return data.photographers;
}

//get media data from json
export async function fetchMedia() {
    const response = await fetch('../../data/photographers.json');
    const data = await response.json();
    return data.media;
}

//get id from url
export function getPhotographerIdFromUrl() {
    const params = new URL(document.location).searchParams; 
    return parseInt(params.get('id'));
}

//get photographer by id from json
export async function getPhotographerById(id) {
    const photographers = await fetchPhotographers(); 
    return photographers.find(photographer => photographer.id === id); // Rechercher un photographe avec l'ID qui sera passé en paramètre à la fonction
}
