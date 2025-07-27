function getClassesForOverlayDesktop(){
  let successfullyCreatedMobileRef = document.getElementById("successfullyCreatedMobile");
  successfullyCreatedMobileRef.classList.add("opacity");
  let chooseOverlayForMobileRef = document.getElementById("chooseOverlayForMobile");
  chooseOverlayForMobileRef.classList.remove("showChooseOverlay");
  chooseOverlayForMobileRef.classList.add("hideChooseOverlay");
}

function openOverlay() {
  let overlayRef = document.getElementById("overlay");
  let contentOverlayRef = document.getElementById("contentOverlay");
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

function closeOverlay(event) {
  event.stopPropagation(event);
  let overlayRef = document.getElementById("overlay");
  let contentOverlayRef = document.getElementById("contentOverlay");
  contentOverlayRef.classList.remove("hideContentOverlayMobile");
  checkWindowWidth(contentOverlayRef);
  overlayRef.classList.remove("overlayBg");
  setTimeout(() => {
    overlayRef.classList.toggle("d-nonevip");
  }, 150);
  setInputToDefault();
}

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

function clearInputFieldsOfOverlay(nameRef,emailRef, phoneRef){
  nameRef.value = "";
  emailRef.value = "";
  phoneRef.value = "";
}

function switchContentOverlayClasses(overlayRef, contentOverlayRef){
  contentOverlayRef.classList.add("hideContentOverlay");
  contentOverlayRef.classList.remove("showContentOverlay");
  overlayRef.classList.remove("overlayBg");
}

function openChooseOverlay() {
  let chooseOverlayForMobileRef = document.getElementById("chooseOverlayForMobile");
  chooseOverlayForMobileRef.style.display = "flex";
  setTimeout(() => {
    chooseOverlayForMobileRef.classList.add("showChooseOverlay");
    chooseOverlayForMobileRef.classList.remove("hideChooseOverlay");
  }, 30);
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