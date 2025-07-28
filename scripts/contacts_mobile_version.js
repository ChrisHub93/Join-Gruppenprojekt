function showMobileVersion() {
  let contactsRef = document.getElementById("contacts");
  let infoTitleRef = document.getElementById("infoTitle");
  contactsRef.classList.add("d-nonevip");
  infoTitleRef.classList.add("d-Block");
}

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
