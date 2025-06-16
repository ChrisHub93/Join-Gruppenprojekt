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
    let alphabeticalOrderRef = document.getElementById(
      "alphabeticalOrder" + firstNameOfUser.charAt(0).toUpperCase()
    );
    alphabeticalOrderRef.innerHTML += getBasicInfoAboutContact(
      emailOfUser,
      firstNameOfUser,
      lastNameOfUser,
      phoneOfUser
    );
    getSortTitle(firstNameOfUser);
    randomBackgroundColor(firstNameOfUser, lastNameOfUser);
  }
}

function getSortTitle(firstNameOfUser) {
  let orderRef = document.getElementById(
    "order" + firstNameOfUser.charAt(0).toUpperCase()
  );
  orderRef.innerHTML = getSortTitleTemplate(firstNameOfUser);
}

function randomBackgroundColor(firstNameOfUser, lastNameOfUser) {
  let numberForClass = Math.floor(Math.random() * 8) + 1;
  let circleFirstLettersRef = document.getElementById(
    "circleFirstLetters" + firstNameOfUser + lastNameOfUser
  );
  circleFirstLettersRef.classList.add(
    "bgForCircleFirstLetters" + numberForClass
  );
}

function moreDetailsAboutContact(
  emailOfUser,
  firstNameOfUser,
  lastNameOfUser,
  phoneOfUser
) {
  let newContactId = firstNameOfUser + " " + lastNameOfUser;
  if (currentActiveContactId === newContactId) {
    sameContact();
  } else if (
    currentActiveContactId &&
    currentActiveContactId !== newContactId
  ) {
    clickedOnNewContact(
      newContactId,
      firstNameOfUser,
      lastNameOfUser,
      emailOfUser,
      phoneOfUser
    );
  } else {
    selectContact(
      newContactId,
      firstNameOfUser,
      lastNameOfUser,
      emailOfUser,
      phoneOfUser
    );
  }
}

function sameContact() {
  let idRef = document.querySelectorAll('[id^="setNewBgFor"]');
  for (let cssElement of idRef) {
    cssElement.classList.remove("darkBtn");
  }
  let allInfoAboutContactRef = document.getElementById("allInfoAboutContact");
  allInfoAboutContactRef.classList.remove("showAllInfoAboutContact");
  currentActiveContactId = null;
}

function clickedOnNewContact(
  newContactId,
  firstNameOfUser,
  lastNameOfUser,
  emailOfUser,
  phoneOfUser
) {
  let idRef = document.querySelectorAll('[id^="setNewBgFor"]');
  for (const element of idRef) {
    element.classList.remove("darkBtn");
  }
  let setNewBgForContactRef = document.getElementById(
    "setNewBgFor" + firstNameOfUser + lastNameOfUser
  );
  setNewBgForContactRef.classList.add("darkBtn");
  let allInfoAboutContactRef = document.getElementById("allInfoAboutContact");
  let targetDivRef = document.getElementById(
    "circleFirstLetters" + firstNameOfUser + lastNameOfUser
  );
  let divRef = Array.from(targetDivRef.classList);
  allInfoAboutContactRef.innerHTML = getDetailsOfContact(
    divRef,
    firstNameOfUser,
    lastNameOfUser,
    emailOfUser,
    phoneOfUser
  );
  currentActiveContactId = newContactId;
}

function selectContact(
  newContactId,
  firstNameOfUser,
  lastNameOfUser,
  emailOfUser,
  phoneOfUser
) {
  currentActiveContactId = newContactId;
  let setNewBgForContactRef = document.getElementById(
    "setNewBgFor" + firstNameOfUser + lastNameOfUser
  );
  setNewBgForContactRef.classList.add("darkBtn");
  let allInfoAboutContactRef = document.getElementById("allInfoAboutContact");
  allInfoAboutContactRef.classList.add("showAllInfoAboutContact");
  let targetDivRef = document.getElementById(
    "circleFirstLetters" + firstNameOfUser + lastNameOfUser
  );
  let divRef = Array.from(targetDivRef.classList);
  allInfoAboutContactRef.innerHTML = getDetailsOfContact(
    divRef,
    firstNameOfUser,
    lastNameOfUser,
    emailOfUser,
    phoneOfUser
  );
}

function openOverlay() {
  let overlayRef = document.getElementById("overlay");
  let contentOverlayRef = document.getElementById("contentOverlay");
  overlayRef.classList.toggle("d-nonevip");
  contentOverlayRef.classList.remove("d-nonevip");
  setTimeout(() => {
    contentOverlayRef.classList.remove("hideContentOverlay");
    contentOverlayRef.classList.add("showContentOverlay");
    overlayRef.classList.add("overlayBg");
  }, 10);
}

function closeOverlay(event) {
  event.stopPropagation(event);
  let overlayRef = document.getElementById("overlay");
  let contentOverlayRef = document.getElementById("contentOverlay");
  contentOverlayRef.classList.add("hideContentOverlay");
  contentOverlayRef.classList.remove("showContentOverlay");
  overlayRef.classList.remove("overlayBg");
  setTimeout(() => {
    overlayRef.classList.toggle("d-nonevip");
  }, 150);
}

function cancelOverlay(event) {
  let nameRef = document.getElementById("name");
  let emailRef = document.getElementById("email");
  let phoneRef = document.getElementById("phone");

  nameRef.value = "";
  emailRef.value = "";
  phoneRef.value = "";

  event.stopPropagation(event);
  let overlayRef = document.getElementById("overlay");
  let contentOverlayRef = document.getElementById("contentOverlay");
  contentOverlayRef.classList.add("hideContentOverlay");
  contentOverlayRef.classList.remove("showContentOverlay");
  overlayRef.classList.remove("overlayBg");
  setTimeout(() => {
    overlayRef.classList.toggle("d-nonevip");
  }, 150);
}

function stopPropagation(event) {
  event.stopPropagation(event);
}

async function createContact(event) {
  let nameRef = document.getElementById("name");
  let emailRef = document.getElementById("email");
  let phoneRef = document.getElementById("phone");
  let fullName = nameRef.value.split(" ");
  let firstNameOfUser =
    fullName[0].charAt(0).toUpperCase(0) + fullName[0].slice(1);
  let lastNameOfUser =
    fullName[1].charAt(0).toUpperCase(0) + fullName[1].slice(1);
  await postData(`/contacts/`, {
    email: emailRef.value,
    firstname: firstNameOfUser,
    lastname: lastNameOfUser,
    phone: phoneRef.value,
  });
  getListOfCreatedContact(firstNameOfUser, lastNameOfUser, emailRef, phoneRef);
  closeOverlayAfterCreatedContact(event);
  moreDetailsAboutContact(
    emailRef.value,
    firstNameOfUser,
    lastNameOfUser,
    phoneRef.value
  );
  clearInputFields(nameRef, emailRef, phoneRef);
  showSuccess();
}

function showSuccess() {
  let successfullyCreatedRef = document.getElementById("successfullyCreated");
  setTimeout(() => {
    successfullyCreatedRef.classList.add("showSuccess");
  }, 500);
  setTimeout(() => {
    successfullyCreatedRef.classList.add("hideSuccess");
  }, 2000);
  successfullyCreatedRef.classList.remove("showSuccess");
  successfullyCreatedRef.classList.remove("hideSuccess");
}

function clearInputFields(nameRef, emailRef, phoneRef) {
  nameRef.value = "";
  emailRef.value = "";
  phoneRef.value = "";
}

function closeOverlayAfterCreatedContact(event) {
  event.stopPropagation(event);
  let overlayRef = document.getElementById("overlay");
  let contentOverlayRef = document.getElementById("contentOverlay");
  contentOverlayRef.classList.remove("showContentOverlay");
  contentOverlayRef.classList.add("d-nonevip");
  overlayRef.classList.remove("overlayBg");
  setTimeout(() => {
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

function getListOfCreatedContact(
  firstNameOfUser,
  lastNameOfUser,
  emailRef,
  phoneRef
) {
  let alphabeticalOrderRef = document.getElementById(
    "alphabeticalOrder" + firstNameOfUser.charAt(0).toUpperCase()
  );
  alphabeticalOrderRef.innerHTML += getBasicInfoAboutContact(
    emailRef.value,
    firstNameOfUser,
    lastNameOfUser,
    phoneRef.value
  );
  getSortTitle(firstNameOfUser);
  randomBackgroundColor(firstNameOfUser, lastNameOfUser);
}

async function openEditOverlay(event) {
  event.stopPropagation(event);
  let contacts = await fetchData("/contacts/");
  let contactsArray = Object.values(contacts);
  let user = contactsArray.find(
    (currentUser) =>
      currentUser.firstname + " " + currentUser.lastname ==
      currentActiveContactId
  );
  toggleEditOverlay();
  inputFieldsGetValuesOfContact(user);
  profileGetCorrectBackground(user);
}

function toggleEditOverlay() {
  let overlayRef = document.getElementById("editOverlay");
  let contentOverlayRef = document.getElementById("contentEditOverlay");
  overlayRef.classList.toggle("d-nonevip");
  contentOverlayRef.classList.remove("d-nonevip");
  setTimeout(() => {
    contentOverlayRef.classList.remove("hideContentOverlay");
    contentOverlayRef.classList.add("showContentOverlay");
    overlayRef.classList.add("overlayBg");
  }, 10);
}

function closeEditOverlay(event) {
  event.stopPropagation(event);
  let overlayRef = document.getElementById("editOverlay");
  let contentOverlayRef = document.getElementById("contentEditOverlay");
  contentOverlayRef.classList.add("hideContentOverlay");
  contentOverlayRef.classList.remove("showContentOverlay");
  overlayRef.classList.remove("overlayBg");
  setTimeout(() => {
    overlayRef.classList.toggle("d-nonevip");
  }, 150);
}

function inputFieldsGetValuesOfContact(user) {
  let inputNameRef = document.getElementById("nameEdit");
  let inputEmailRef = document.getElementById("emailEdit");
  let inputPhoneRef = document.getElementById("phoneEdit");
  inputNameRef.value = user.firstname + " " + user.lastname;
  inputEmailRef.value = user.email;
  inputPhoneRef.value = user.phone;
}

function profileGetCorrectBackground(user) {
  let firstLetterOfFirstNameRef = document.getElementById(
    "firstLetterOfFirstName"
  );
  let firstLetterOfLastNameRef = document.getElementById(
    "fistLetterOfLastName"
  );
  firstLetterOfFirstNameRef.innerText = user.firstname.charAt(0).toUpperCase();
  firstLetterOfLastNameRef.innerText = user.lastname.charAt(0).toUpperCase();

  let targetDivRef = document.getElementById("moreAboutcircleFirstLetters");
  let bgClassRef = Array.from(targetDivRef.classList);
  let circleFirstLettersRef = document.getElementById("circleFirstLetters");
  circleFirstLettersRef.classList.add(bgClassRef[1]);
}

async function saveEditedContact(event) {
  let contacts = await fetchData("/contacts/");
  let keys = Object.keys(contacts);
  let contactsArry = Object.values(contacts);
  let inputNameRef = document.getElementById("nameEdit");
  let inputEmailRef = document.getElementById("emailEdit");
  let inputPhoneRef = document.getElementById("phoneEdit");
  let fullName = inputNameRef.value.split(" ");
  let firstName = fullName[0];
  let lastName = fullName[1];
  for (let index = 0; index < contactsArry.length; index++) {
    let contact = contactsArry[index];
    let fullContactName = contact.firstname + " " + contact.lastname;
    if (fullContactName == currentActiveContactId) {
      saveContact(event, contact, index, keys, inputEmailRef, inputPhoneRef, firstName, lastName);
    }
  }
}

 async function saveContact(event, contact, index, keys, inputEmailRef, inputPhoneRef, firstName, lastName ){
      let key = keys[index];
      await putData(`contacts/${key}`, {firstname: firstName, lastname: lastName, email: inputEmailRef.value, phone: inputPhoneRef.value,});
      currentActiveContactId = firstName + " " + lastName;
      closeOverlayAfterEditedContact(event);
      let targetId = document.getElementById("circleFirstLetters" + contact.firstname + contact.lastname);
      let divRef = Array.from(targetId.classList);
      removeOldContactInfo(contact);
      getNewContactInfo(divRef, firstName, lastName, inputEmailRef.value, inputPhoneRef.value);
      getSortTitle(firstName);
      showMoreDetails(divRef, firstName, lastName, inputEmailRef.value, inputPhoneRef.value);
      clearOrLetOrder(contact);
}

function removeOldContactInfo(contact){
  let targetSetNewBgForRef = document.getElementById("allMainInfoAbout" + contact.firstname + contact.lastname);
  targetSetNewBgForRef.remove();
}

function getNewContactInfo(divRef, firstName, lastName, inputEmailRef, inputPhoneRef){
      let alphabeticalOrderRef = document.getElementById("alphabeticalOrder" + firstName.charAt(0).toUpperCase());
      alphabeticalOrderRef.innerHTML = getEditedBasicInfoAboutContact(divRef, firstName, lastName, inputEmailRef, inputPhoneRef);
}

function showMoreDetails(divRef, firstName, lastName, inputEmailRef, inputPhoneRef){
  let allInfoAboutContactRef = document.getElementById("allInfoAboutContact");
  allInfoAboutContactRef.innerHTML = "";
  allInfoAboutContactRef.innerHTML = getDetailsOfContact(divRef, firstName, lastName, inputEmailRef, inputPhoneRef);
  let setNewBgForContactRef = document.getElementById("setNewBgFor" + firstName + lastName);
  setNewBgForContactRef.classList.add("darkBtn");
}

function clearOrLetOrder(contact){
  let mainDiv = document.getElementById("alphabeticalOrder" + contact.firstname.charAt(0).toUpperCase());
      if (mainDiv) {
        let hasChildDiv = mainDiv.querySelectorAll('[id^="allMainInfoAbout"]');
        if (hasChildDiv.length === 0) {
          mainDiv.innerHTML = "";
        } else {
          return;
        }
      }
}

async function putData(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responseToJson = await response.json());
}

function closeOverlayAfterEditedContact(event) {
  event.stopPropagation(event);
  let overlayRef = document.getElementById("editOverlay");
  let contentOverlayRef = document.getElementById("contentEditOverlay");
  contentOverlayRef.classList.remove("showContentOverlay");
  contentOverlayRef.classList.add("d-nonevip");
  overlayRef.classList.remove("overlayBg");
  setTimeout(() => {
    overlayRef.classList.toggle("d-nonevip");
  }, 150);
  contentOverlayRef.classList.add("hideContentOverlay");
}

async function deleteUser(){
  let contacts = await fetchData("/contacts/");
  let keys = Object.keys(contacts);
  let contactsArry = Object.values(contacts);
  for (let index = 0; index < contactsArry.length; index++) {
    let contact = contactsArry[index];
    let fullContactName = contact.firstname + " " + contact.lastname;
    if (fullContactName == currentActiveContactId) {
      deleteContact(keys, index, contact); 
    }
  }
}

async function deleteContact(keys, index, contact){
  let key = keys[index];
  removeInfos(contact);
  clearOrLetOrder(contact);
  await deleteData(`contacts/${key}`);
}

function removeInfos(contact){
  let allInfoAboutContactRef = document.getElementById("allInfoAboutContact");
      allInfoAboutContactRef.classList.remove("showAllInfoAboutContact");
      currentActiveContactId = null;
      let setNewBgForRef = document.getElementById("allMainInfoAbout" + contact.firstname + contact.lastname);
      setNewBgForRef.remove();
}

async function deleteData(path="") {
    let response = await fetch(BASE_URL + path + ".json",{
        method:"DELETE",
    });
    return responseToJson = await response.json();
}

async function deleteUserInOverlay(event){
  let contacts = await fetchData("/contacts/");
  let keys = Object.keys(contacts);
  let contactsArry = Object.values(contacts);
  for (let index = 0; index < contactsArry.length; index++) {
    let contact = contactsArry[index];
    let fullContactName = contact.firstname + " " + contact.lastname;
    if (fullContactName == currentActiveContactId) {
      deleteContact(keys, index, contact);
      closeOverlayAfterEditedContact(event);
    }
  }
}