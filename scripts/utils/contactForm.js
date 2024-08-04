/*import {fetchPhotographers, getPhotographerIdFromUrl, getPhotographerById} from '../pages/fetch.js'; 
*/


function displayModal() {
    const modal = document.getElementById("contact_modal");
	modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
}

//get photographers data from json
async function fetchPhotographers() {
    const response = await fetch('../../data/photographers.json');
    const data = await response.json();
    return data.photographers;
}

//get id from url
function getPhotographerIdFromUrl() {
    const params = new URL(document.location).searchParams; 
    return parseInt(params.get('id'));
}

//get photographer by id from json
async function getPhotographerById(id) {
    const photographers = await fetchPhotographers(); //сохраняем ответ функции fetchPhotographers в переменную
    return photographers.find(photographer => photographer.id === id); //ищем фотографа с id который будет передан в качестве параметра в функцию
}

const photographerId = getPhotographerIdFromUrl();



async function addName(photographerId) {
    const photographer = await getPhotographerById(photographerId); //присваиваем переменной весь обьект фотографа
    const h2 = document.querySelector('h2');
    h2.setAttribute('aria-label', `Contact me ${photographer.name}`);
    h2.innerHTML += `<br>${photographer.name}`;

}

// Вызов функции для вставки нового элемента

addName(photographerId);


const submitButton = document.querySelector('.contact_button');
submitButton.addEventListener('click', function(event) {
    const firstName = document.querySelector('#first').value;
    console.log(firstName);
});