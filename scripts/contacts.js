let currentActiveContactId = null;

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
    let alphabeticalOrderRef = document.getElementById("alphabeticalOrder" + firstNameOfUser.charAt(0).toUpperCase());
    alphabeticalOrderRef.innerHTML += getBasicInfoAboutContact(emailOfUser, firstNameOfUser, lastNameOfUser, phoneOfUser);
    getSortTitle(firstNameOfUser);
    randomBackgroundColor(firstNameOfUser);
  }
}

function getSortTitle(firstNameOfUser) {
  let orderRef = document.getElementById("order" + firstNameOfUser.charAt(0).toUpperCase());
  orderRef.innerHTML = getSortTitleTemplate(firstNameOfUser);
}

function randomBackgroundColor(firstNameOfUser) {
  let numberForClass = Math.floor(Math.random() * 8) + 1;
  let circleFirstLettersRef = document.getElementById("circleFirstLetters" + firstNameOfUser);
  circleFirstLettersRef.classList.add("bgForCircleFirstLetters" + numberForClass);
}

function moreDetailsAboutContact( emailOfUser, firstNameOfUser, lastNameOfUser, phoneOfUser){
  let newContactId = firstNameOfUser +' '+ lastNameOfUser; 
  if (currentActiveContactId === newContactId){
      sameContact();
  } else if ( currentActiveContactId && currentActiveContactId !== newContactId){
      clickedOnNewContact(newContactId, firstNameOfUser, lastNameOfUser, emailOfUser, phoneOfUser);
  } else {
      selectContact(newContactId, firstNameOfUser, lastNameOfUser, emailOfUser, phoneOfUser);
  } 
}

function sameContact(){
let idRef = document.querySelectorAll('[id^="setNewBgFor"]');
      for (let cssElement of idRef) {
        cssElement.classList.remove("darkBtn");
      }
      let allInfoAboutContactRef = document.getElementById("allInfoAboutContact");
      allInfoAboutContactRef.classList.remove("showAllInfoAboutContact");
      currentActiveContactId = null;
}

function clickedOnNewContact(newContactId, firstNameOfUser, lastNameOfUser, emailOfUser, phoneOfUser){
  let idRef = document.querySelectorAll('[id^="setNewBgFor"]');
      for (const element of idRef) {
        element.classList.remove("darkBtn");
      }
      let setNewBgForContactRef = document.getElementById("setNewBgFor"+firstNameOfUser);
      setNewBgForContactRef.classList.add("darkBtn");
      let allInfoAboutContactRef = document.getElementById("allInfoAboutContact");
      let targetDivRef = document.getElementById("circleFirstLetters"+firstNameOfUser);
      let divRef = Array.from(targetDivRef.classList);
      allInfoAboutContactRef.innerHTML = getDetailsOfContact(divRef, firstNameOfUser, lastNameOfUser, emailOfUser, phoneOfUser);
      currentActiveContactId = newContactId;
}

function selectContact(newContactId, firstNameOfUser, lastNameOfUser, emailOfUser, phoneOfUser){
    currentActiveContactId = newContactId;
    let setNewBgForContactRef = document.getElementById("setNewBgFor"+firstNameOfUser);
    setNewBgForContactRef.classList.add("darkBtn");
    let allInfoAboutContactRef = document.getElementById("allInfoAboutContact");
    allInfoAboutContactRef.classList.add("showAllInfoAboutContact");
    let targetDivRef = document.getElementById("circleFirstLetters"+firstNameOfUser);
    let divRef = Array.from(targetDivRef.classList);
    allInfoAboutContactRef.innerHTML = getDetailsOfContact(divRef, firstNameOfUser, lastNameOfUser, emailOfUser, phoneOfUser);
}