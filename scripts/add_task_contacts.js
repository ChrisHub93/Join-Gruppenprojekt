/**
 * function to search through contacts based on who is assigned
 * 
 * @returns a list of full names of the assignedTo contacts
 */
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

/**
 * function to render all contacts in the assigned to menu
 * 
 * @param {Object[]} contacts - array of contacts where we use first and last name
 */
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

/**
 * function to load all contacts off the server and sorts them
 * 
 * @returns a sorted Array of contacts
 */
async function loadContacts() {
  let contacts = await fetchData("/contacts/");
  let contactsArray = Object.values(contacts);
  return contactsArray.sort(compare);
}

/**
 * function to mark a clicked contact as active or inactive
 * 
 * @param {string} id - id of the clicked contact
 */
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

/**
 * function to filter the contact list based on the input
 * 
 * @param {string} userNameWord - input to filter
 */
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