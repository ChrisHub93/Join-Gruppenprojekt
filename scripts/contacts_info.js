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