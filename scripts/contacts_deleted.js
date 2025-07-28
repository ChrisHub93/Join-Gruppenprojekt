/**
 * Renders the deletion of a user by checking the active contact ID, deleting the matching contact,
 * closing the overlay, removing form validation errors, and applying visual feedback styles.
 *
 * @param {Array<Object>} contactsArry - Array of contact objects.
 * @param {Array<string>} keys - Array of keys corresponding to each contact in the database.
 * @param {Event} event - The triggering event from the UI (e.g. a click).
 * @param {HTMLElement} inputNameRef - Reference to the name input field in the edit form.
 * @param {HTMLElement} inputEmailRef - Reference to the email input field in the edit form.
 * @param {HTMLElement} inputPhoneRef - Reference to the phone input field in the edit form.
 * @param {HTMLElement} requiredNameEditFieldRef - Reference to the required field message for name input.
 * @param {HTMLElement} requiredEmailEditFieldRef - Reference to the required field message for email input.
 * @param {HTMLElement} requiredPhoneEditFieldRef - Reference to the required field message for phone input.
 */
function renderDeletedUser(contactsArry, keys, event, inputNameRef, inputEmailRef, inputPhoneRef, requiredNameEditFieldRef,requiredEmailEditFieldRef,requiredPhoneEditFieldRef){
    for (let index = 0; index < contactsArry.length; index++) {
    let contact = contactsArry[index];
    let fullContactName = contact.firstname + " " + contact.lastname;
    if (fullContactName == currentActiveContactId) {
      deleteContact(keys, index, contact);
      closeOverlayAfterEditedContact(event);
      editError("remove", inputNameRef, inputEmailRef, inputPhoneRef);
      addEditOpacity(requiredNameEditFieldRef,requiredEmailEditFieldRef,requiredPhoneEditFieldRef);
    }
  }
}

/**
 * Handles user deletion directly from the overlay view. Fetches all contacts,
 * identifies the DOM elements for the edit form, and triggers the deletion rendering process.
 *
 * @param {Event} event - The event triggered by the delete action (e.g. button click).
 */
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

/**
 * Sends a DELETE request to the specified database path.
 *
 * @param {string} [path=""] - The relative path in the database to delete data from.
 * @returns {Promise<Object>} The parsed JSON response from the server.
 */
async function deleteData(path = "") {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "DELETE",
  });
  return (responseToJson = await response.json());
}

/**
 * Deletes a single contact by its index and corresponding key from the database.
 * Also performs cleanup actions such as removing visual info and adjusting order.
 *
 * @param {Array<string>} keys - Array of keys for all contacts.
 * @param {number} index - Index of the contact to delete.
 * @param {Object} contact - The contact object to be deleted.
 */
async function deleteContact(keys, index, contact) {
  let key = keys[index];
  removeInfos(contact);
  clearOrLetOrder(contact);
  await deleteData(`contacts/${key}`);
}

/**
 * Deletes the currently active user (based on their full name) from the database.
 * Closes the mobile overlay if the screen width is below or equal to 1100 pixels.
 */
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