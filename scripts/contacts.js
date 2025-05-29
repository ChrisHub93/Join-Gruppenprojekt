async function init() {
  let contacts = await fetchData("/contacts/");
  let contactsArray = Object.values(contacts);
  contactsArray.sort(compare);

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
    let firstNameOfUser = user.firstname;
    let lastNameOfUser = user.lastname;

    getTemplate(emailOfUser, firstNameOfUser, lastNameOfUser);
  }
}

function getTemplate(emailOfUser, firstNameOfUser, lastNameOfUser) {
  let alphabeticalOrderRef = document.getElementById("alphabeticalOrderA");

  alphabeticalOrderRef.innerHTML += `<div class="order">
              <span>A</span>
            </div>
            <div class="seperator"></div>
            <div class="contactInfo">
              <div class="circleFirstLetters">
                <span>${firstNameOfUser.charAt(0)}</span>
                <span>${lastNameOfUser.charAt(0)}</span>
              </div>
              <div class="maininfoAboutContact">
                <span class="name">${firstNameOfUser} ${lastNameOfUser}</span>
                <span class="email">${emailOfUser}</span>
              </div>
            </div>
          </div>`;
}

function compare(firstUser, nextUser) {
  if (firstUser.firstname.toLowerCase() < nextUser.firstname.toLowerCase()){
    return -1;
  } else if (firstUser.firstname.toLowerCase() > nextUser.firstname.toLowerCase()){
    return 1;
  } else {
    return 0;
  }
}
