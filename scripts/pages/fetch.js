
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
    const photographers = await fetchPhotographers(); //сохраняем ответ функции fetchPhotographers в переменную
    return photographers.find(photographer => photographer.id === id); //ищем фотографа с id который будет передан в качестве параметра в функцию
}