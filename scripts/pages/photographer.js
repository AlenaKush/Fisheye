
export function photographerTemplate(photographer) {
    return {
        getUserCardDOM: function() {
            const article = document.createElement('article');

            const h2 = document.createElement('h2');
            h2.textContent = photographer.name;

            const location = document.createElement('p');
            location.textContent = `${photographer.city}, ${photographer.country}`;

            const tagline = document.createElement('p');
            tagline.textContent = photographer.tagline;

            article.classList.add('photographer-profile');
            article.appendChild(h2);
            article.appendChild(location);
            article.appendChild(tagline);

            return article;
        }
    };
}

// Créer le portrait du photographe
export function photographePortrait(photographer) {
    return {
        getImgCardDOM: function() {
            const picture = `/assets/photographers/${photographer.portrait}`;
            const img = document.createElement('img');
            img.setAttribute("src", picture);
            img.setAttribute("alt", `${photographer.name}'s portrait`);
            return img;
        }
    };
}

//отображение карточки фотографа
export async function displayData(photographer) {
    const photographerSection = document.querySelector(".photograph-header");

    const photographerModel = photographerTemplate(photographer);
    const userCardDOM = photographerModel.getUserCardDOM();
    const button = document.querySelector(".contact_button");
    photographerSection.insertBefore(userCardDOM, button);

    const photographerPhoto = photographePortrait(photographer);
    const imgCardDOM = photographerPhoto.getImgCardDOM();
    button.insertAdjacentElement('afterend', imgCardDOM);
}


