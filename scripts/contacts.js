async function init() {
  let contacts = await fetchData("/contacts/");
  let contactsArray = Object.values(contacts);

  getListOfContacts(contactsArray);
}

async function fetchData(path) {
  let response = await fetch(BASE_URL + path + ".json");
  let responseAsJson = await response.json();
  return responseAsJson;
}

function getListOfContacts(contactsArray) {
  for (user of contactsArray) {
    let emailOfUser = user.email;
    let nameOfUser = user.name;

    getTemplate(emailOfUser, nameOfUser);
  }
}

function getTemplate(emailOfUser, nameOfUser) {
  let alphabeticalOrderRef = document.getElementById("alphabeticalOrderA");

  alphabeticalOrderRef.innerHTML += `<div class="order">
              <span>A</span>
            </div>
            <div class="seperator"></div>
            <div class="contactInfo">
              <div class="circleFirstLetters">
                <span>A</span>
                <span>M</span>
              </div>
              <div class="maininfoAboutContact">
                <span class="name">${nameOfUser}</span>
                <span class="email">${emailOfUser}</span>
              </div>
            </div>
          </div>`;
}
