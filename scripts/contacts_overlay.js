/**
 * Prepares the desktop overlay by hiding the mobile success message and 
 * switching the choose overlay to a hidden state for mobile.
 */
function getClassesForOverlayDesktop(){
  let successfullyCreatedMobileRef = document.getElementById("successfullyCreatedMobile");
  successfullyCreatedMobileRef.classList.add("opacity");
  let chooseOverlayForMobileRef = document.getElementById("chooseOverlayForMobile");
  chooseOverlayForMobileRef.classList.remove("showChooseOverlay");
  chooseOverlayForMobileRef.classList.add("hideChooseOverlay");
}

/**
 * Opens the main overlay by setting appropriate CSS classes based on the window width,
 * and triggering transition animations after a short delay.
 */
function openOverlay() {
  let overlayRef = document.getElementById("overlay");
  let contentOverlayRef = document.getElementById("contentOverlay");
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

/**
 * Closes the main overlay and resets its styles based on the window width.
 * Also resets all related input fields to their default state.
 *
 * @param {Event} event - The event that triggered the close action.
 */
function closeOverlay(event) {
  event.stopPropagation(event);
  let overlayRef = document.getElementById("overlay");
  let contentOverlayRef = document.getElementById("contentOverlay");
  contentOverlayRef.classList.remove("hideContentOverlayMobile");
  checkWindowWidthAndSetOverlay(contentOverlayRef);
  overlayRef.classList.remove("overlayBg");
  setTimeout(() => {
    overlayRef.classList.toggle("d-nonevip");
  }, 150);
  setInputToDefault();
}

/**
 * Cancels the overlay action by clearing input fields, removing validation errors,
 * hiding the overlay, and resetting opacity and styles.
 *
 * @param {Event} event - The event that triggered the cancellation.
 */
function cancelOverlay(event) {
  event.stopPropagation(event);
  let nameRef = document.getElementById("name");
  let emailRef = document.getElementById("email");
  let phoneRef = document.getElementById("phone");
  clearInputFieldsOfOverlay(nameRef,emailRef, phoneRef);
  let overlayRef = document.getElementById("overlay");
  let contentOverlayRef = document.getElementById("contentOverlay");
  switchContentOverlayClasses(overlayRef, contentOverlayRef);
  setTimeout(() => {
    overlayRef.classList.toggle("d-nonevip");
  }, 150);
  removeError(nameRef, emailRef, phoneRef);
  addOpacity();
}

/**
 * Clears the values of the name, email, and phone input fields inside the overlay form.
 *
 * @param {HTMLInputElement} nameRef - Reference to the name input field.
 * @param {HTMLInputElement} emailRef - Reference to the email input field.
 * @param {HTMLInputElement} phoneRef - Reference to the phone input field.
 */
function clearInputFieldsOfOverlay(nameRef,emailRef, phoneRef){
  nameRef.value = "";
  emailRef.value = "";
  phoneRef.value = "";
}

/**
 * Switches the content overlay's visibility from visible to hidden and
 * removes the background styling of the main overlay container.
 *
 * @param {HTMLElement} overlayRef - Reference to the overlay container element.
 * @param {HTMLElement} contentOverlayRef - Reference to the content section inside the overlay.
 */
function switchContentOverlayClasses(overlayRef, contentOverlayRef){
  contentOverlayRef.classList.add("hideContentOverlay");
  contentOverlayRef.classList.remove("showContentOverlay");
  overlayRef.classList.remove("overlayBg");
}

/**
 * Opens the choose overlay (e.g. for choosing contacts or options on mobile) 
 * with a transition animation.
 */
function openChooseOverlay() {
  let chooseOverlayForMobileRef = document.getElementById("chooseOverlayForMobile");
  chooseOverlayForMobileRef.style.display = "flex";
  setTimeout(() => {
    chooseOverlayForMobileRef.classList.add("showChooseOverlay");
    chooseOverlayForMobileRef.classList.remove("hideChooseOverlay");
  }, 30);
}

/**
 * Closes the overlay after a new contact has been successfully created.
 * Removes animation classes and resets visibility after a delay.
 *
 * @param {Event} event - The event that triggered the overlay close action.
 */
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