let currentActiveContactId = null;

window.addEventListener("resize", function (event) {
  let contactsRef = document.getElementById("contacts");
  let addPersonRef = document.getElementById("addPerson");
  let chooseEditOrDeleteMobileRef = document.getElementById("chooseEditOrDeleteMobile");
  let successfullyCreatedMobileRef = document.getElementById("successfullyCreatedMobile");
  let chooseOverlayForMobileRef = document.getElementById("chooseOverlayForMobile");
  if (window.innerWidth > 1100) {
    // contactsRef.classList.remove("d-nonevip");
    // addPersonRef.classList.add("d-nonevip");
    // chooseEditOrDeleteMobileRef.classList.add("d-nonevip");
    // successfullyCreatedMobileRef.classList.add("opacity");
    // chooseOverlayForMobileRef.classList.remove("showChooseOverlay");
    // chooseOverlayForMobileRef.classList.add("hideChooseOverlay");
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
    // let successfullyCreatedMobileRef = document.getElementById("successfullyCreatedMobile");
    // successfullyCreatedMobileRef.classList.add("opacity");
    // let chooseOverlayForMobileRef = document.getElementById("chooseOverlayForMobile");
    // chooseOverlayForMobileRef.classList.remove("showChooseOverlay");
    // chooseOverlayForMobileRef.classList.add("hideChooseOverlay");
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
  // if (currentActiveContactId === newContactId) {
  //   sameContact();
  // } else if (
  //   currentActiveContactId &&
  //   currentActiveContactId !== newContactId
  // ) {
  //   clickedOnNewContact(newContactId,firstNameOfUser,lastNameOfUser,emailOfUser,phoneOfUser);
  // } else {
  //   selectContact(newContactId,firstNameOfUser,lastNameOfUser,emailOfUser,phoneOfUser);
  // }
  if (window.innerWidth <= 1100) {
    showMobileVersion();
    let addPersonRef = document.getElementById("addPerson");
    let chooseEditOrDeleteMobileRef = document.getElementById("chooseEditOrDeleteMobile");
    addPersonRef.classList.remove("d-nonevip");
    chooseEditOrDeleteMobileRef.classList.remove("d-nonevip");
  }
  checkPhoneOfUser(phoneOfUser);
  // if (phoneOfUser === "undefined") {
  //   let phoneOverlayRef = document.getElementById("phoneOverlay");
  //   phoneOverlayRef.classList.add("d-nonevip");
  // } else if (phoneOfUser.value !== undefined) {
  //   let phoneOverlayRef = document.getElementById("phoneOverlay");
  //   phoneOverlayRef.classList.remove("d-nonevip");
  // }
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
  // if (window.innerWidth <= 1100) {
  //   contentOverlayRef.classList.add("hideContentOverlayMobile");
  //   contentOverlayRef.classList.remove("showContentOverlay");
  // } else if (window.innerWidth > 1100) {
  //   contentOverlayRef.classList.remove("showContentOverlay");
  //   contentOverlayRef.classList.add("hideContentOverlay");
  // }
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
  // if (window.innerWidth <= 1100) {
  //   contentOverlayRef.classList.add("hideContentOverlayMobile");
  //   contentOverlayRef.classList.remove("showContentOverlay");
  // } else if (window.innerWidth > 1100) {
  //   contentOverlayRef.classList.add("hideContentOverlay");
  //   contentOverlayRef.classList.remove("showContentOverlay");
  // }
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
  // let nameRef = document.getElementById("name");
  // let emailRef = document.getElementById("email");
  // let phoneRef = document.getElementById("phone");
  removeInputFieldsValues();
  // nameRef.value = "";
  // emailRef.value = "";
  // phoneRef.value = "";
  // nameRef.classList.remove("error");
  // emailRef.classList.remove("error");
  // phoneRef.classList.remove("error");
  // let requiredNameFieldRef = document.getElementById("requiredNameField");
  // let requiredEmailFieldRef = document.getElementById("requiredEmailField");
  // let requiredPhoneFieldRef = document.getElementById("requiredPhoneField");
  addOpacityToRequiredFields();
  // requiredNameFieldRef.classList.add("opacity");
  // requiredEmailFieldRef.classList.add("opacity");
  // requiredPhoneFieldRef.classList.add("opacity");
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
  // nameRef.value = "";
  // emailRef.value = "";
  // phoneRef.value = "";
  let overlayRef = document.getElementById("overlay");
  let contentOverlayRef = document.getElementById("contentOverlay");
  switchContentOverlayClasses(overlayRef, contentOverlayRef);
  // contentOverlayRef.classList.add("hideContentOverlay");
  // contentOverlayRef.classList.remove("showContentOverlay");
  // overlayRef.classList.remove("overlayBg");
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

// function resetErrorStatus(inputs, warnings) {
//   inputs.forEach((input) => input.classList.remove("error"));
//   warnings.forEach((warn) => warn.classList.add("opacity"));
// }

// function getId() {
//   return self.crypto.randomUUID();
// }

// function showSuccess() {
//   let successfullyCreatedRef = document.getElementById("successfullyCreated");
//   successfullyCreatedRef.style.display = "flex";
//   setTimeout(() => {
//     successfullyCreatedRef.classList.add("showSuccess");
//     successfullyCreatedRef.classList.remove("hideSuccess");
//   }, 500);
//   setTimeout(() => {
//     successfullyCreatedRef.classList.remove("showSuccess");
//     successfullyCreatedRef.classList.add("hideSuccess");
//   }, 2000);
//   setTimeout(() => {
//     successfullyCreatedRef.style.display = "none";
//   }, 2500);
// }

// function clearInputFields(nameRef, emailRef, phoneRef) {
//   nameRef.value = "";
//   emailRef.value = "";
//   phoneRef.value = "";
// }

// function closeOverlayAfterCreatedContact(event) {
//   event.stopPropagation(event);
//   let overlayRef = document.getElementById("overlay");
//   let contentOverlayRef = document.getElementById("contentOverlay");
//   contentOverlayRef.classList.remove("showContentOverlay");
//   contentOverlayRef.classList.add("d-nonevip");
//   overlayRef.classList.remove("overlayBg");
//   setTimeout(() => {
//     overlayRef.classList.toggle("d-nonevip");
//   }, 150);
//   contentOverlayRef.classList.add("hideContentOverlay");
// }

// async function postData(path, data = {}) {
//   let response = await fetch(BASE_URL + path + ".json", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });
//   return (responseToJson = await response.json());
// }

// function getListOfCreatedContact(
//   firstNameOfUser,
//   lastNameOfUser,
//   emailRef,
//   phoneRef
// ) {
//   let alphabeticalOrderRef = document.getElementById(
//     "alphabeticalOrder" + firstNameOfUser.charAt(0).toUpperCase()
//   );
//   alphabeticalOrderRef.innerHTML += getBasicInfoAboutContact(
//     emailRef.value,
//     firstNameOfUser,
//     lastNameOfUser,
//     phoneRef.value
//   );
//   getSortTitle(firstNameOfUser);
//   randomBackgroundColor(firstNameOfUser, lastNameOfUser);
// }

// async function openEditOverlay(event) {
//   event.stopPropagation(event);
//   let contacts = await fetchData("/contacts/");
//   let contactsArray = Object.values(contacts);
//   let user = contactsArray.find(
//     (currentUser) =>
//       currentUser.firstname + " " + currentUser.lastname ==
//       currentActiveContactId
//   );
//   toggleEditOverlay();
//   inputFieldsGetValuesOfContact(user);
//   profileGetCorrectBackground(user);
// }

// function toggleEditOverlay() {
//   let overlayRef = document.getElementById("editOverlay");
//   let contentOverlayRef = document.getElementById("contentEditOverlay");
//   let overlayIsHidden = overlayRef.classList.contains("d-nonevip");
//   if (overlayIsHidden) {
//     document.body.style.overflow = "hidden";
//   } else {
//     document.body.style.overflow = "";
//   }
//   contentOverlayRef.classList.remove("hideContentOverlayMobile");
//   if (window.innerWidth <= 1100) {
//     contentOverlayRef.classList.add("hideContentOverlayMobile");
//     contentOverlayRef.classList.remove("showContentOverlay");
//   } else if (window.innerWidth > 1100) {
//     contentOverlayRef.classList.remove("showContentOverlay");
//     contentOverlayRef.classList.add("hideContentOverlay");
//   }
//   overlayRef.classList.toggle("d-nonevip");
//   contentOverlayRef.classList.remove("d-nonevip");
//   setTimeout(() => {
//     contentOverlayRef.classList.remove("hideContentOverlay");
//     contentOverlayRef.classList.add("showContentOverlay");
//     overlayRef.classList.add("overlayBg");
//   }, 10);
// }

// function closeEditOverlay(event) {
//   event.stopPropagation(event);
//   let overlayRef = document.getElementById("editOverlay");
//   let contentOverlayRef = document.getElementById("contentEditOverlay");
//   contentOverlayRef.classList.remove("hideContentOverlayMobile");
//   if (window.innerWidth <= 1100) {
//     contentOverlayRef.classList.add("hideContentOverlayMobile");
//     contentOverlayRef.classList.remove("showContentOverlay");
//   } else if (window.innerWidth > 1100) {
//     contentOverlayRef.classList.add("hideContentOverlay");
//     contentOverlayRef.classList.remove("showContentOverlay");
//   }
//   overlayRef.classList.remove("overlayBg");
//   setTimeout(() => {
//     overlayRef.classList.toggle("d-nonevip");
//   }, 150);
//   let inputNameRef = document.getElementById("nameEdit");
//   let inputEmailRef = document.getElementById("emailEdit");
//   let inputPhoneRef = document.getElementById("phoneEdit");
//   let requiredNameEditFieldRef = document.getElementById(
//     "requiredNameEditField"
//   );
//   let requiredEmailEditFieldRef = document.getElementById(
//     "requiredEmailEditField"
//   );
//   let requiredPhoneEditFieldRef = document.getElementById(
//     "requiredPhoneEditField"
//   );
//   removeEditError(inputNameRef, inputEmailRef, inputPhoneRef);
//   addEditOpacity(
//     requiredNameEditFieldRef,
//     requiredEmailEditFieldRef,
//     requiredPhoneEditFieldRef
//   );
// }

// function inputFieldsGetValuesOfContact(user) {
//   let inputNameRef = document.getElementById("nameEdit");
//   let inputEmailRef = document.getElementById("emailEdit");
//   let inputPhoneRef = document.getElementById("phoneEdit");
//   inputNameRef.value = user.firstname + " " + user.lastname;
//   inputEmailRef.value = user.email;
//   inputPhoneRef.value = user.phone;
//   if (inputPhoneRef.value === "undefined") {
//     inputPhoneRef.value = "";
//   }
// }

// function profileGetCorrectBackground(user) {
//   let firstLetterOfFirstNameRef = document.getElementById(
//     "firstLetterOfFirstName"
//   );
//   let firstLetterOfLastNameRef = document.getElementById(
//     "fistLetterOfLastName"
//   );
//   firstLetterOfFirstNameRef.innerText = user.firstname.charAt(0).toUpperCase();
//   firstLetterOfLastNameRef.innerText = user.lastname.charAt(0).toUpperCase();
//   let targetDivRef = document.getElementById("moreAboutcircleFirstLetters");
//   let bgClassRef = Array.from(targetDivRef.classList);
//   let circleFirstLettersRef = document.getElementById("circleFirstLetters");
//   circleFirstLettersRef.classList.add(bgClassRef[1]);
// }

// function addEditError(inputNameRef, inputEmailRef, inputPhoneRef) {
//   inputNameRef.classList.add("error");
//   inputEmailRef.classList.add("error");
//   inputPhoneRef.classList.add("error");
// }

// function removeEditError(inputNameRef, inputEmailRef, inputPhoneRef) {
//   inputNameRef.classList.remove("error");
//   inputEmailRef.classList.remove("error");
//   inputPhoneRef.classList.remove("error");
// }

// function addEditOpacity(
//   requiredNameEditFieldRef,
//   requiredEmailEditFieldRef,
//   requiredPhoneEditFieldRef
// ) {
//   requiredNameEditFieldRef.classList.add("opacity");
//   requiredEmailEditFieldRef.classList.add("opacity");
//   requiredPhoneEditFieldRef.classList.add("opacity");
// }

// function removeEditOpacity(
//   requiredNameEditFieldRef,
//   requiredEmailEditFieldRef,
//   requiredPhoneEditFieldRef
// ) {
//   requiredNameEditFieldRef.classList.remove("opacity");
//   requiredEmailEditFieldRef.classList.remove("opacity");
//   requiredPhoneEditFieldRef.classList.remove("opacity");
// }

// async function saveEditedContact(event) {
//   let contacts = await fetchData("/contacts/");
//   let keys = Object.keys(contacts);
//   let contactsArry = Object.values(contacts);
//   let inputNameRef = document.getElementById("nameEdit");
//   let inputEmailRef = document.getElementById("emailEdit");
//   let inputPhoneRef = document.getElementById("phoneEdit");
//   let fullName = inputNameRef.value.split(" ");
//   let requiredNameEditFieldRef = document.getElementById(
//     "requiredNameEditField"
//   );
//   let requiredEmailEditFieldRef = document.getElementById(
//     "requiredEmailEditField"
//   );
//   let requiredPhoneEditFieldRef = document.getElementById(
//     "requiredPhoneEditField"
//   );
//   if (
//     fullName.length <= 1 &&
//     inputEmailRef.value == "" &&
//     inputPhoneRef.value == ""
//   ) {
//     addEditError(inputNameRef, inputEmailRef, inputPhoneRef);
//     removeEditOpacity(
//       requiredNameEditFieldRef,
//       requiredEmailEditFieldRef,
//       requiredPhoneEditFieldRef
//     );
//     return;
//   } else if (fullName.length <= 1 || fullName[1] == "") {
//     inputNameRef.classList.add("error");
//     requiredNameEditFieldRef.classList.remove("opacity");
//     return;
//   } else if (inputEmailRef.value == "") {
//     inputEmailRef.classList.add("error");
//     requiredEmailEditFieldRef.classList.remove("opacity");
//     return;
//   } else if (inputPhoneRef.value == "") {
//     inputPhoneRef.classList.add("error");
//     requiredPhoneEditFieldRef.classList.remove("opacity");
//     return;
//   }
//   let firstName = fullName[0];
//   let lastName = fullName[1];
//   for (let index = 0; index < contactsArry.length; index++) {
//     let contact = contactsArry[index];
//     let fullContactName = contact.firstname + " " + contact.lastname;
//     if (fullContactName == currentActiveContactId) {
//       saveContact(
//         event,
//         contact,
//         index,
//         keys,
//         inputEmailRef,
//         inputPhoneRef,
//         firstName,
//         lastName,
//         contact.id
//       );
//     }
//   }
// }

// async function saveContact(
//   event,
//   contact,
//   index,
//   keys,
//   inputEmailRef,
//   inputPhoneRef,
//   firstName,
//   lastName,
//   id
// ) {
//   let key = keys[index];
//   await putData(`contacts/${key}`, {
//     firstname: firstName,
//     lastname: lastName,
//     email: inputEmailRef.value,
//     phone: inputPhoneRef.value,
//     id: id,
//   });
//   currentActiveContactId = firstName + " " + lastName;
//   closeOverlayAfterEditedContact(event);
//   let targetId = document.getElementById(
//     "circleFirstLetters" + contact.firstname + contact.lastname
//   );
//   let divRef = Array.from(targetId.classList);
//   removeOldContactInfo(contact);
//   getNewContactInfo(
//     divRef,
//     firstName,
//     lastName,
//     inputEmailRef.value,
//     inputPhoneRef.value
//   );
//   getSortTitle(firstName);
//   showMoreDetails(
//     divRef,
//     firstName,
//     lastName,
//     inputEmailRef.value,
//     inputPhoneRef.value
//   );
//   clearOrLetOrder(contact);
// }

// function removeOldContactInfo(contact) {
//   let targetSetNewBgForRef = document.getElementById(
//     "allMainInfoAbout" + contact.firstname + contact.lastname
//   );
//   targetSetNewBgForRef.remove();
// }

// function getNewContactInfo(
//   divRef,
//   firstName,
//   lastName,
//   inputEmailRef,
//   inputPhoneRef
// ) {
//   let alphabeticalOrderRef = document.getElementById(
//     "alphabeticalOrder" + firstName.charAt(0).toUpperCase()
//   );
//   alphabeticalOrderRef.innerHTML += getEditedBasicInfoAboutContact(
//     divRef,
//     firstName,
//     lastName,
//     inputEmailRef,
//     inputPhoneRef
//   );
// }

// function showMoreDetails(
//   divRef,
//   firstName,
//   lastName,
//   inputEmailRef,
//   inputPhoneRef
// ) {
//   let allInfoAboutContactRef = document.getElementById("allInfoAboutContact");
//   allInfoAboutContactRef.innerHTML = "";
//   allInfoAboutContactRef.innerHTML = getDetailsOfContact(
//     divRef,
//     firstName,
//     lastName,
//     inputEmailRef,
//     inputPhoneRef
//   );
//   let setNewBgForContactRef = document.getElementById(
//     "setNewBgFor" + firstName + lastName
//   );
//   setNewBgForContactRef.classList.add("darkBtn");
// }

// function clearOrLetOrder(contact) {
//   let mainDiv = document.getElementById(
//     "alphabeticalOrder" + contact.firstname.charAt(0).toUpperCase()
//   );
//   if (mainDiv) {
//     let hasChildDiv = mainDiv.querySelectorAll('[id^="allMainInfoAbout"]');
//     if (hasChildDiv.length === 0) {
//       mainDiv.innerHTML = "";
//     } else {
//       return;
//     }
//   }
// }

// async function putData(path = "", data = {}) {
//   let response = await fetch(BASE_URL + path + ".json", {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });
//   return (responseToJson = await response.json());
// }

// function closeOverlayAfterEditedContact(event) {
//   event.stopPropagation(event);
//   let overlayRef = document.getElementById("editOverlay");
//   let contentOverlayRef = document.getElementById("contentEditOverlay");
//   contentOverlayRef.classList.remove("showContentOverlay");
//   contentOverlayRef.classList.add("d-nonevip");
//   overlayRef.classList.remove("overlayBg");
//   setTimeout(() => {
//     overlayRef.classList.toggle("d-nonevip");
//   }, 150);
//   contentOverlayRef.classList.add("hideContentOverlay");
// }

// async function deleteUser() {
//   let contacts = await fetchData("/contacts/");
//   let keys = Object.keys(contacts);
//   let contactsArry = Object.values(contacts);
//   for (let index = 0; index < contactsArry.length; index++) {
//     let contact = contactsArry[index];
//     let fullContactName = contact.firstname + " " + contact.lastname;
//     if (fullContactName == currentActiveContactId) {
//       deleteContact(keys, index, contact);
//     }
//   }
//   if (window.innerWidth <= 1100) {
//     closeMobileOverlay();
//   }
// }

// async function deleteContact(keys, index, contact) {
//   let key = keys[index];
//   removeInfos(contact);
//   clearOrLetOrder(contact);
//   await deleteData(`contacts/${key}`);
// }

// function removeInfos(contact) {
//   let allInfoAboutContactRef = document.getElementById("allInfoAboutContact");
//   allInfoAboutContactRef.classList.remove("showAllInfoAboutContact");
//   currentActiveContactId = null;
//   let setNewBgForRef = document.getElementById(
//     "allMainInfoAbout" + contact.firstname + contact.lastname
//   );
//   setNewBgForRef.remove();
// }

// async function deleteData(path = "") {
//   let response = await fetch(BASE_URL + path + ".json", {
//     method: "DELETE",
//   });
//   return (responseToJson = await response.json());
// }

// async function deleteUserInOverlay(event) {
//   let contacts = await fetchData("/contacts/");
//   let keys = Object.keys(contacts);
//   let contactsArry = Object.values(contacts);
//   let inputNameRef = document.getElementById("nameEdit");
//   let inputEmailRef = document.getElementById("emailEdit");
//   let inputPhoneRef = document.getElementById("phoneEdit");
//   let requiredNameEditFieldRef = document.getElementById(
//     "requiredNameEditField"
//   );
//   let requiredEmailEditFieldRef = document.getElementById(
//     "requiredEmailEditField"
//   );
//   let requiredPhoneEditFieldRef = document.getElementById(
//     "requiredPhoneEditField"
//   );
//   for (let index = 0; index < contactsArry.length; index++) {
//     let contact = contactsArry[index];
//     let fullContactName = contact.firstname + " " + contact.lastname;
//     if (fullContactName == currentActiveContactId) {
//       deleteContact(keys, index, contact);
//       closeOverlayAfterEditedContact(event);
//       removeEditError(inputNameRef, inputEmailRef, inputPhoneRef);
//       addEditOpacity(
//         requiredNameEditFieldRef,
//         requiredEmailEditFieldRef,
//         requiredPhoneEditFieldRef
//       );
//     }
//   }
// }

// function checkEmptyName() {
//   let nameRef = document.getElementById("name");
//   let fullName = nameRef.value.split(" ");
//   let requiredNameFieldRef = document.getElementById("requiredNameField");
//   if (fullName.length <= 1 || fullName[1] == "") {
//     nameRef.classList.add("error");
//     requiredNameFieldRef.classList.remove("opacity");
//   } else {
//     nameRef.classList.remove("error");
//     requiredNameFieldRef.classList.add("opacity");
//   }
// }

// function checkEmptyEmail() {
//   let emailRef = document.getElementById("email");
//   let requiredEmailFieldRef = document.getElementById("requiredEmailField");
//   let email = emailRef.value.trim();
//   let emailValidation = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
//   if (!email || !emailValidation.test(email)) {
//     emailRef.classList.add("error");
//     requiredEmailFieldRef.classList.remove("opacity");
//   } else {
//     emailRef.classList.remove("error");
//     requiredEmailFieldRef.classList.add("opacity");
//   }
// }

// function checkEmptyPhone() {
//   let phoneRef = document.getElementById("phone");
//   let requiredPhoneFieldRef = document.getElementById("requiredPhoneField");
//   let phoneNumber = phoneRef.value.trim();
//   let phoneValidation = /^\d+$/;
//   if (!phoneNumber || !phoneValidation.test(phone)) {
//     phoneRef.classList.add("error");
//     requiredPhoneFieldRef.classList.remove("opacity");
//   } else {
//     phoneRef.classList.remove("error");
//     requiredPhoneFieldRef.classList.add("opacity");
//   }
// }

// function checkEmptyEditedName() {
//   let nameEditRef = document.getElementById("nameEdit");
//   let fullName = nameEditRef.value.split(" ");
//   let requiredNameEditFieldRef = document.getElementById(
//     "requiredNameEditField"
//   );
//   if (fullName.length <= 1 || fullName[1] == "") {
//     nameEditRef.classList.add("error");
//     requiredNameEditFieldRef.classList.remove("opacity");
//   } else {
//     nameEditRef.classList.remove("error");
//     requiredNameEditFieldRef.classList.add("opacity");
//   }
// }

// function checkEmptyEditedEmail() {
//   let emailEditRef = document.getElementById("emailEdit");
//   let requiredEmailEditFieldRef = document.getElementById(
//     "requiredEmailEditField"
//   );
//   if (!emailEditRef.value) {
//     emailEditRef.classList.add("error");
//     requiredEmailEditFieldRef.classList.remove("opacity");
//   } else {
//     emailEditRef.classList.remove("error");
//     requiredEmailEditFieldRef.classList.add("opacity");
//   }
// }

// function checkEmptyEditedPhone() {
//   let phoneEditRef = document.getElementById("phoneEdit");
//   let requiredPhoneEditFieldRef = document.getElementById(
//     "requiredPhoneEditField"
//   );
//   if (!phoneEditRef.value) {
//     phoneEditRef.classList.add("error");
//     requiredPhoneEditFieldRef.classList.remove("opacity");
//   } else {
//     phoneEditRef.classList.remove("error");
//     requiredPhoneEditFieldRef.classList.add("opacity");
//   }
// }

// function closeMobileOverlay() {
//   sameContact();
//   let contactsRef = document.getElementById("contacts");
//   let infoTitleRef = document.getElementById("infoTitle");
//   contactsRef.classList.remove("d-nonevip");
//   infoTitleRef.classList.remove("d-Block");
//   let chooseEditOrDeleteMobileRef = document.getElementById(
//     "chooseEditOrDeleteMobile"
//   );
//   chooseEditOrDeleteMobileRef.classList.add("d-nonevip");
//   let chooseOverlayForMobileRef = document.getElementById(
//     "chooseOverlayForMobile"
//   );
//   chooseOverlayForMobileRef.classList.remove("showChooseOverlay");
//   let addPersonRef = document.getElementById("addPerson");
//   addPersonRef.classList.remove("d-nonevip");
// }

// function closeOverlayMobile(event) {
//   event.stopPropagation(event);
//   let overlayRef = document.getElementById("overlay");
//   let contentOverlayRef = document.getElementById("contentOverlay");
//   contentOverlayRef.classList.add("hideContentOverlayMobile");
//   contentOverlayRef.classList.remove("showContentOverlayMobile");
//   overlayRef.classList.remove("overlayBg");
//   setTimeout(() => {
//     overlayRef.classList.toggle("d-nonevip");
//   }, 150);
//   setInputToDefault();
// }

// function openChooseOverlay() {
//   let chooseOverlayForMobileRef = document.getElementById(
//     "chooseOverlayForMobile"
//   );
//   chooseOverlayForMobileRef.style.display = "flex";
//   setTimeout(() => {
//     chooseOverlayForMobileRef.classList.add("showChooseOverlay");
//     chooseOverlayForMobileRef.classList.remove("hideChooseOverlay");
//   }, 30);
// }

// function stopPropagationForMobile(event) {
//   event.stopPropagation(event);
//   let chooseOverlayForMobileRef = document.getElementById(
//     "chooseOverlayForMobile"
//   );
//   chooseOverlayForMobileRef.classList.remove("showChooseOverlay");
//   chooseOverlayForMobileRef.classList.add("hideChooseOverlay");

//   setTimeout(() => {
//     chooseOverlayForMobileRef.style.display = "none";
//   }, 50);
// }