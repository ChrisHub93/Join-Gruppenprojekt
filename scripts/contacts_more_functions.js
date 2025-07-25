function checkEmptyPhone() {
  let phoneRef = document.getElementById("phone");
  let requiredPhoneFieldRef = document.getElementById("requiredPhoneField");
  let phoneNumber = phoneRef.value.trim();
  let phoneValidation = /^\d+$/;
  if (!phoneNumber || !phoneValidation.test(phone)) {
    phoneRef.classList.add("error");
    requiredPhoneFieldRef.classList.remove("opacity");
  } else {
    phoneRef.classList.remove("error");
    requiredPhoneFieldRef.classList.add("opacity");
  }
}

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

function closeOverlayMobile(event) {
  event.stopPropagation(event);
  let overlayRef = document.getElementById("overlay");
  let contentOverlayRef = document.getElementById("contentOverlay");
  contentOverlayRef.classList.add("hideContentOverlayMobile");
  contentOverlayRef.classList.remove("showContentOverlayMobile");
  overlayRef.classList.remove("overlayBg");
  setTimeout(() => {
    overlayRef.classList.toggle("d-nonevip");
  }, 150);
  setInputToDefault();
}

function openChooseOverlay() {
  let chooseOverlayForMobileRef = document.getElementById("chooseOverlayForMobile");
  chooseOverlayForMobileRef.style.display = "flex";
  setTimeout(() => {
    chooseOverlayForMobileRef.classList.add("showChooseOverlay");
    chooseOverlayForMobileRef.classList.remove("hideChooseOverlay");
  }, 30);
}

function stopPropagationForMobile(event) {
  event.stopPropagation(event);
  let chooseOverlayForMobileRef = document.getElementById("chooseOverlayForMobile");
  chooseOverlayForMobileRef.classList.remove("showChooseOverlay");
  chooseOverlayForMobileRef.classList.add("hideChooseOverlay");
  setTimeout(() => {
    chooseOverlayForMobileRef.style.display = "none";
  }, 50);
}