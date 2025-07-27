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

function checkWindowWidth(contentOverlayRef){
  if (window.innerWidth <= 1100) {
    contentOverlayRef.classList.add("hideContentOverlayMobile");
    contentOverlayRef.classList.remove("showContentOverlay");
  } else if (window.innerWidth > 1100) {
    contentOverlayRef.classList.remove("showContentOverlay");
    contentOverlayRef.classList.add("hideContentOverlay");
  }
}

function switchClassesViewPoint(contactsRef, addPersonRef, chooseEditOrDeleteMobileRef, successfullyCreatedMobileRef, chooseOverlayForMobileRef){
  contactsRef.classList.remove("d-nonevip");
    addPersonRef.classList.add("d-nonevip");
    chooseEditOrDeleteMobileRef.classList.add("d-nonevip");
    successfullyCreatedMobileRef.classList.add("opacity");
    chooseOverlayForMobileRef.classList.remove("showChooseOverlay");
    chooseOverlayForMobileRef.classList.add("hideChooseOverlay");
}