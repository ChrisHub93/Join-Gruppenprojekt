let currentActiveContactId = null;

/**
 * Initialize contacts by fetching, sorting, and rendering them.
 * Also adjusts UI elements based on window width.
 * 
 * @async
 * @returns {Promise<void>}
 */
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

/**
 * Fetch JSON data from the given path relative to BASE_URL.
 * 
 * @async
 * @param {string} path - The API path to fetch data from (without extension).
 * @returns {Promise<Object>} The parsed JSON response.
 */
async function fetchData(path) {
  let response = await fetch(BASE_URL + path + ".json");
  let responseAsJson = await response.json();
  return responseAsJson;
}

/**
 * Compare two user objects by their first names alphabetically (case-insensitive).
 * 
 * @param {{firstname: string}} firstUser 
 * @param {{firstname: string}} nextUser 
 * @returns {number} -1 if firstUser < nextUser, 1 if firstUser > nextUser, 0 if equal.
 */
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

/**
 * Render the list of contacts grouped alphabetically by first name.
 * 
 * @param {Array<Object>} contactsArray - Array of contact objects.
 */
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

/**
 * Render the alphabetical group title for a given first name.
 * 
 * @param {string} firstNameOfUser - First name of the contact.
 */

function getSortTitle(firstNameOfUser) {
  let orderRef = document.getElementById(
    "order" + firstNameOfUser.charAt(0).toUpperCase()
  );
  orderRef.innerHTML = getSortTitleTemplate(firstNameOfUser);
}

/**
 * Assign a random background color class to the contact's initials circle.
 * 
 * @param {string} firstNameOfUser 
 * @param {string} lastNameOfUser 
 */
function randomBackgroundColor(firstNameOfUser, lastNameOfUser) {
  let numberForClass = Math.floor(Math.random() * 8) + 1;
  let circleFirstLettersRef = document.getElementById(
    "circleFirstLetters" + firstNameOfUser + lastNameOfUser
  );
  circleFirstLettersRef.classList.add(
    "bgForCircleFirstLetters" + numberForClass
  );
}

/**
 * Handle the selection logic when a contact is clicked.
 * Calls appropriate functions depending on the current active contact state.
 * 
 * @param {string} newContactId - New contact ID in the format "FirstName LastName".
 * @param {string} firstNameOfUser
 * @param {string} lastNameOfUser
 * @param {string} emailOfUser
 * @param {string} phoneOfUser
 */
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

/**
 * Show or hide phone number overlay depending on phone number availability.
 * 
 * @param {string|undefined} phoneOfUser - Phone number string or undefined.
 */

function checkPhoneOfUser(phoneOfUser){
  if (phoneOfUser === "undefined") {
    let phoneOverlayRef = document.getElementById("phoneOverlay");
    phoneOverlayRef.classList.add("d-nonevip");
  } else if (phoneOfUser.value !== undefined) {
    let phoneOverlayRef = document.getElementById("phoneOverlay");
    phoneOverlayRef.classList.remove("d-nonevip");
  }
}

/**
 * Display more details about a contact and handle UI changes.
 * 
 * @param {string} emailOfUser
 * @param {string} firstNameOfUser
 * @param {string} lastNameOfUser
 * @param {string} phoneOfUser
 */
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


/**
 * Deselect the currently active contact and reset relevant UI states.
 */
function sameContact() {
  let idRef = document.querySelectorAll('[id^="setNewBgFor"]');
  for (let cssElement of idRef) {
    cssElement.classList.remove("darkBtn");
  }
  let allInfoAboutContactRef = document.getElementById("allInfoAboutContact");
  allInfoAboutContactRef.classList.remove("showAllInfoAboutContact");
  currentActiveContactId = null;
}

/**
 * Handle switching to a new contact by updating UI and contact details.
 * 
 * @param {string} newContactId
 * @param {string} firstNameOfUser
 * @param {string} lastNameOfUser
 * @param {string} emailOfUser
 * @param {string} phoneOfUser
 */
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

/**
 * Select a contact and display its detailed info in the UI.
 * 
 * @param {string} newContactId
 * @param {string} firstNameOfUser
 * @param {string} lastNameOfUser
 * @param {string} emailOfUser
 * @param {string} phoneOfUser
 */
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

/**
 * Clear values and error styles of input fields (name, email, phone).
 */
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

/**
 * Reset input fields to default state and add opacity to required field indicators.
 */
function setInputToDefault() {
  removeInputFieldsValues();
  addOpacityToRequiredFields();
}

/**
 * Add opacity class to all required input field labels.
 */

function addOpacityToRequiredFields(){
  let requiredNameFieldRef = document.getElementById("requiredNameField");
  let requiredEmailFieldRef = document.getElementById("requiredEmailField");
  let requiredPhoneFieldRef = document.getElementById("requiredPhoneField");
  requiredNameFieldRef.classList.add("opacity");
  requiredEmailFieldRef.classList.add("opacity");
  requiredPhoneFieldRef.classList.add("opacity");
}

/**
 * Stop propagation of the given event.
 * 
 * @param {Event} event 
 */
function stopPropagation(event) {
  event.stopPropagation(event);
}

/**
 * Add error class to the given input fields.
 * 
 * @param {HTMLInputElement} nameRef
 * @param {HTMLInputElement} emailRef
 * @param {HTMLInputElement} phoneRef
 */
function addError(nameRef, emailRef, phoneRef) {
  nameRef.classList.add("error");
  emailRef.classList.add("error");
  phoneRef.classList.add("error");
}

/**
 * Remove error class from the given input fields.
 * 
 * @param {HTMLInputElement} nameRef
 * @param {HTMLInputElement} emailRef
 * @param {HTMLInputElement} phoneRef
 */
function removeError(nameRef, emailRef, phoneRef) {
  nameRef.classList.remove("error");
  emailRef.classList.remove("error");
  phoneRef.classList.remove("error");
}

/**
 * Add opacity to required field labels.
 */
function addOpacity() {
  let requiredNameFieldRef = document.getElementById("requiredNameField");
  let requiredEmailFieldRef = document.getElementById("requiredEmailField");
  let requiredPhoneFieldRef = document.getElementById("requiredPhoneField");
  requiredNameFieldRef.classList.add("opacity");
  requiredEmailFieldRef.classList.add("opacity");
  requiredPhoneFieldRef.classList.add("opacity");
}

/**
 * Remove opacity from the given required field label elements.
 * 
 * @param {HTMLElement} requiredNameFieldRef
 * @param {HTMLElement} requiredEmailFieldRef
 * @param {HTMLElement} requiredPhoneFieldRef
 */
function removeOpacity(requiredNameFieldRef,requiredEmailFieldRef,requiredPhoneFieldRef) {
  requiredNameFieldRef.classList.remove("opacity");
  requiredEmailFieldRef.classList.remove("opacity");
  requiredPhoneFieldRef.classList.remove("opacity");
}

/**
 * Creates a new contact after validating and sanitizing user input.
 * Submits the data to the backend and updates the UI accordingly.
 * 
 * @param {Event} event - The event triggered by the user (e.g. form submission or button click).
 */
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

/**
 * Retrieves input and error label DOM references from the contact form.
 * @returns {{name: HTMLElement, email: HTMLElement, phone: HTMLElement, errorName: HTMLElement, errorEmail: HTMLElement, errorPhone: HTMLElement}}
 */
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

/**
 * Extracts and trims user input values from input fields.
 * 
 * @param {Object} refs - The DOM element references returned by getRefs().
 * @returns {{name: string, email: string, phone: string}} - Cleaned user input values.
 */
function getSanitizedValues(refs) {
  return {
    name: refs.name.value.trim().replace(/\s+/g, " "),
    email: refs.email.value.trim().replace(/\s+/g, ""),
    phone: refs.phone.value.trim().replace(/\s+/g, ""),
  };
}

/**
 * Checks whether the name is invalid and both email and phone are empty.
 * Displays all error states if true.
 * 
 * @param {{name: string, email: string, phone: string}} values - The cleaned input values.
 * @param {Object} refs - DOM references to input and error fields.
 * @returns {boolean} - True if the form is completely invalid; false otherwise.
 */
function isAllEmptyOrInvalid(values, refs) {
  const namePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ]+( [A-Za-zÀ-ÖØ-öø-ÿ]+)+$/;
  if (!namePattern.test(values.name) && values.email === "" && values.phone === "") {
    addError(refs.name, refs.email, refs.phone);
    removeOpacity(refs.errorName, refs.errorEmail, refs.errorPhone);
    return true;
  }
  return false;
}

/**
 * Validates name, email, and phone inputs individually.
 * Highlights the first invalid input and displays the corresponding error message.
 * 
 * @param {{name: string, email: string, phone: string}} values - The cleaned input values.
 * @param {Object} refs - DOM references to input and error fields.
 * @returns {boolean} - True if an error is found and displayed; false otherwise.
 */
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

/**
 * Splits the full name string into first and last name, and capitalizes the first letter of each.
 * 
 * @param {string} name - Full name input from the user.
 * @returns {{firstName: string, lastName: string}} - Capitalized first and last name.
 */
function splitAndCapitalizeName(name) {
  const [firstRaw, lastRaw] = name.split(" ");
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  return {
    firstName: capitalize(firstRaw),
    lastName: capitalize(lastRaw),
  };
}

/**
 * Reset error styles for inputs and warnings.
 * 
 * @param {HTMLInputElement[]} inputs - Input elements to reset error on.
 * @param {HTMLElement[]} warnings - Warning label elements to reset opacity on.
 */
function resetErrorStatus(inputs, warnings) {
  inputs.forEach((input) => input.classList.remove("error"));
  warnings.forEach((warn) => warn.classList.add("opacity"));
}

/**
 * Generate a unique UUID string.
 * 
 * @returns {string} A new UUID.
 */
function getId() {
  return self.crypto.randomUUID();
}

/**
 * Show a temporary success message after contact creation.
 */
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

/**
 * Clear the values of the given input fields.
 * 
 * @param {HTMLInputElement} nameRef
 * @param {HTMLInputElement} emailRef
 * @param {HTMLInputElement} phoneRef
 */
function clearInputFields(nameRef, emailRef, phoneRef) {
  nameRef.value = "";
  emailRef.value = "";
  phoneRef.value = "";
}

/**
 * Send data via POST request to the specified path.
 * 
 * @param {string} path - The API endpoint path.
 * @param {Object} data - The data object to send.
 * @returns {Promise<Object>} The JSON response.
 */
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

/**
 * Append a newly created contact to the UI list and refresh styles.
 * 
 * @param {string} firstNameOfUser
 * @param {string} lastNameOfUser
 * @param {HTMLInputElement} emailRef
 * @param {HTMLInputElement} phoneRef
 */
function getListOfCreatedContact(firstNameOfUser,lastNameOfUser,emailRef,phoneRef) {
  let alphabeticalOrderRef = document.getElementById("alphabeticalOrder" + firstNameOfUser.charAt(0).toUpperCase());
  alphabeticalOrderRef.innerHTML += getBasicInfoAboutContact(emailRef.value,firstNameOfUser,lastNameOfUser,phoneRef.value);
  getSortTitle(firstNameOfUser);
  randomBackgroundColor(firstNameOfUser, lastNameOfUser);
}

/**
 * Fill input fields with existing contact data for editing.
 * 
 * @param {Object} user - Contact user object with firstname, lastname, email, phone.
 */
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

/**
 * Set correct background styles for the profile initials.
 * 
 * @param {Object} user - Contact user object.
 */
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

/**
 * Render and save changes for the currently active contact.
 * 
 * @param {Array<string>} fullName - [firstName, lastName]
 * @param {Array<Object>} contactsArry - Array of contacts.
 * @param {Event} event - Event triggering the save.
 * @param {Array<string>} keys - Array of contact keys/ids.
 * @param {HTMLInputElement} inputEmailRef
 * @param {HTMLInputElement} inputPhoneRef
 */
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

/**
 * Save updated contact data with a PUT request and update UI accordingly.
 * 
 * @param {Event} event
 * @param {Object} contact - Existing contact object.
 * @param {number} index - Index of the contact in the array.
 * @param {Array<string>} keys - Array of keys/ids for contacts.
 * @param {HTMLInputElement} inputEmailRef
 * @param {HTMLInputElement} inputPhoneRef
 * @param {string} firstName
 * @param {string} lastName
 * @param {string} id - Contact's unique id.
 */
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

/**
 * Show detailed information of a contact in the UI.
 * 
 * @param {Array<string>} divRef - Array of CSS classes from the contact's circle element.
 * @param {string} firstName
 * @param {string} lastName
 * @param {string} inputEmailRef
 * @param {string} inputPhoneRef
 */
function showMoreDetails(divRef,firstName,lastName,inputEmailRef,inputPhoneRef) {
  let allInfoAboutContactRef = document.getElementById("allInfoAboutContact");
  allInfoAboutContactRef.innerHTML = "";
  allInfoAboutContactRef.innerHTML = getDetailsOfContact(divRef,firstName,lastName,inputEmailRef,inputPhoneRef);
  let setNewBgForContactRef = document.getElementById("setNewBgFor" + firstName + lastName);
  setNewBgForContactRef.classList.add("darkBtn");
}

/**
 * Clear alphabetical order UI group if no child contacts remain.
 * 
 * @param {Object} contact - Contact object.
 */
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

/**
 * Send data via PUT request to the specified path.
 * 
 * @param {string} [path=""] - API endpoint path.
 * @param {Object} [data={}] - Data object to update.
 * @returns {Promise<Object>} The JSON response.
 */
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