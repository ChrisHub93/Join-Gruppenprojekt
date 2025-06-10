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
    randomBackgroundColor(firstNameOfUser, lastNameOfUser);
  }
}

function getSortTitle(firstNameOfUser) {
  let orderRef = document.getElementById("order" + firstNameOfUser.charAt(0).toUpperCase());
  orderRef.innerHTML = getSortTitleTemplate(firstNameOfUser);
}

function randomBackgroundColor(firstNameOfUser, lastNameOfUser) {
  let numberForClass = Math.floor(Math.random() * 8) + 1;
  let circleFirstLettersRef = document.getElementById("circleFirstLetters" + firstNameOfUser + lastNameOfUser);
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
      let setNewBgForContactRef = document.getElementById("setNewBgFor"+firstNameOfUser+lastNameOfUser);
      setNewBgForContactRef.classList.add("darkBtn");
      let allInfoAboutContactRef = document.getElementById("allInfoAboutContact");
      let targetDivRef = document.getElementById("circleFirstLetters"+firstNameOfUser+lastNameOfUser);
      let divRef = Array.from(targetDivRef.classList);
      allInfoAboutContactRef.innerHTML = getDetailsOfContact(divRef, firstNameOfUser, lastNameOfUser, emailOfUser, phoneOfUser);
      currentActiveContactId = newContactId;
}

function selectContact(newContactId, firstNameOfUser, lastNameOfUser, emailOfUser, phoneOfUser){
    currentActiveContactId = newContactId;
    let setNewBgForContactRef = document.getElementById("setNewBgFor"+firstNameOfUser+lastNameOfUser);
    setNewBgForContactRef.classList.add("darkBtn");
    let allInfoAboutContactRef = document.getElementById("allInfoAboutContact");
    allInfoAboutContactRef.classList.add("showAllInfoAboutContact");
    let targetDivRef = document.getElementById("circleFirstLetters"+firstNameOfUser+lastNameOfUser);
    let divRef = Array.from(targetDivRef.classList);
    allInfoAboutContactRef.innerHTML = getDetailsOfContact(divRef, firstNameOfUser, lastNameOfUser, emailOfUser, phoneOfUser);
}

function openOverlay(){
  let overlayRef = document.getElementById("overlay");
  let contentOverlayRef = document.getElementById("contentOverlay");
  overlayRef.classList.toggle("d-nonevip"); 
  contentOverlayRef.classList.remove("d-nonevip");
  setTimeout(()=>{
    contentOverlayRef.classList.remove("hideContentOverlay");
    contentOverlayRef.classList.add("showContentOverlay");
    overlayRef.classList.add("overlayBg");
  }, 10);

}

function closeOverlay(event){
  event.stopPropagation(event);
  let overlayRef = document.getElementById("overlay");
  let contentOverlayRef = document.getElementById("contentOverlay");
  contentOverlayRef.classList.add("hideContentOverlay");
  contentOverlayRef.classList.remove("showContentOverlay");
  overlayRef.classList.remove("overlayBg");
  setTimeout(()=>{
    overlayRef.classList.toggle("d-nonevip"); 
  }, 150);
}

function cancelOverlay(event){

  let nameRef = document.getElementById("name");
  let emailRef = document.getElementById("email");
  let phoneRef = document.getElementById("phone");
  
  nameRef.value = '';
  emailRef.value = '';
  phoneRef.value = '';

  event.stopPropagation(event);
  let overlayRef = document.getElementById("overlay");
  let contentOverlayRef = document.getElementById("contentOverlay");
  contentOverlayRef.classList.add("hideContentOverlay");
  contentOverlayRef.classList.remove("showContentOverlay");
  overlayRef.classList.remove("overlayBg");
  setTimeout(()=>{
    overlayRef.classList.toggle("d-nonevip"); 
  }, 150);
}

function stopPropagation(event){
  event.stopPropagation(event);
}

async function createContact(event){
  let nameRef = document.getElementById("name");
  let emailRef = document.getElementById("email");
  let phoneRef = document.getElementById("phone");

  let fullName = nameRef.value.split(" ");
  let firstNameOfUser = fullName[0].charAt(0).toUpperCase(0) + fullName[0].slice(1);
  let lastNameOfUser = fullName[1].charAt(0).toUpperCase(0) + fullName[1].slice(1);

  await postData("/contacts/", {email: emailRef.value, firstname: firstNameOfUser, lastname: lastNameOfUser, phone: phoneRef.value});

  getListOfCreatedContact(firstNameOfUser, lastNameOfUser, emailRef, phoneRef);
  nameRef.value ='';
  emailRef.value ='';
  phoneRef.value = '';
  closeOverlayAfterCreatedContact(event);
}


function closeOverlayAfterCreatedContact(event){
  event.stopPropagation(event);
  let overlayRef = document.getElementById("overlay");
  let contentOverlayRef = document.getElementById("contentOverlay");
  contentOverlayRef.classList.remove("showContentOverlay");
  contentOverlayRef.classList.add("d-nonevip");
  overlayRef.classList.remove("overlayBg");
  setTimeout(()=>{
    overlayRef.classList.toggle("d-nonevip"); 
  }, 150);
  contentOverlayRef.classList.add("hideContentOverlay");
}

async function postData(path, data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responseToJson = await response.json());
}

function getListOfCreatedContact(firstNameOfUser, lastNameOfUser, emailRef, phoneRef) {
  let alphabeticalOrderRef = document.getElementById("alphabeticalOrder" + firstNameOfUser.charAt(0).toUpperCase());
  alphabeticalOrderRef.innerHTML += getBasicInfoAboutContact(emailRef.value, firstNameOfUser, lastNameOfUser, phoneRef.value);
  getSortTitle(firstNameOfUser);
  randomBackgroundColor(firstNameOfUser, lastNameOfUser);  
}