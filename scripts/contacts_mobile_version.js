/**
 * Switches the UI to a mobile-specific view by hiding the contacts list
 * and displaying the contact information title section.
 */
function showMobileVersion() {
  let contactsRef = document.getElementById("contacts");
  let infoTitleRef = document.getElementById("infoTitle");
  contactsRef.classList.add("d-nonevip");
  infoTitleRef.classList.add("d-Block");
}

/**
 * Stops event propagation and closes the mobile choose overlay.
 * Applies hide animations and sets the display to "none" after a short delay.
 *
 * @param {Event} event - The event that triggered this function (e.g. click).
 */
function stopPropagationForMobile(event) {
  event.stopPropagation(event);
  let chooseOverlayForMobileRef = document.getElementById(
    "chooseOverlayForMobile"
  );
  chooseOverlayForMobileRef.classList.remove("showChooseOverlay");
  chooseOverlayForMobileRef.classList.add("hideChooseOverlay");

  setTimeout(() => {
    chooseOverlayForMobileRef.style.display = "none";
  }, 50);
}

/**
 * Closes the mobile overlay view and resets the UI to its default mobile state.
 * Also hides the edit/delete options and restores visibility of main sections.
 */
function closeMobileOverlay() {
  sameContact();
  let contactsRef = document.getElementById("contacts");
  let infoTitleRef = document.getElementById("infoTitle");
  contactsRef.classList.remove("d-nonevip");
  infoTitleRef.classList.remove("d-Block");
  let chooseEditOrDeleteMobileRef = document.getElementById("chooseEditOrDeleteMobile");
  chooseEditOrDeleteMobileRef.classList.add("d-nonevip");
  let chooseOverlayForMobileRef = document.getElementById("chooseOverlayForMobile");
  chooseOverlayForMobileRef.classList.remove("showChooseOverlay");
  let addPersonRef = document.getElementById("addPerson");
  addPersonRef.classList.remove("d-nonevip");
}
