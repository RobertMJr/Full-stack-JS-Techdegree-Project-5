const peopleUrl = 'https://randomuser.me/api/?results=12&nat=us';
const galleryDiv = document.getElementById('gallery');
const searchDiv =  document.querySelector('.search-container');

/**
 * Fetch the data and parse it
 * @param {string} url 
 * @returns {promise} returns a collection of promises containing the parsed data
 */
async function getData(url) {
    const userResponse = await fetch(url).catch(e => console.log('Error fetching data: ', e) );
    const userJSON = await userResponse.json();
    const users = userJSON.results.map(async user => user);
    return Promise.all(users);
}

/**
 * Format the phone number
 * @param {string} phoneNumber - the phone number to format
 * @returns {string} returns the phone number in the required format
 */
function formatPhone (phoneNumber) {
    const regex = /^\D*(\d{3})\D*(\d{3})\D*(\d{4})\D*$/;
    return phoneNumber.replace(regex, '($1) $2-$3');  
}

/**
 * Generate the HTML for the gallery items and append it to the gallery div
 * @param {object} data - the parsed data from the fetch request
 */
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

/**
 * Format the birth date
 * @param {string} dateOfBirth
 * @returns {string} returns the formated date of birth
 */
function formatDate (dateOfBirth){
    let newDate = new Date(dateOfBirth).toISOString().split('T')[0].split('-');
    newDate = `${newDate[1]}/${newDate[2]}/${newDate[0]}`;
    return newDate;
}

/**
 * Create a modal window with the details of the selected profile card
 * @param {object} data - the parsed data from the fetch request
 * @param {string} index - the index of the data
 * @returns {object} returns the created div element
 */
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
            <p class="modal-text">${formatPhone(data[index].cell)}</p>
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
    /**
     * Select the next and previous buttons
     * Add en event listener on the previous and next buttons to allow toggling back and forth between employee profiles
     */
    const nextButton = document.getElementById('modal-next');
    const prevButton = document.getElementById('modal-prev');
    prevButton.addEventListener('click', () => {
        divModal.remove();
        if (parseInt(index) === 0) {
            index = '12';
        }
        document.querySelector('body').appendChild(generateModalWindow(data, (parseInt(index) - 1)));  
    });
    nextButton.addEventListener('click', () => {
        divModal.remove();
        if (parseInt(index) === 11){
            index = '-1';
        }
        document.querySelector('body').appendChild(generateModalWindow(data, (parseInt(index) + 1)));
    });
    /**
     * Select the close buttone and add an event listener to it to allow closing the modal window
    */
    const closeButton =  document.getElementById('modal-close-btn');
    closeButton.addEventListener('click', (e)=> {
        divModal.remove();
    });
    return divModal;
}

/**
 * Create and append a search bar to the page dinamically 
 */
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

/**
 * Filter employees by name based on the value inserted in the search field
 * @param {object} employee - the search bar field
 */
function searchEmployee (employee) {
    const employeeNames =  document.querySelectorAll('.card-name');
    for (let i = 0; i < employeeNames.length; i+= 1){
        if (employee.value.length !== 0 & employeeNames[i].innerHTML.toLowerCase().includes(employee.value.toLowerCase())){
            employeeNames[i].parentElement.parentElement.style.display = '';
        }
        else if (employee.value.length === 0) {
            employeeNames[i].parentElement.parentElement.style.display = '';
        }
        else {
            employeeNames[i].parentElement.parentElement.style.display = 'none';
        }
    }
}

/**
 * Asynchronous function to execute the fetching of data and generating the page, its content and functionality
 * Add event listeners to the input field and submit button on the search bar
 * Add event listeners to the profile cards to display a modal window with its information
 */
async function execute () {
    const userProfiles = await getData(peopleUrl).catch(e => {
        document.querySelector('body').innerHTML = '<h3>Something went wrong.</h3>';
    });
    generateGallery(userProfiles);
    generateSearchBar();
    const input = document.getElementById('search-input');
    const submit = document.getElementById('search-submit');
    submit.addEventListener('click', () => {
        searchEmployee(input);
    })
    input.addEventListener('keyup', () => {
        searchEmployee(input);
    });
    const cardDiv = document.querySelectorAll(".card");
    cardDiv.forEach(item => {
        item.addEventListener('click', (event) => {
            generateModalWindow(userProfiles, event.target.closest('.card').dataset.index);
        });   
    });
}
execute();
