/**
 * Removes detailed information about the currently active contact from the UI.
 * Hides the contact info section, resets the active contact ID, and removes the contact's visual highlight.
 *
 * @param {Object} contact - The contact object whose information should be removed.
 */
function removeInfos(contact) {
  let allInfoAboutContactRef = document.getElementById("allInfoAboutContact");
  allInfoAboutContactRef.classList.remove("showAllInfoAboutContact");
  currentActiveContactId = null;
  let setNewBgForRef = document.getElementById("allMainInfoAbout" + contact.firstname + contact.lastname);
  setNewBgForRef.remove();
}

/**
 * Removes the main visual element representing the given contact from the DOM.
 *
 * @param {Object} contact - The contact object whose DOM element should be removed.
 */
function removeOldContactInfo(contact) {
  let targetSetNewBgForRef = document.getElementById("allMainInfoAbout" + contact.firstname + contact.lastname);
  targetSetNewBgForRef.remove();
}

/**
 * Inserts the updated basic contact info into the appropriate alphabetical section in the DOM.
 *
 * @param {HTMLElement} divRef - The container element holding the contact's updated info.
 * @param {string} firstName - The contact's first name.
 * @param {string} lastName - The contact's last name.
 * @param {HTMLElement} inputEmailRef - Reference to the email input field.
 * @param {HTMLElement} inputPhoneRef - Reference to the phone input field.
 */
function getNewContactInfo(divRef,firstName,lastName,inputEmailRef,inputPhoneRef) {
  let alphabeticalOrderRef = document.getElementById("alphabeticalOrder" + firstName.charAt(0).toUpperCase());
  alphabeticalOrderRef.innerHTML += getEditedBasicInfoAboutContact(divRef,firstName,lastName,inputEmailRef,inputPhoneRef);
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