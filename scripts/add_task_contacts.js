async function searchContacts() {
  let assigneContacts = [];
  let contacts = await fetchData("/contacts/");
  let contactsArray = Object.values(contacts);

  for (id of assignedTo) {
    for (search of contactsArray) {
      if (search.id == id) {
        assigneContacts.push(search.firstname + " " + search.lastname);
      }
    }
  }
  return assigneContacts;
}

function getContactNameById(id) {
  let contact = globalContacts.find((c) => c.id === id);
  return contact ? `${contact.firstname} ${contact.lastname}` : "Unbekannt";
}

function renderContactList(contacts) {
  const allMembersRef = document.getElementById("allMembers");
  if (contacts) {
    for (contact of contacts) {
      let name = contact.firstname + " " + contact.lastname;
      let assignedColor = getAvatarColorClass(name);
      allMembersRef.innerHTML += getContactList(contact, assignedColor);
    }
  }
}

async function loadContacts() {
  let contacts = await fetchData("/contacts/");
  let contactsArray = Object.values(contacts);
  return contactsArray.sort(compare);
}

function getContact(id) {
  let membersRef = document.getElementById("contact" + id);
  let inputRef = document.getElementById("checkbox" + id);
  let checkBoxImg = document.getElementById("checkBoxImg" + id);
  checkInputCheckBox(membersRef, inputRef, checkBoxImg)
  toggleAssignment(id);
  let activeUser = assignedTo.find((currentId) => currentId == id);
  if (activeUser) {
    getActiveUser(membersRef, id);
  }
  if (!activeUser) {
    getNotActiveUser(id);
  }
}

function filterContactsToAssign(userNameWord) {
  clearTimeout(debounceTimeOut);
  debounceTimeOut = setTimeout(() => {
    currentUser = contactsToAssign.filter((user) => user.firstname.toLowerCase().includes(userNameWord.toLowerCase()));
    if (userNameWord.length >= 2) {
      let allMembersRef = document.getElementById("allMembers");
      allMembersRef.innerHTML = "";
      renderContactList(currentUser);
    } else if (userNameWord.length <= 2) {
      let allMembersRef = document.getElementById("allMembers");
      allMembersRef.innerHTML = "";
      initAddTask();
    }
  }, 300);
}