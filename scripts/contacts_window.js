/**
 * Handles viewport changes when the window is resized.
 * Adapts the visibility of UI elements based on screen width and contact selection state.
 *
 * @param {UIEvent} event - The resize event triggered by the browser.
 */
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

/**
 * Applies responsive overlay styles based on the current window width.
 * Uses different CSS classes for mobile vs. desktop views.
 *
 * @param {HTMLElement} contentOverlayRef - Reference to the overlay content container.
 */
function checkWindowWidthAndSetOverlay(contentOverlayRef){
  if (window.innerWidth <= 1100) {
    contentOverlayRef.classList.add("hideContentOverlayMobile");
    contentOverlayRef.classList.remove("showContentOverlay");
  } else if (window.innerWidth > 1100) {
    contentOverlayRef.classList.remove("showContentOverlay");
    contentOverlayRef.classList.add("hideContentOverlay");
  }
}

/**
 * Updates UI visibility for various contact-related elements when switching 
 * to desktop view (width > 1100px).
 *
 * @param {HTMLElement} contactsRef - Reference to the contacts list container.
 * @param {HTMLElement} addPersonRef - Reference to the "Add Person" container.
 * @param {HTMLElement} chooseEditOrDeleteMobileRef - Reference to the mobile edit/delete options container.
 * @param {HTMLElement} successfullyCreatedMobileRef - Reference to the mobile success message element.
 * @param {HTMLElement} chooseOverlayForMobileRef - Reference to the mobile choose overlay container.
 */
function switchClassesViewPoint(contactsRef, addPersonRef, chooseEditOrDeleteMobileRef, successfullyCreatedMobileRef, chooseOverlayForMobileRef){
  contactsRef.classList.remove("d-nonevip");
    addPersonRef.classList.add("d-nonevip");
    chooseEditOrDeleteMobileRef.classList.add("d-nonevip");
    successfullyCreatedMobileRef.classList.add("opacity");
    chooseOverlayForMobileRef.classList.remove("showChooseOverlay");
    chooseOverlayForMobileRef.classList.add("hideChooseOverlay");
}