function resetErrorStatus(inputs, warnings) {
  inputs.forEach((input) => input.classList.remove("error"));
  warnings.forEach((warn) => warn.classList.add("opacity"));
}

function getId() {
  return self.crypto.randomUUID();
}

function showSuccess() {
  let successfullyCreatedRef = document.getElementById("successfullyCreated");
  successfullyCreatedRef.style.display = "flex";
  setTimeout(() => {
    successfullyCreatedRef.classList.add("showSuccess");
    successfullyCreatedRef.classList.remove("hideSuccess");
  }, 500);
  setTimeout(() => {
    successfullyCreatedRef.classList.remove("showSuccess");
    successfullyCreatedRef.classList.add("hideSuccess");
  }, 2000);
  setTimeout(() => {
    successfullyCreatedRef.style.display = "none";
  }, 2500);
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

function getListOfCreatedContact(firstNameOfUser,lastNameOfUser,emailRef,phoneRef) {
  let alphabeticalOrderRef = document.getElementById("alphabeticalOrder" + firstNameOfUser.charAt(0).toUpperCase());
  alphabeticalOrderRef.innerHTML += getBasicInfoAboutContact(emailRef.value,firstNameOfUser,lastNameOfUser,phoneRef.value);
  getSortTitle(firstNameOfUser);
  randomBackgroundColor(firstNameOfUser, lastNameOfUser);
}

async function openEditOverlay(event) {
  event.stopPropagation(event);
  let contacts = await fetchData("/contacts/");
  let contactsArray = Object.values(contacts);
  let user = contactsArray.find((currentUser) => currentUser.firstname + " " + currentUser.lastname == currentActiveContactId);
  toggleEditOverlay();
  inputFieldsGetValuesOfContact(user);
  profileGetCorrectBackground(user);
}

function toggleEditOverlay() {
  let overlayRef = document.getElementById("editOverlay");
  let contentOverlayRef = document.getElementById("contentEditOverlay");
  let overlayIsHidden = overlayRef.classList.contains("d-nonevip");
  if (overlayIsHidden) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
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

function closeEditOverlay(event) {
  event.stopPropagation(event);
  let overlayRef = document.getElementById("editOverlay");
  let contentOverlayRef = document.getElementById("contentEditOverlay");
  contentOverlayRef.classList.remove("hideContentOverlayMobile");
  checkWindowWidth(contentOverlayRef);
  overlayRef.classList.remove("overlayBg");
  setTimeout(() => {
    overlayRef.classList.toggle("d-nonevip");
  }, 150);
  let inputNameRef = document.getElementById("nameEdit");
  let inputEmailRef = document.getElementById("emailEdit");
  let inputPhoneRef = document.getElementById("phoneEdit");
  let requiredNameEditFieldRef = document.getElementById("requiredNameEditField");
  let requiredEmailEditFieldRef = document.getElementById("requiredEmailEditField");
  let requiredPhoneEditFieldRef = document.getElementById("requiredPhoneEditField");
  removeEditError(inputNameRef, inputEmailRef, inputPhoneRef);
  addEditOpacity(requiredNameEditFieldRef,requiredEmailEditFieldRef,requiredPhoneEditFieldRef);
}

function inputFieldsGetValuesOfContact(user) {
  let inputNameRef = document.getElementById("nameEdit");
  let inputEmailRef = document.getElementById("emailEdit");
  let inputPhoneRef = document.getElementById("phoneEdit");
  inputNameRef.value = user.firstname + " " + user.lastname;
  inputEmailRef.value = user.email;
  inputPhoneRef.value = user.phone;
  if (inputPhoneRef.value === "undefined") {
    inputPhoneRef.value = "";
  }
}

function profileGetCorrectBackground(user) {
  let firstLetterOfFirstNameRef = document.getElementById("firstLetterOfFirstName");
  let firstLetterOfLastNameRef = document.getElementById("fistLetterOfLastName");
  firstLetterOfFirstNameRef.innerText = user.firstname.charAt(0).toUpperCase();
  firstLetterOfLastNameRef.innerText = user.lastname.charAt(0).toUpperCase();
  let targetDivRef = document.getElementById("moreAboutcircleFirstLetters");
  let bgClassRef = Array.from(targetDivRef.classList);
  let circleFirstLettersRef = document.getElementById("circleFirstLetters");
  circleFirstLettersRef.classList.add(bgClassRef[1]);
}

function addEditError(inputNameRef, inputEmailRef, inputPhoneRef) {
  inputNameRef.classList.add("error");
  inputEmailRef.classList.add("error");
  inputPhoneRef.classList.add("error");
}

function removeEditError(inputNameRef, inputEmailRef, inputPhoneRef) {
  inputNameRef.classList.remove("error");
  inputEmailRef.classList.remove("error");
  inputPhoneRef.classList.remove("error");
}

function addEditOpacity(requiredNameEditFieldRef,requiredEmailEditFieldRef,requiredPhoneEditFieldRef) {
  requiredNameEditFieldRef.classList.add("opacity");
  requiredEmailEditFieldRef.classList.add("opacity");
  requiredPhoneEditFieldRef.classList.add("opacity");
}

function removeEditOpacity(requiredNameEditFieldRef,requiredEmailEditFieldRef,requiredPhoneEditFieldRef) {
  requiredNameEditFieldRef.classList.remove("opacity");
  requiredEmailEditFieldRef.classList.remove("opacity");
  requiredPhoneEditFieldRef.classList.remove("opacity");
}

async function saveEditedContact(event) {
  let contacts = await fetchData("/contacts/");
  let keys = Object.keys(contacts);
  let contactsArry = Object.values(contacts);
  let inputNameRef = document.getElementById("nameEdit");
  let inputEmailRef = document.getElementById("emailEdit");
  let inputPhoneRef = document.getElementById("phoneEdit");
  let fullName = inputNameRef.value.split(" ");
  let requiredNameEditFieldRef = document.getElementById("requiredNameEditField");
  let requiredEmailEditFieldRef = document.getElementById("requiredEmailEditField");
  let requiredPhoneEditFieldRef = document.getElementById("requiredPhoneEditField");
  if (fullName.length <= 1 &&inputEmailRef.value == "" &&inputPhoneRef.value == "") {
    addEditError(inputNameRef, inputEmailRef, inputPhoneRef);
    removeEditOpacity(requiredNameEditFieldRef,requiredEmailEditFieldRef,requiredPhoneEditFieldRef);
    return;
  } else if (fullName.length <= 1 || fullName[1] == "") {
    inputNameRef.classList.add("error");
    requiredNameEditFieldRef.classList.remove("opacity");
    return;
  } else if (inputEmailRef.value == "") {
    inputEmailRef.classList.add("error");
    requiredEmailEditFieldRef.classList.remove("opacity");
    return;
  } else if (inputPhoneRef.value == "") {
    inputPhoneRef.classList.add("error");
    requiredPhoneEditFieldRef.classList.remove("opacity");
    return;
  }
    renderSaveContact(fullName, contactsArry, event, keys, inputEmailRef,inputPhoneRef);
}

function renderSaveContact(fullName, contactsArry, event, keys, inputEmailRef,inputPhoneRef){
    let firstName = fullName[0];
    let lastName = fullName[1];
    for (let index = 0; index < contactsArry.length; index++) {
    let contact = contactsArry[index];
    let fullContactName = contact.firstname + " " + contact.lastname;
    if (fullContactName == currentActiveContactId) {
      saveContact(event,contact,index,keys,inputEmailRef,inputPhoneRef,firstName,lastName,contact.id);
        }
    }
}

async function saveContact(event,contact,index,keys,inputEmailRef,inputPhoneRef,firstName,lastName,id) {
  let key = keys[index];
  await putData(`contacts/${key}`, {firstname: firstName,lastname: lastName,email: inputEmailRef.value,phone: inputPhoneRef.value,id: id,});
  currentActiveContactId = firstName + " " + lastName;
  closeOverlayAfterEditedContact(event);
  let targetId = document.getElementById("circleFirstLetters" + contact.firstname + contact.lastname);
  let divRef = Array.from(targetId.classList);
  removeOldContactInfo(contact);
  getNewContactInfo(divRef,firstName,lastName,inputEmailRef.value,inputPhoneRef.value);
  getSortTitle(firstName);
  showMoreDetails(divRef,firstName,lastName,inputEmailRef.value,inputPhoneRef.value);
  clearOrLetOrder(contact);
}

function removeOldContactInfo(contact) {
  let targetSetNewBgForRef = document.getElementById("allMainInfoAbout" + contact.firstname + contact.lastname);
  targetSetNewBgForRef.remove();
}

function getNewContactInfo(divRef,firstName,lastName,inputEmailRef,inputPhoneRef) {
  let alphabeticalOrderRef = document.getElementById("alphabeticalOrder" + firstName.charAt(0).toUpperCase());
  alphabeticalOrderRef.innerHTML += getEditedBasicInfoAboutContact(divRef,firstName,lastName,inputEmailRef,inputPhoneRef);
}

function showMoreDetails(divRef,firstName,lastName,inputEmailRef,inputPhoneRef) {
  let allInfoAboutContactRef = document.getElementById("allInfoAboutContact");
  allInfoAboutContactRef.innerHTML = "";
  allInfoAboutContactRef.innerHTML = getDetailsOfContact(divRef,firstName,lastName,inputEmailRef,inputPhoneRef);
  let setNewBgForContactRef = document.getElementById("setNewBgFor" + firstName + lastName);
  setNewBgForContactRef.classList.add("darkBtn");
}

function clearOrLetOrder(contact) {
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

async function deleteUser() {
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
  if (window.innerWidth <= 1100) {
    closeMobileOverlay();
  }
}

async function deleteContact(keys, index, contact) {
  let key = keys[index];
  removeInfos(contact);
  clearOrLetOrder(contact);
  await deleteData(`contacts/${key}`);
}

function removeInfos(contact) {
  let allInfoAboutContactRef = document.getElementById("allInfoAboutContact");
  allInfoAboutContactRef.classList.remove("showAllInfoAboutContact");
  currentActiveContactId = null;
  let setNewBgForRef = document.getElementById("allMainInfoAbout" + contact.firstname + contact.lastname);
  setNewBgForRef.remove();
}

async function deleteData(path = "") {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "DELETE",
  });
  return (responseToJson = await response.json());
}

async function deleteUserInOverlay(event) {
  let contacts = await fetchData("/contacts/");
  let keys = Object.keys(contacts);
  let contactsArry = Object.values(contacts);
  let inputNameRef = document.getElementById("nameEdit");
  let inputEmailRef = document.getElementById("emailEdit");
  let inputPhoneRef = document.getElementById("phoneEdit");
  let requiredNameEditFieldRef = document.getElementById("requiredNameEditField");
  let requiredEmailEditFieldRef = document.getElementById("requiredEmailEditField");
  let requiredPhoneEditFieldRef = document.getElementById("requiredPhoneEditField");
  renderDeletedUser(contactsArry, keys, event, inputNameRef, inputEmailRef, inputPhoneRef, requiredNameEditFieldRef,requiredEmailEditFieldRef,requiredPhoneEditFieldRef);
}

function renderDeletedUser(contactsArry, keys, event, inputNameRef, inputEmailRef, inputPhoneRef, requiredNameEditFieldRef,requiredEmailEditFieldRef,requiredPhoneEditFieldRef){
    for (let index = 0; index < contactsArry.length; index++) {
    let contact = contactsArry[index];
    let fullContactName = contact.firstname + " " + contact.lastname;
    if (fullContactName == currentActiveContactId) {
      deleteContact(keys, index, contact);
      closeOverlayAfterEditedContact(event);
      removeEditError(inputNameRef, inputEmailRef, inputPhoneRef);
      addEditOpacity(requiredNameEditFieldRef,requiredEmailEditFieldRef,requiredPhoneEditFieldRef);
    }
  }
}

function checkEmptyName() {
  let nameRef = document.getElementById("name");
  let fullName = nameRef.value.split(" ");
  let requiredNameFieldRef = document.getElementById("requiredNameField");
  if (fullName.length <= 1 || fullName[1] == "") {
    nameRef.classList.add("error");
    requiredNameFieldRef.classList.remove("opacity");
  } else {
    nameRef.classList.remove("error");
    requiredNameFieldRef.classList.add("opacity");
  }
}

function checkEmptyEmail() {
  let emailRef = document.getElementById("email");
  let requiredEmailFieldRef = document.getElementById("requiredEmailField");
  let email = emailRef.value.trim();
  let emailValidation = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!email || !emailValidation.test(email)) {
    emailRef.classList.add("error");
    requiredEmailFieldRef.classList.remove("opacity");
  } else {
    emailRef.classList.remove("error");
    requiredEmailFieldRef.classList.add("opacity");
  }
}

function checkEmptyPhone() {
  let phoneRef = document.getElementById("phone");
  let requiredPhoneFieldRef = document.getElementById("requiredPhoneField");
  let phoneNumber = phoneRef.value.trim();
  let phoneValidation = /^\d+$/;
  if (!phoneNumber || !phoneValidation.test(phone)) {
    phoneRef.classList.add("error");
    requiredPhoneFieldRef.classList.remove("opacity");
  } else {
    phoneRef.classList.remove("error");
    requiredPhoneFieldRef.classList.add("opacity");
  }
}

function checkEmptyEditedName() {
  let nameEditRef = document.getElementById("nameEdit");
  let fullName = nameEditRef.value.split(" ");
  let requiredNameEditFieldRef = document.getElementById(
    "requiredNameEditField"
  );
  if (fullName.length <= 1 || fullName[1] == "") {
    nameEditRef.classList.add("error");
    requiredNameEditFieldRef.classList.remove("opacity");
  } else {
    nameEditRef.classList.remove("error");
    requiredNameEditFieldRef.classList.add("opacity");
  }
}