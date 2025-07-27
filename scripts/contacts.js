let currentActiveContactId = null;

window.addEventListener("resize", function (event) {
  let contactsRef = document.getElementById("contacts");
  let addPersonRef = document.getElementById("addPerson");
  let chooseEditOrDeleteMobileRef = document.getElementById("chooseEditOrDeleteMobile");
  let successfullyCreatedMobileRef = document.getElementById("successfullyCreatedMobile");
  let chooseOverlayForMobileRef = document.getElementById("chooseOverlayForMobile");
  if (window.innerWidth > 1100) {
    switchClassesViewPoint(contactsRef, addPersonRef, chooseEditOrDeleteMobileRef, successfullyCreatedMobileRef, chooseOverlayForMobileRef);
  } else if (currentActiveContactId && window.innerWidth <= 1100) {
    contactsRef.classList.add("d-nonevip");
    chooseEditOrDeleteMobileRef.classList.remove("d-nonevip");
  } else if (window.innerWidth <= 1100) {
    addPersonRef.classList.remove("d-nonevip");
  }
});

function switchClassesViewPoint(contactsRef, addPersonRef, chooseEditOrDeleteMobileRef, successfullyCreatedMobileRef, chooseOverlayForMobileRef){
  contactsRef.classList.remove("d-nonevip");
    addPersonRef.classList.add("d-nonevip");
    chooseEditOrDeleteMobileRef.classList.add("d-nonevip");
    successfullyCreatedMobileRef.classList.add("opacity");
    chooseOverlayForMobileRef.classList.remove("showChooseOverlay");
    chooseOverlayForMobileRef.classList.add("hideChooseOverlay");
}

async function initContacts() {
  let contacts = await fetchData("/contacts/");
  let contactsArray = Object.values(contacts);
  contactsArray.sort(compare);
  getListOfContacts(contactsArray);
  if (window.innerWidth <= 1100) {
    let addPersonRef = document.getElementById("addPerson");
    addPersonRef.classList.remove("d-nonevip");
    let successfullyCreatedMobileRef = document.getElementById("successfullyCreatedMobile");
    successfullyCreatedMobileRef.classList.remove("opacity");
  } else if (window.innerWidth > 1100) {
    getClassesForOverlayDesktop();
  }
}

function getClassesForOverlayDesktop(){
  let successfullyCreatedMobileRef = document.getElementById("successfullyCreatedMobile");
  successfullyCreatedMobileRef.classList.add("opacity");
  let chooseOverlayForMobileRef = document.getElementById("chooseOverlayForMobile");
  chooseOverlayForMobileRef.classList.remove("showChooseOverlay");
  chooseOverlayForMobileRef.classList.add("hideChooseOverlay");
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
    alphabeticalOrderRef.innerHTML += getBasicInfoAboutContact(emailOfUser,firstNameOfUser,lastNameOfUser,phoneOfUser);
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

function currentUser(newContactId,firstNameOfUser,lastNameOfUser,emailOfUser,phoneOfUser ){
  if (currentActiveContactId === newContactId) {
    sameContact();
  } else if (
    currentActiveContactId &&
    currentActiveContactId !== newContactId
  ) {
    clickedOnNewContact(newContactId,firstNameOfUser,lastNameOfUser,emailOfUser,phoneOfUser);
  } else {
    selectContact(newContactId,firstNameOfUser,lastNameOfUser,emailOfUser,phoneOfUser);
  }
}

function checkPhoneOfUser(phoneOfUser){
  if (phoneOfUser === "undefined") {
    let phoneOverlayRef = document.getElementById("phoneOverlay");
    phoneOverlayRef.classList.add("d-nonevip");
  } else if (phoneOfUser.value !== undefined) {
    let phoneOverlayRef = document.getElementById("phoneOverlay");
    phoneOverlayRef.classList.remove("d-nonevip");
  }
}

function moreDetailsAboutContact(emailOfUser,firstNameOfUser,lastNameOfUser,phoneOfUser) {
  let newContactId = firstNameOfUser + " " + lastNameOfUser;
  currentUser(newContactId,firstNameOfUser,lastNameOfUser,emailOfUser,phoneOfUser );
  if (window.innerWidth <= 1100) {
    showMobileVersion();
    let addPersonRef = document.getElementById("addPerson");
    let chooseEditOrDeleteMobileRef = document.getElementById("chooseEditOrDeleteMobile");
    addPersonRef.classList.remove("d-nonevip");
    chooseEditOrDeleteMobileRef.classList.remove("d-nonevip");
  }
  checkPhoneOfUser(phoneOfUser);
}

function showMobileVersion() {
  let contactsRef = document.getElementById("contacts");
  let infoTitleRef = document.getElementById("infoTitle");
  contactsRef.classList.add("d-nonevip");
  infoTitleRef.classList.add("d-Block");
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

function clickedOnNewContact(newContactId,firstNameOfUser,lastNameOfUser,emailOfUser,phoneOfUser) {
  let idRef = document.querySelectorAll('[id^="setNewBgFor"]');
  for (const element of idRef) {
    element.classList.remove("darkBtn");
  }
  let setNewBgForContactRef = document.getElementById("setNewBgFor" + firstNameOfUser + lastNameOfUser);
  setNewBgForContactRef.classList.add("darkBtn");
  let allInfoAboutContactRef = document.getElementById("allInfoAboutContact");
  let targetDivRef = document.getElementById("circleFirstLetters" + firstNameOfUser + lastNameOfUser);
  let divRef = Array.from(targetDivRef.classList);
  allInfoAboutContactRef.innerHTML = getDetailsOfContact(divRef,firstNameOfUser,lastNameOfUser,emailOfUser,phoneOfUser);
  currentActiveContactId = newContactId;
}

function selectContact(newContactId,firstNameOfUser,lastNameOfUser,emailOfUser,phoneOfUser) {
  currentActiveContactId = newContactId;
  let setNewBgForContactRef = document.getElementById("setNewBgFor" + firstNameOfUser + lastNameOfUser);
  setNewBgForContactRef.classList.add("darkBtn");
  let allInfoAboutContactRef = document.getElementById("allInfoAboutContact");
  allInfoAboutContactRef.classList.add("showAllInfoAboutContact");
  let targetDivRef = document.getElementById("circleFirstLetters" + firstNameOfUser + lastNameOfUser);
  let divRef = Array.from(targetDivRef.classList);
  allInfoAboutContactRef.innerHTML = getDetailsOfContact(divRef,firstNameOfUser,lastNameOfUser,emailOfUser,phoneOfUser);
}

function openOverlay() {
  let overlayRef = document.getElementById("overlay");
  let contentOverlayRef = document.getElementById("contentOverlay");
  contentOverlayRef.classList.remove("hideContentOverlayMobile");
  checkWindowWidth(contentOverlayRef);
  overlayRef.classList.toggle("d-nonevip");
  contentOverlayRef.classList.remove("d-nonevip");
  setTimeout(() => {
    contentOverlayRef.classList.remove("hideContentOverlay");
    contentOverlayRef.classList.add("showContentOverlay");
    overlayRef.classList.add("overlayBg");
  }, 10);
}

function checkWindowWidth(contentOverlayRef){
  if (window.innerWidth <= 1100) {
    contentOverlayRef.classList.add("hideContentOverlayMobile");
    contentOverlayRef.classList.remove("showContentOverlay");
  } else if (window.innerWidth > 1100) {
    contentOverlayRef.classList.remove("showContentOverlay");
    contentOverlayRef.classList.add("hideContentOverlay");
  }
}

function closeOverlay(event) {
  event.stopPropagation(event);
  let overlayRef = document.getElementById("overlay");
  let contentOverlayRef = document.getElementById("contentOverlay");
  contentOverlayRef.classList.remove("hideContentOverlayMobile");
  checkWindowWidth(contentOverlayRef);
  overlayRef.classList.remove("overlayBg");
  setTimeout(() => {
    overlayRef.classList.toggle("d-nonevip");
  }, 150);
  setInputToDefault();
}

function removeInputFieldsValues(){
  let nameRef = document.getElementById("name");
  let emailRef = document.getElementById("email");
  let phoneRef = document.getElementById("phone");
  nameRef.value = "";
  emailRef.value = "";
  phoneRef.value = "";
  nameRef.classList.remove("error");
  emailRef.classList.remove("error");
  phoneRef.classList.remove("error");
}

function setInputToDefault() {
  removeInputFieldsValues();
  addOpacityToRequiredFields();
}

function addOpacityToRequiredFields(){
  let requiredNameFieldRef = document.getElementById("requiredNameField");
  let requiredEmailFieldRef = document.getElementById("requiredEmailField");
  let requiredPhoneFieldRef = document.getElementById("requiredPhoneField");
  requiredNameFieldRef.classList.add("opacity");
  requiredEmailFieldRef.classList.add("opacity");
  requiredPhoneFieldRef.classList.add("opacity");
}

function cancelOverlay(event) {
  event.stopPropagation(event);
  let nameRef = document.getElementById("name");
  let emailRef = document.getElementById("email");
  let phoneRef = document.getElementById("phone");
  clearInputFieldsOfOverlay(nameRef,emailRef, phoneRef);
  let overlayRef = document.getElementById("overlay");
  let contentOverlayRef = document.getElementById("contentOverlay");
  switchContentOverlayClasses(overlayRef, contentOverlayRef);
  setTimeout(() => {
    overlayRef.classList.toggle("d-nonevip");
  }, 150);
  removeError(nameRef, emailRef, phoneRef);
  addOpacity();
}

function clearInputFieldsOfOverlay(nameRef,emailRef, phoneRef){
  nameRef.value = "";
  emailRef.value = "";
  phoneRef.value = "";
}

function switchContentOverlayClasses(overlayRef, contentOverlayRef){
  contentOverlayRef.classList.add("hideContentOverlay");
  contentOverlayRef.classList.remove("showContentOverlay");
  overlayRef.classList.remove("overlayBg");
}

function stopPropagation(event) {
  event.stopPropagation(event);
}

function addError(nameRef, emailRef, phoneRef) {
  nameRef.classList.add("error");
  emailRef.classList.add("error");
  phoneRef.classList.add("error");
}

function removeError(nameRef, emailRef, phoneRef) {
  nameRef.classList.remove("error");
  emailRef.classList.remove("error");
  phoneRef.classList.remove("error");
}

function addOpacity() {
  let requiredNameFieldRef = document.getElementById("requiredNameField");
  let requiredEmailFieldRef = document.getElementById("requiredEmailField");
  let requiredPhoneFieldRef = document.getElementById("requiredPhoneField");
  requiredNameFieldRef.classList.add("opacity");
  requiredEmailFieldRef.classList.add("opacity");
  requiredPhoneFieldRef.classList.add("opacity");
}

function removeOpacity(requiredNameFieldRef,requiredEmailFieldRef,requiredPhoneFieldRef) {
  requiredNameFieldRef.classList.remove("opacity");
  requiredEmailFieldRef.classList.remove("opacity");
  requiredPhoneFieldRef.classList.remove("opacity");
}

async function createContact(event) {
  let nameRef = document.getElementById("name");
  let emailRef = document.getElementById("email");
  let phoneRef = document.getElementById("phone");
  let nameValue = nameRef.value.trim().replace(/\s+/g, " ");
  let emailValue = emailRef.value.trim().replace(/\s+/g, "");
  let phoneValue = phoneRef.value.trim().replace(/\s+/g, "");
  let namePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ]+( [A-Za-zÀ-ÖØ-öø-ÿ]+)+$/;
  let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let phonePattern = /^[\d +()-]{6,}$/;
  let requiredNameFieldRef = document.getElementById("requiredNameField");
  let requiredEmailFieldRef = document.getElementById("requiredEmailField");
  let requiredPhoneFieldRef = document.getElementById("requiredPhoneField");

  if (!namePattern.test(nameValue) && emailValue === "" && phoneValue === "") {
    addError(nameRef, emailRef, phoneRef);
    removeOpacity(requiredNameFieldRef,requiredEmailFieldRef,requiredPhoneFieldRef);
    return;
  } else if (!namePattern.test(nameValue)) {
    nameRef.classList.add("error");
    requiredNameFieldRef.classList.remove("opacity");
    return;
  } else if (!emailPattern.test(emailValue)) {
    emailRef.classList.add("error");
    requiredEmailFieldRef.classList.remove("opacity");
    return;
  } else if (!phonePattern.test(phoneValue)) {
    phoneRef.classList.add("error");
    requiredPhoneFieldRef.classList.remove("opacity");
    return;
  }

  let fullName = nameRef.value.split(" ");
  let firstNameOfUser = fullName[0].charAt(0).toUpperCase(0) + fullName[0].slice(1);
  let lastNameOfUser = fullName[1].charAt(0).toUpperCase(0) + fullName[1].slice(1);
  await postData(`/contacts/`, {id: getId(),email: emailRef.value,firstname: firstNameOfUser,lastname: lastNameOfUser,phone: phoneRef.value,});
  getListOfCreatedContact(firstNameOfUser, lastNameOfUser, emailRef, phoneRef);
  closeOverlayAfterCreatedContact(event);
  moreDetailsAboutContact(emailRef.value,firstNameOfUser,lastNameOfUser,phoneRef.value);
  clearInputFields(nameRef, emailRef, phoneRef);
  resetErrorStatus([nameRef, emailRef, phoneRef],[requiredNameFieldRef, requiredEmailFieldRef, requiredPhoneFieldRef]);
  showSuccess();
}