function removeInfos(contact) {
  let allInfoAboutContactRef = document.getElementById("allInfoAboutContact");
  allInfoAboutContactRef.classList.remove("showAllInfoAboutContact");
  currentActiveContactId = null;
  let setNewBgForRef = document.getElementById("allMainInfoAbout" + contact.firstname + contact.lastname);
  setNewBgForRef.remove();
}

function removeOldContactInfo(contact) {
  let targetSetNewBgForRef = document.getElementById("allMainInfoAbout" + contact.firstname + contact.lastname);
  targetSetNewBgForRef.remove();
}

function getNewContactInfo(divRef,firstName,lastName,inputEmailRef,inputPhoneRef) {
  let alphabeticalOrderRef = document.getElementById("alphabeticalOrder" + firstName.charAt(0).toUpperCase());
  alphabeticalOrderRef.innerHTML += getEditedBasicInfoAboutContact(divRef,firstName,lastName,inputEmailRef,inputPhoneRef);
}