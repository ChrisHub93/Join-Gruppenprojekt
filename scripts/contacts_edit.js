/**
 * Validates the edited phone input field to ensure it is not empty.
 * Toggles error styling and visibility of the required field message accordingly.
 */
function checkEmptyEditedPhone() {
  let phoneEditRef = document.getElementById("phoneEdit");
  let requiredPhoneEditFieldRef = document.getElementById("requiredPhoneEditField");
  if (!phoneEditRef.value) {
    phoneEditRef.classList.add("error");
    requiredPhoneEditFieldRef.classList.remove("opacity");
  } else {
    phoneEditRef.classList.remove("error");
    requiredPhoneEditFieldRef.classList.add("opacity");
  }
}

/**
 * Opens the edit overlay for the currently active contact.
 * Populates input fields with the contact's data and sets the correct background styling.
 *
 * @param {Event} event - The event that triggered the overlay opening.
 */
async function openEditOverlay(event) {
  event.stopPropagation(event);
  let contacts = await fetchData("/contacts/");
  let contactsArray = Object.values(contacts);
  let user = contactsArray.find((currentUser) => currentUser.firstname + " " + currentUser.lastname == currentActiveContactId);
  toggleEditOverlay();
  inputFieldsGetValuesOfContact(user);
  profileGetCorrectBackground(user);
}

/**
 * Validates the edited name field to ensure it contains both first and last name.
 * Applies error styles and toggles required field visibility accordingly.
 */
function checkEmptyEditedName() {
  let nameEditRef = document.getElementById("nameEdit");
  let fullName = nameEditRef.value.split(" ");
  let requiredNameEditFieldRef = document.getElementById("requiredNameEditField");
  if (fullName.length <= 1 || fullName[1] == "") {
    nameEditRef.classList.add("error");
    requiredNameEditFieldRef.classList.remove("opacity");
  } else {
    nameEditRef.classList.remove("error");
    requiredNameEditFieldRef.classList.add("opacity");
  }
}

/**
 * Closes the edit overlay after a contact has been edited.
 * Removes active overlay styling and hides the content with animation.
 *
 * @param {Event} event - The event that triggered the overlay close.
 */
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

/**
 * Validates the edited email input field to ensure it is not empty.
 * Applies or removes error indicators and required field notices.
 */
function checkEmptyEditedEmail() {
  let emailEditRef = document.getElementById("emailEdit");
  let requiredEmailEditFieldRef = document.getElementById("requiredEmailEditField");
  if (!emailEditRef.value) {
    emailEditRef.classList.add("error");
    requiredEmailEditFieldRef.classList.remove("opacity");
  } else {
    emailEditRef.classList.remove("error");
    requiredEmailEditFieldRef.classList.add("opacity");
  }
}

/**
 * Closes the edit overlay and resets form validation states.
 * Also adjusts the overlay appearance based on screen size.
 *
 * @param {Event} event - The event that triggered the overlay closing.
 */
function closeEditOverlay(event) {
  event.stopPropagation(event);
  let overlayRef = document.getElementById("editOverlay");
  let contentOverlayRef = document.getElementById("contentEditOverlay");
  contentOverlayRef.classList.remove("hideContentOverlayMobile");
  checkWindowWidthAndSetOverlay(contentOverlayRef);
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
  editError("remove", inputNameRef, inputEmailRef, inputPhoneRef);
  editOpacity("add", requiredNameEditFieldRef,requiredEmailEditFieldRef,requiredPhoneEditFieldRef);
}

/**
 * Adds or removes the "error" class on all input fields depending on the given action.
 *
 * @param {string} action - Either "add" or "remove", determines the action to apply.
 * @param {HTMLElement} inputNameRef - Reference to the name input field.
 * @param {HTMLElement} inputEmailRef - Reference to the email input field.
 * @param {HTMLElement} inputPhoneRef - Reference to the phone input field.
 */
function editError(action, inputNameRef, inputEmailRef, inputPhoneRef) {
  if (["add", "remove"].includes(action)) {
    inputNameRef.classList[action]("error");
    inputEmailRef.classList[action]("error");
    inputPhoneRef.classList[action]("error");
  } else {
    console.warn(`Ungültige Aktion: ${action}`);
  }
}

/**
 * Adds or removes the "opacity" class on required field labels depending on the given action.
 *
 * @param {string} action - Either "add" or "remove", determines whether to apply or remove opacity.
 * @param {HTMLElement} requiredNameEditFieldRef - Reference to the name field label.
 * @param {HTMLElement} requiredEmailEditFieldRef - Reference to the email field label.
 * @param {HTMLElement} requiredPhoneEditFieldRef - Reference to the phone field label.
 */
function editOpacity(action, requiredNameEditFieldRef,requiredEmailEditFieldRef,requiredPhoneEditFieldRef) {
  requiredNameEditFieldRef.classList[action]("opacity");
  requiredEmailEditFieldRef.classList[action]("opacity");
  requiredPhoneEditFieldRef.classList[action]("opacity");
}

/**
 * Saves the edited contact after validating all input fields.
 * If validation fails, highlights the empty fields and displays corresponding error messages.
 * On success, triggers the rendering of the updated contact.
 *
 * @param {Event} event - The event that triggered the save action.
 */
async function saveEditedContact(event) {
  const contacts = await fetchData("/contacts/");
  const keys = Object.keys(contacts);
  const contactsArr = Object.values(contacts);
  const inputNameRef = document.getElementById("nameEdit");
  const inputEmailRef = document.getElementById("emailEdit");
  const inputPhoneRef = document.getElementById("phoneEdit");
  const nameValue = inputNameRef.value.trim();
  const emailValue = inputEmailRef.value.trim();
  const phoneValue = inputPhoneRef.value.trim();
  const fullName = nameValue.split(" ");
  const requiredNameRef = document.getElementById("requiredNameEditField");
  const requiredEmailRef = document.getElementById("requiredEmailEditField");
  const requiredPhoneRef = document.getElementById("requiredPhoneEditField");

  if (fullName.length <= 1 && emailValue === "" && phoneValue === "") {
    editError("add", inputNameRef, inputEmailRef, inputPhoneRef);
    editOpacity("remove", requiredNameRef, requiredEmailRef, requiredPhoneRef);
    return;
  }
  if (
    showEditErrorIfEmpty(fullName.length <= 1 || fullName[1] === "", inputNameRef, requiredNameRef) ||
    showEditErrorIfEmpty(emailValue === "", inputEmailRef, requiredEmailRef) ||
    showEditErrorIfEmpty(phoneValue === "", inputPhoneRef, requiredPhoneRef)
  ) {
    return;
  }
  renderSaveContact(fullName, contactsArr, event, keys, inputEmailRef, inputPhoneRef);
}

/**
 * Helper function to show error styling on a field if a condition is true.
 *
 * @param {boolean} condition - Condition to determine whether to show an error.
 * @param {HTMLElement} inputRef - Reference to the input element to style.
 * @param {HTMLElement} labelRef - Reference to the label or hint to show.
 * @returns {boolean} True if an error was shown, otherwise false.
 */
function showEditErrorIfEmpty(condition, inputRef, labelRef) {
  if (condition) {
    inputRef.classList.add("error");
    labelRef.classList.remove("opacity");
    return true;
  }
  return false;
}

/**
 * Toggles the visibility of the edit overlay.
 * Locks or unlocks body scroll depending on visibility,
 * and applies correct overlay styles for different screen sizes.
 */
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
  checkWindowWidthAndSetOverlay(contentOverlayRef);
  overlayRef.classList.toggle("d-nonevip");
  contentOverlayRef.classList.remove("d-nonevip");
  setTimeout(() => {
    contentOverlayRef.classList.remove("hideContentOverlay");
    contentOverlayRef.classList.add("showContentOverlay");
    overlayRef.classList.add("overlayBg");
  }, 10);
}