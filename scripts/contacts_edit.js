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

async function openEditOverlay(event) {
  event.stopPropagation(event);
  let contacts = await fetchData("/contacts/");
  let contactsArray = Object.values(contacts);
  let user = contactsArray.find((currentUser) => currentUser.firstname + " " + currentUser.lastname == currentActiveContactId);
  toggleEditOverlay();
  inputFieldsGetValuesOfContact(user);
  profileGetCorrectBackground(user);
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

// Original
// function addEditError(inputNameRef, inputEmailRef, inputPhoneRef) {
//   inputNameRef.classList.add("error");
//   inputEmailRef.classList.add("error");
//   inputPhoneRef.classList.add("error");
// }

// function removeEditError(inputNameRef, inputEmailRef, inputPhoneRef) {
//   inputNameRef.classList.remove("error");
//   inputEmailRef.classList.remove("error");
//   inputPhoneRef.classList.remove("error");
// }

// TEST
function editError(action, inputNameRef, inputEmailRef, inputPhoneRef) {
  if (["add", "remove"].includes(action)) {
    inputNameRef.classList[action]("error");
    inputEmailRef.classList[action]("error");
    inputPhoneRef.classList[action]("error");
  } else {
    console.warn(`Ungültige Aktion: ${action}`);
  }
}
// TEST ENDE


// Original
// function addEditOpacity(requiredNameEditFieldRef,requiredEmailEditFieldRef,requiredPhoneEditFieldRef) {
//   requiredNameEditFieldRef.classList.add("opacity");
//   requiredEmailEditFieldRef.classList.add("opacity");
//   requiredPhoneEditFieldRef.classList.add("opacity");
// }

// function removeEditOpacity(requiredNameEditFieldRef,requiredEmailEditFieldRef,requiredPhoneEditFieldRef) {
//   requiredNameEditFieldRef.classList.remove("opacity");
//   requiredEmailEditFieldRef.classList.remove("opacity");
//   requiredPhoneEditFieldRef.classList.remove("opacity");
// }

//TEST
function editOpacity(action, requiredNameEditFieldRef,requiredEmailEditFieldRef,requiredPhoneEditFieldRef) {
  requiredNameEditFieldRef.classList[action]("opacity");
  requiredEmailEditFieldRef.classList[action]("opacity");
  requiredPhoneEditFieldRef.classList[action]("opacity");
}
// TEST ENDE

//Original
// async function saveEditedContact(event) {
//   let contacts = await fetchData("/contacts/");
//   let keys = Object.keys(contacts);
//   let contactsArry = Object.values(contacts);
//   let inputNameRef = document.getElementById("nameEdit");
//   let inputEmailRef = document.getElementById("emailEdit");
//   let inputPhoneRef = document.getElementById("phoneEdit");
//   let fullName = inputNameRef.value.split(" ");
//   let requiredNameEditFieldRef = document.getElementById("requiredNameEditField");
//   let requiredEmailEditFieldRef = document.getElementById("requiredEmailEditField");
//   let requiredPhoneEditFieldRef = document.getElementById("requiredPhoneEditField");
//   if (fullName.length <= 1 &&inputEmailRef.value == "" &&inputPhoneRef.value == "") {
//     editError("add", inputNameRef, inputEmailRef, inputPhoneRef);
//     editOpacity("remove", requiredNameEditFieldRef,requiredEmailEditFieldRef,requiredPhoneEditFieldRef);
//     return;
//   } else if (fullName.length <= 1 || fullName[1] == "") {
//     inputNameRef.classList.add("error");
//     requiredNameEditFieldRef.classList.remove("opacity");
//     return;
//   } else if (inputEmailRef.value == "") {
//     inputEmailRef.classList.add("error");
//     requiredEmailEditFieldRef.classList.remove("opacity");
//     return;
//   } else if (inputPhoneRef.value == "") {
//     inputPhoneRef.classList.add("error");
//     requiredPhoneEditFieldRef.classList.remove("opacity");
//     return;
//   }
//     renderSaveContact(fullName, contactsArry, event, keys, inputEmailRef,inputPhoneRef);
// }

// TEST START

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

function showEditErrorIfEmpty(condition, inputRef, labelRef) {
  if (condition) {
    inputRef.classList.add("error");
    labelRef.classList.remove("opacity");
    return true;
  }
  return false;
}
// TEST ENDE

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