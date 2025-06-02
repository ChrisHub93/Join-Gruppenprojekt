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

function compare(firstUser, nextUser) {
  if (firstUser.firstname.toUpperCase() < nextUser.firstname.toUpperCase()) {
    return -1;
  } else if (
    firstUser.firstname.toUpperCase() > nextUser.firstname.toUpperCase()
  ) {
    return 1;
  } else {
    return 0;
  }
}

function getListOfContacts(contactsArray) {
  for (user of contactsArray) {
    let emailOfUser = user.email;
    let firstNameOfUser = user.firstname;
    let lastNameOfUser = user.lastname;
    let phoneOfUser = user.phone;

    getTemplate(emailOfUser, firstNameOfUser, lastNameOfUser, phoneOfUser);
  }
}

function getTemplate(emailOfUser, firstNameOfUser, lastNameOfUser, phoneOfUser) {
  let alphabeticalOrderRef = document.getElementById("alphabeticalOrder" + firstNameOfUser.charAt(0).toUpperCase());
  alphabeticalOrderRef.innerHTML += `<div id="order${firstNameOfUser.charAt(0).toUpperCase()}"></div>
            <div id="setNewBgFor${firstNameOfUser}" class="contactInfo" onclick="moreDetailsAboutContact('${emailOfUser}', '${firstNameOfUser}', '${lastNameOfUser}', '${phoneOfUser}')">
              <div id="circleFirstLetters${firstNameOfUser}" class="circleFirstLetters">
                <span>${firstNameOfUser.charAt(0)}</span>
                <span>${lastNameOfUser.charAt(0)}</span>
              </div>
              <div class="maininfoAboutContact">
                <span class="name">${firstNameOfUser} ${lastNameOfUser}</span>
                <span class="email">${emailOfUser}</span>
              </div>
            </div>
          </div>`;

  getSortTitle(firstNameOfUser);
  randomNumber(firstNameOfUser);
}

function getSortTitle(firstNameOfUser) {
  let orderRef = document.getElementById("order" + firstNameOfUser.charAt(0).toUpperCase());
  orderRef.innerHTML = ` <div class="paddingTop">  
                          <span>${firstNameOfUser.charAt(0).toUpperCase()}</span>
                          </div>
                          <div class="seperator"></div>`;
}

function randomNumber(firstNameOfUser) {
  let numberForClass = Math.floor(Math.random() * 8) + 1;
  let circleFirstLettersRef = document.getElementById("circleFirstLetters" + firstNameOfUser);
  circleFirstLettersRef.classList.add("bgForCircleFirstLetters" + numberForClass);
}







let currentActiveContactId = null;

function moreDetailsAboutContact( emailOfUser, firstNameOfUser, lastNameOfUser, phoneOfUser){

  let newContactId = firstNameOfUser +' '+ lastNameOfUser; 

  if (currentActiveContactId === newContactId){

    let idRef = document.querySelectorAll('[id^="setNewBgFor"]');
      for (const element of idRef) {
        element.classList.remove("darkBtn");
      }

      let allInfoAboutContactRef = document.getElementById("allInfoAboutContact");
      allInfoAboutContactRef.classList.remove("showAllInfoAboutContact");

      currentActiveContactId = null;

    // detailedContactView = true;

  } else if ( !newContactId){
      // detailedContactView = false;
      
      
  }

  else {

    currentActiveContactId = newContactId;

    let setNewBgForContactRef = document.getElementById("setNewBgFor"+firstNameOfUser);
  setNewBgForContactRef.classList.add("darkBtn");

  let allInfoAboutContactRef = document.getElementById("allInfoAboutContact");
  allInfoAboutContactRef.classList.add("showAllInfoAboutContact");

  let targetDivRef = document.getElementById("circleFirstLetters"+firstNameOfUser);
  let divRef = Array.from(targetDivRef.classList);

  allInfoAboutContactRef.innerHTML = `<div class="moreAboutcontactInfo">
            <div class="moreAboutcircleFirstLetters ${divRef[1]}">
              <span>${firstNameOfUser.charAt(0)}</span>
              <span>${lastNameOfUser.charAt(0)}</span>
            </div>

            <div class="editinfoAboutContact">
              <h2>${firstNameOfUser} ${lastNameOfUser}</h2>
              <div class="editOrDeleteFlex">
                <div class="edit editOrDeleteFlex">
                  <img src="/assets/icons/Property 1=edit.png" alt="" />
                  <span>Edit</span>
                </div>

                <div class="delete editOrDeleteFlex">
                  <img src="/assets/icons/Property 1=delete.png" alt="" />
                  <span>Delete</span>
                </div>
              </div>
            </div>
          </div>

          <div class="contactInformation">
            <span>Contact Information</span>
          </div>

          <div class="emailOverlay">
            <span class="subTitleEmail">Email</span>
            <span class="email">${emailOfUser}</span>
          </div>

          <div class="phoneOverlay">
            <span class="subTitlePhoneOverlay">Phone</span>
            <span>${phoneOfUser}</span>
          </div>`;
  }
      console.log("Aktiv", currentActiveContactId);
      
      
    // console.log(detailedContactView);
    
}