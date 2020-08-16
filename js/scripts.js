const peopleUrl = 'https://randomuser.me/api/?results=12';

async function getData(url) {
    const userResponse = await fetch(url);
    const userJSON = await userResponse.json();

    return console.log(userJSON.results);
}

getData(peopleUrl);