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

function generateModalWindow(data, index) {
    const divModal =  document.createElement('div');
    divModal.className = 'modal-container';
    divModal.innerHTML = `
    <div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container">
            <img class="modal-img" src="${data[index].picture.large}" alt="profile picture">
            <h3 id="${data[index].name.last + data[index].name.first}" class="modal-name cap">${data[index].name.first} ${data[index].name.last}</h3>
            <p class="modal-text">${data[index].email}</p>
            <p class="modal-text cap">${data[index].location.city}</p>
            <hr>
            <p class="modal-text">${data[index].cell}</p>
            <p class="modal-text">${data[index].location.street.number} ${data[index].location.street.name}, ${data[index].location.city}, ${data[index].location.state} ${data[index].location.postcode}</p>
            <p class="modal-text">Birthday: ${formatDate(data[index].dob.date)}</p>
        </div>
    </div>
    <div class="modal-btn-container">
        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
        <button type="button" id="modal-next" class="modal-next btn">Next</button>
    </div>
    `;
    document.querySelector('body').appendChild(divModal);
    const nextButton = document.getElementById('modal-next');
    nextButton.addEventListener('click', () => {
        divModal.remove();
        document.querySelector('body').appendChild(generateModalWindow(data, (parseInt(index) + 1)));
        index += 1;
    });
    const closeButton =  document.getElementById('modal-close-btn');
    closeButton.addEventListener('click', (e)=> {
        divModal.remove();
    });
    return divModal;
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
        item.addEventListener('click', (event) => {
            generateModalWindow(userProfiles, event.target.closest('.card').dataset.index);
        });   
    });
};
execute();
