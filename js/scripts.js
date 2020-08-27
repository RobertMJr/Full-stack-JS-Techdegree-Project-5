const peopleUrl = 'https://randomuser.me/api/?results=12&nat=us';
const galleryDiv = document.getElementById('gallery');
const searchDiv =  document.querySelector('.search-container');

async function getData(url) {
    const userResponse = await fetch(url);
    const userJSON = await userResponse.json();

    const users = userJSON.results.map(async user => user);
    return Promise.all(users);
}


function generateGallery(data) {
    data.map((person, index) => {
        const divIndex = index;
        const divEl = document.createElement('div');
        divEl.className = 'card';
        divEl.dataset.index = divIndex;
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
        galleryDiv.appendChild(divEl);

    });
}

function formatDate (dateOfBirth){
    let newDate = new Date(dateOfBirth).toISOString().split('T')[0].split('-');
    newDate = `${newDate[1]}/${newDate[2]}/${newDate[0]}`;
    return newDate;
}

function generateModalWindow(data) {
    const divModal =  document.createElement('div');
    divModal.className = 'modal-container';
    divModal.innerHTML = `
    <div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container">
            <img class="modal-img" src="${data.picture.large}" alt="profile picture">
            <h3 id="${data.name.last + data.name.first}" class="modal-name cap">${data.name.first} ${data.name.last}</h3>
            <p class="modal-text">${data.email}</p>
            <p class="modal-text cap">${data.location.city}</p>
            <hr>
            <p class="modal-text">${data.cell}</p>
            <p class="modal-text">${data.location.street.number} ${data.location.street.name}, ${data.location.city}, ${data.location.state} ${data.location.postcode}</p>
            <p class="modal-text">Birthday: ${formatDate(data.dob.date)}</p>
        </div>
    </div>
    `;
    document.querySelector('body').appendChild(divModal);
}

function generateSearchBar(){
    const searchForm =  document.createElement('form');
    searchForm.action = "#";
    searchForm.method = "get";
    searchForm.innerHTML = `
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    `;
    searchDiv.appendChild(searchForm);
}

function searchEmployee (employee, employeeList) {
    for (let i = 0; i < employeeList.length; i+= 1){
        if (employee.value.length !== 0 & employeeList[i].innerHTML.toLowerCase().includes(employee.value.toLowerCase())){
            employeeList[i].parentElement.parentElement.style.display = '';
        }
        else if (employee.value.length === 0) {
            employeeList[i].parentElement.parentElement.style.display = '';
        }
        else {
            employeeList[i].parentElement.parentElement.style.display = 'none';
        }
    }
}

async function execute () {
    const userProfiles = await getData(peopleUrl);
    console.log(userProfiles);
    generateGallery(userProfiles);
    generateSearchBar();
    const input = document.getElementById('search-input');
    const submit = document.getElementById('search-submit');
    const employeeNames =  document.querySelectorAll('.card-name');
    submit.addEventListener('click', () => {
        searchEmployee(input, employeeNames);
    })
    input.addEventListener('keyup', () => {
        searchEmployee(input, employeeNames);
    });
    const cardDiv = document.querySelectorAll(".card");
    cardDiv.forEach(item => {
        item.addEventListener('click', async(event) => {
        generateModalWindow(userProfiles[event.target.closest('.card').dataset.index]);
        const closeButton =  document.getElementById('modal-close-btn');
        const divModal = document.querySelector('.modal-container');
        closeButton.addEventListener('click', (e)=> {
            divModal.remove();
        });
        }) 
    })
};
execute();
