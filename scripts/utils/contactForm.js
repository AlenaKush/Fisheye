
window.displayModal = displayModal;
function displayModal() {
    const modal = document.getElementById("contact_modal");
	modal.style.display = "block";
    document.getElementById('first').focus();
    modal.setAttribute('aria-hidden', 'false');
    const form = document.getElementById('contact_form');
    form.reset();
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'block';

}

function closeModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
}

// Добавляем обработчик для клавиши Enter на крестике
document.querySelector('[aria-label="Close Contact form"]').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        closeModal();
    }
});

function trapFocus(event) {
    const focusableElements = 'button, img, input, textarea'; // Примеры фокусируемых элементов
    const modal = document.getElementById('contact_modal');
    const focusableContent = modal.querySelectorAll(focusableElements);
    const firstFocusableElement = focusableContent[0];
    const lastFocusableElement = focusableContent[focusableContent.length - 1];

    if (event.key === 'Tab') {
        if (document.activeElement === lastFocusableElement) {
            event.preventDefault();
            firstFocusableElement.focus();
        }
    }
}

document.getElementById('contact_modal').addEventListener('keydown', trapFocus);


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

const submitButton = document.querySelector('.send_button');
submitButton.addEventListener('click', function(event) {
    event.preventDefault();
    const firstName = document.querySelector('#first').value;
    const lastName = document.querySelector('#last').value;
    const email = document.querySelector('#email').value;
    const message = document.querySelector('#message').value;
    console.log(firstName);
    console.log(lastName);
    console.log(email);
    console.log(message);
    closeModal();
});
