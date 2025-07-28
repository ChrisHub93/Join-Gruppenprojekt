let currentActiveContactId = null;

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
  const refs = getRefs();
  const values = getSanitizedValues(refs);
  
  if (isAllEmptyOrInvalid(values, refs)) return;

  const error = getFirstValidationError(values, refs);
  if (error) return;

  const { firstName, lastName } = splitAndCapitalizeName(values.name);

  await postData(`/contacts/`, {
    id: getId(),
    email: values.email,
    firstname: firstName,
    lastname: lastName,
    phone: values.phone,
  });

  getListOfCreatedContact(firstName, lastName, refs.email, refs.phone);
  closeOverlayAfterCreatedContact(event);
  moreDetailsAboutContact(values.email, firstName, lastName, values.phone);
  clearInputFields(refs.name, refs.email, refs.phone);
  resetErrorStatus(
    [refs.name, refs.email, refs.phone],
    [refs.errorName, refs.errorEmail, refs.errorPhone]
  );
  showSuccess();
}

function getRefs() {
  return {
    name: document.getElementById("name"),
    email: document.getElementById("email"),
    phone: document.getElementById("phone"),
    errorName: document.getElementById("requiredNameField"),
    errorEmail: document.getElementById("requiredEmailField"),
    errorPhone: document.getElementById("requiredPhoneField"),
  };
}

function getSanitizedValues(refs) {
  return {
    name: refs.name.value.trim().replace(/\s+/g, " "),
    email: refs.email.value.trim().replace(/\s+/g, ""),
    phone: refs.phone.value.trim().replace(/\s+/g, ""),
  };
}

function isAllEmptyOrInvalid(values, refs) {
  const namePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ]+( [A-Za-zÀ-ÖØ-öø-ÿ]+)+$/;
  if (!namePattern.test(values.name) && values.email === "" && values.phone === "") {
    addError(refs.name, refs.email, refs.phone);
    removeOpacity(refs.errorName, refs.errorEmail, refs.errorPhone);
    return true;
  }
  return false;
}

function getFirstValidationError(values, refs) {
  const patterns = {
    name: /^[A-Za-zÀ-ÖØ-öø-ÿ]+( [A-Za-zÀ-ÖØ-öø-ÿ]+)+$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[\d +()-]{6,}$/,
  };

  const fields = [
    { key: "name", pattern: patterns.name, ref: refs.name, label: refs.errorName },
    { key: "email", pattern: patterns.email, ref: refs.email, label: refs.errorEmail },
    { key: "phone", pattern: patterns.phone, ref: refs.phone, label: refs.errorPhone },
  ];

  for (let { key, pattern, ref, label } of fields) {
    if (!pattern.test(values[key])) {
      ref.classList.add("error");
      label.classList.remove("opacity");
      return true;
    }
  }
  return false;
}

function splitAndCapitalizeName(name) {
  const [firstRaw, lastRaw] = name.split(" ");
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  return {
    firstName: capitalize(firstRaw),
    lastName: capitalize(lastRaw),
  };
}

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