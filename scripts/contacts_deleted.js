function renderDeletedUser(contactsArry, keys, event, inputNameRef, inputEmailRef, inputPhoneRef, requiredNameEditFieldRef,requiredEmailEditFieldRef,requiredPhoneEditFieldRef){
    for (let index = 0; index < contactsArry.length; index++) {
    let contact = contactsArry[index];
    let fullContactName = contact.firstname + " " + contact.lastname;
    if (fullContactName == currentActiveContactId) {
      deleteContact(keys, index, contact);
      closeOverlayAfterEditedContact(event);
      removeEditError(inputNameRef, inputEmailRef, inputPhoneRef);
      addEditOpacity(requiredNameEditFieldRef,requiredEmailEditFieldRef,requiredPhoneEditFieldRef);
    }
  }
}

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

async function deleteData(path = "") {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "DELETE",
  });
  return (responseToJson = await response.json());
}

async function deleteContact(keys, index, contact) {
  let key = keys[index];
  removeInfos(contact);
  clearOrLetOrder(contact);
  await deleteData(`contacts/${key}`);
}

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