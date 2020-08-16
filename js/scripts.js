const peopleUrl = 'https://randomuser.me/api/?results=12';
const galleryDiv = document.getElementById('gallery');

async function getData(url) {
    const userResponse = await fetch(url);
    const userJSON = await userResponse.json();

    const users = userJSON.results.map(async user => user);
    return Promise.all(users);
}



function generateGallery(data) {
    data.map(person => {
        const divEl = document.createElement('div');
        galleryDiv.appendChild(divEl);
        divEl.className = 'card';
        divEl.innerHTML = `
        <div class="card-img-container">
            <img class="card-img" src="${person.picture.large}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="${person.name.last + person.name.first}" class="card-name cap">${person.name.first} ${person.name.last}</h3>
            <p class="card-text">${person.email}</p>
            <p class="card-text cap">${person.location.city}, ${person.location.state}</p>
        </div>
        `;

    });
}

async function execute () {
    const userProfiles = await getData(peopleUrl);
    generateGallery(userProfiles);    
}
execute();
