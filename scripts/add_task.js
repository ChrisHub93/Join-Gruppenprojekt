let priorityUrgent = false;
let priorityMedium = false;
let priorityLow = false;
let checkTitle = false;
let checkDate = false;
let checkCategory = false;
let currentStatus = "To do";
let setPriority = "";
let assignedTo = [];
let subtasksOpen = [];
let subtasksClosed = [];
let debounceTimeOut = 0;
let contactsToAssign;

function upToDate() {
  const dateInput = document.getElementById("date");
  dateInput.min = getTodayStr();
}

function clearInputFields() {
  removeValue("title");
  removeInputError("title");
  addOpacity("errorTitle");
  removeValue("description");
  removeValue("date");
  removeInputError("date");
  addOpacity("errorDate");
  removeValue("subTaskInput");
  clearInnerHTML("subTasks");
  removeValue("userNameWord");
  clearInnerHTML("assignedMembers");
}

function removeValue(id) {
  let ref = document.getElementById(id);
  if (!ref) return;
  ref.value = "";
}

function removeInputError(id) {
  let ref = document.getElementById(id);
  if (!ref) return;
  ref.classList.remove("inputError");
}

function addOpacity(id) {
  let ref = document.getElementById(id);
  if (!ref) return;
  ref.classList.add("opacity");
}

function clearInnerHTML(id) {
  let ref = document.getElementById(id);
  if (!ref) return;
  ref.innerHTML = "";
}

function renderList() {
  let listRef = allMembers.querySelectorAll("li");
  for (let element of listRef) {
    element.classList.remove("assignedBg");
  }
}

function setCheckBoxFalse() {
  let inputRef = allMembers.querySelectorAll("input");
  for (const element of inputRef) {
    element.checked = false;
  }
}

function getDefaultCheckBoxImg() {
  let checkBoxImg = allMembers.querySelectorAll("img");
  for (const element of checkBoxImg) {
    element.src = "../assets/icons/Check button.png";
    element.classList.remove("filterChecked");
  }
}

function changeArrowOfInput() {
  let ref = document.getElementById("arrow");
  let currentSrc = ref.getAttribute("src");
  if (currentSrc.includes("arrow_drop_down.png")) {
    ref.src = "../assets/icons/arrow_drop_down.png";
  } else {
    ref.src = "../assets/icons/arrow_drop_down.png";
  }
}

function removeClasses() {
  let allMembers = document.getElementById("allMembers");
  let selectCategoryFieldRef = document.getElementById("selectCategoryField");
  renderList();
  setCheckBoxFalse();
  allMembers.classList.remove("show");
  changeArrowOfInput();
  selectCategoryFieldRef.innerHTML = "";
  selectCategoryFieldRef.innerHTML = getBasicSelectTemplate();
}

function clearAddTaskFields() {
  clearInputFields();
  resetAllPriorities();
  setPriorityMedium("medium");
  assignedTo.splice(0, assignedTo.length);
  removeClasses();
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

async function initAddTask() {
  let contacts = await loadContacts();
  let username = sessionStorage.getItem("loggedInUser");
  if (username) {
    let currentUserLoggedIn = await loadUsers();
    let loggedUser = currentUserLoggedIn.find((user) => user.name === username);
    if (loggedUser) {
      const allMembersRef = document.getElementById("allMembers");
      let name = loggedUser.name;
      let assignedColor = getAvatarColorClass(name);

      allMembersRef.innerHTML += getContactListLoggedInUser(
        loggedUser,
        assignedColor
      );
    }
  }
  renderContactList(contacts);
  contactsToAssign = contacts;
  upToDate();
}

async function loadUsers() {
  let users = await fetchData("/users/");
  let contactsArray = Object.values(users);
  return contactsArray;
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

async function fetchData(path) {
  let response = await fetch(BASE_URL + path + ".json");
  let responseAsJson = await response.json();
  return responseAsJson;
}

function compare(firstUser, nextUser) {
  if (firstUser.firstname.toUpperCase() < nextUser.firstname.toUpperCase()) {
    return -1;
  } else if (
    firstUser.firstname.toUpperCase() > nextUser.firstname.toUpperCase()
  ) {
    return 1;
  } else {
    return 0;
  }
}

function toggleVisibility(id) {
  let ref = document.getElementById(id);
  if (!ref) return;
  ref.classList.toggle("show");
}

function toggleArrow(id) {
  let ref = document.getElementById(id);
  if (!ref) return;
  let currentSrc = ref.getAttribute("src");
  if (currentSrc.includes("arrow_drop_down.png")) {
    ref.src = "../assets/icons/arrow_drop_down2.png";
  } else {
    ref.src = "../assets/icons/arrow_drop_down.png";
  }
}

function toggleBorderColor(id) {
  let ref = document.getElementById(id);
  if (!ref) return;
  ref.classList.toggle("border-color");
}

async function openAssignedTo() {
  let allMembers = document.getElementById("allMembers");
  let membersAreVisible = allMembers.classList.toggle("show");
  toggleBorderColor("selectMember", membersAreVisible ? "add" : "remove");
  toggleArrow("arrow", membersAreVisible ? "open" : "close");
  if (membersAreVisible) {
    setTimeout(() => {
      document.addEventListener("click", handleClickOutsideAllMembers, true);
    }, 0);
  } else {
    document.removeEventListener("click", handleClickOutsideAllMembers, true);
  }
}

function handleClickOutsideAllMembers(event) {
  let allMembers = document.getElementById("allMembers");
  let input = document.getElementById("userNameWord");
  let arrow = document.getElementById("arrow");
  if (
    !allMembers.contains(event.target) &&
    !input.contains(event.target) &&
    !arrow.contains(event.target)
  ) {
    allMembers.classList.remove("show");
    toggleBorderColor("selectMember", "remove");
    toggleArrow("arrow", "close");
    document.removeEventListener("click", handleClickOutsideAllMembers, true);
  }
}

function checkInputCheckBox(membersRef, inputRef, checkBoxImg){
  if (!inputRef.checked) {
    getInputCheckedTrue(membersRef, inputRef, checkBoxImg);
  } else if (inputRef.checked && membersRef.classList.contains("assignedBg")) {
    getInputCheckedFalse(membersRef, inputRef, checkBoxImg);
  }
}

function getActiveUser(membersRef, id){
let selectedMember = document.getElementById("selected_name_icon" + id);
    if (!selectedMember) {
      getIcon(membersRef, id).then(() => {
        updateAssignedMembersDisplay();
      });
    } else {
      updateAssignedMembersDisplay();
    }
}

function getNotActiveUser(id){
   let selectedMember = document.getElementById("selected_name_icon" + id);
    if (selectedMember) {
      selectedMember.remove();
      updateAssignedMembersDisplay();
    }
}

function getContact(id) {
  let membersRef = document.getElementById("contact" + id);
  let inputRef = document.getElementById("checkbox" + id);
  let checkBoxImg = document.getElementById("checkBoxImg" + id);
  // if (!inputRef.checked) {
  //   getInputCheckedTrue(membersRef, inputRef, checkBoxImg);
  // } else if (inputRef.checked && membersRef.classList.contains("assignedBg")) {
  //   getInputCheckedFalse(membersRef, inputRef, checkBoxImg);
  // }
  checkInputCheckBox(membersRef, inputRef, checkBoxImg)
  toggleAssignment(id);
  let activeUser = assignedTo.find((currentId) => currentId == id);
  if (activeUser) {
    getActiveUser(membersRef, id);
    // let selectedMember = document.getElementById("selected_name_icon" + id);
    // if (!selectedMember) {
    //   getIcon(membersRef, id).then(() => {
    //     updateAssignedMembersDisplay();
    //   });
    // } else {
    //   updateAssignedMembersDisplay();
    // }
  }

  if (!activeUser) {
    getNotActiveUser(id);
    // let selectedMember = document.getElementById("selected_name_icon" + id);
    // if (selectedMember) {
    //   selectedMember.remove();
    //   updateAssignedMembersDisplay();
    // }
  }
}

async function getIcon(membersRef, id) {
  let assignedMembersRef = document.getElementById("assignedMembers");
  let mainDiv = membersRef.querySelector("p");
  let assignedColor = mainDiv.classList[1];
  let contacts = await loadContacts();
  let currentSelectedUser = contacts.find((user) => user.id === id);
  if (currentSelectedUser) {
    assignedMembersRef.innerHTML += `<p id="selected_name_icon${
      currentSelectedUser.id
    }" class="assigned_to_icon ${assignedColor}">${currentSelectedUser.firstname
      .toUpperCase()
      .charAt(0)}${currentSelectedUser.lastname.toUpperCase().charAt(0)}</p>`;
  }
}

function toggleAssignment(id) {
  const index = assignedTo.indexOf(id);
  if (index !== -1) {
    assignedTo.splice(index, 1);
  } else {
    assignedTo.push(id);
  }
}

function getInputCheckedFalse(membersRef, inputRef, checkBoxImg) {
  inputRef.checked = false;
  checkBoxImg.src = "../assets/icons/Check button.png";
  membersRef.classList.remove("assignedBg");
  checkBoxImg.classList.remove("filterChecked");
}

function getInputCheckedTrue(membersRef, inputRef, checkBoxImg) {
  inputRef.checked = true;
  checkBoxImg.src = "../assets/icons/Check button true.png";
  membersRef.classList.add("assignedBg");
  checkBoxImg.classList.add("filterChecked");
}

function getCheckBoxFalse(id) {
  let membersRef = document.getElementById(id);
  inputRef = membersRef.querySelector("input");
  imgRef = membersRef.querySelector("img");
  inputRef.checked = false;
  imgRef.src = "../assets/icons/Check button.png";
  imgRef.classList.remove("filterChecked");
}

function updateAssignedMembersDisplay() {
  let container = document.getElementById("assignedMembers");
  let existingWrapper = container.querySelector(".plusWrapper");
  if (existingWrapper) existingWrapper.remove();
  let icons = Array.from(container.querySelectorAll(".assigned_to_icon")).filter((icon) => !icon.closest(".bubbleTooltip"));
  icons.forEach((icon) => (icon.style.display = "flex"));
  if (icons.length > 5) {
    getIconClasses(container);
  }
}

function getIconClasses(container){
  let hiddenIcons = icons.slice(5);
    hiddenIcons.forEach((icon) => (icon.style.display = "none"));
    let plusWrapper = document.createElement("div");
    plusWrapper.classList.add("plusWrapper");
    let plusOne = document.createElement("p");
    plusOne.classList.add("assignedPlusOne");
    plusOne.textContent = `+${hiddenIcons.length}`;
    // let bubbleTooltip = document.createElement("div");
    // bubbleTooltip.classList.add("bubbleTooltip");

    // hiddenIcons.forEach((icon) => {
    //   let clone = icon.cloneNode(true);
    //   clone.style.display = "flex";
    //   bubbleTooltip.appendChild(clone);
    // });
    plusWrapper.appendChild(plusOne);
    // plusWrapper.appendChild(bubbleTooltip);
    container.appendChild(plusWrapper);
}

function openTaskCategory() {
  toggleVisibility("allOptions");
  let selectRef = document.getElementById("select");
  selectRef.innerText = `Select task category`;
  toggleArrow("arrowCategory");
}

function closeTaskCategory() {
  toggleVisibility("allOptions");
  toggleArrow("arrowCategory");
}

function getCategory(id) {
  let selectRef = document.getElementById("select");
  let optionsRef = document.getElementById(id);
  selectRef.innerHTML = "";
  selectRef.innerHTML = optionsRef.innerText;
  closeTaskCategory();
}

// function setPriorityUrgent(id) {
//   if (!priorityUrgent) {
//     resetAllPriorities();
//     priorityUrgent = true;
//     let urgentRef = document.getElementById(id);
//     urgentRef.classList.toggle("priorityUrgentBg");
//     addDisplayNone("standardUrgentIcon");
//     removeDisplayNone("activeUrgentIcon");
//     setPriority = "urgent";
//   } else if (priorityUrgent) {
//     resetAllPriorities();
//   }
// }

// function setPriorityMedium(id) {
//   if (!priorityMedium) {
//     resetAllPriorities();
//     priorityMedium = true;
//     let urgentRef = document.getElementById(id);
//     urgentRef.classList.toggle("priorityMediumBg");
//     addDisplayNone("standardMediumIcon");
//     removeDisplayNone("activeMediumIcon");
//     setPriority = "medium";
//   } else if (priorityMedium) {
//     resetAllPriorities();
//   }
// }

// function setPriorityLow(id) {
//   if (!priorityLow) {
//     resetAllPriorities();
//     priorityLow = true;
//     let urgentRef = document.getElementById(id);
//     urgentRef.classList.toggle("priorityLowBg");
//     addDisplayNone("standardLowIcon");
//     removeDisplayNone("activeLowIcon");
//     setPriority = "low";
//   } else if (priorityLow) {
//     resetAllPriorities();
//   }
// }

// function resetAllPriorities() {
//   priorityUrgent = false;
//   priorityMedium = false;
//   priorityLow = false;
//   document.getElementById("urgent").classList.remove("priorityUrgentBg");
//   removeDisplayNone("standardUrgentIcon");
//   addDisplayNone("activeUrgentIcon");
//   document.getElementById("medium").classList.remove("priorityMediumBg");
//   removeDisplayNone("standardMediumIcon");
//   addDisplayNone("activeMediumIcon");
//   document.getElementById("low").classList.remove("priorityLowBg");
//   removeDisplayNone("standardLowIcon");
//   addDisplayNone("activeLowIcon");
// }

// function removeDisplayNone(id) {
//   let ref = document.getElementById(id);
//   if (!ref) return;
//   ref.classList.remove("d-none");
// }

// function addDisplayNone(id) {
//   let ref = document.getElementById(id);
//   if (!ref) return;
//   ref.classList.add("d-none");
// }

// function createTask() {
//   checkEmptyTitle();
//   checkEmptyDate();
//   checkEmptyCategory();
//   if (checkTitle && checkDate && checkCategory) {
//     disableButtons();
//     closeAddTaskOverlaySuccses();
//     postDataToServer(currentStatus);
//     currentStatus = "To do";
//     setTimeout(() => {
//       window.location.href = "../html/board.html";
//     }, 700);
//   }
// }

// async function createTaskBoard() {
//   checkEmptyTitle();
//   checkEmptyDate();
//   checkEmptyCategory();
//   if (checkTitle && checkDate && checkCategory) {
//     await postDataToServer(currentStatus);
//     disableButtons();
//     closeAddTaskOverlaySuccses();
//     currentStatus = "To do";
//     setTimeout(() => {
//       loadTasks();
//       enableButtons();
//     }, 700);
//   }
// }

// function disableButtons() {
//   document.querySelectorAll("button").forEach((btn) => (btn.disabled = true));
//   document.body.style.overflow = "hidden";
// }

// function enableButtons() {
//   document.querySelectorAll("button").forEach((btn) => (btn.disabled = false));
//   document.body.style.overflow = "";
// }

// function checkEmptyTitle() {
//   let titleRef = document.getElementById("title");
//   let errorTitleRef = document.getElementById("errorTitle");
//   if (!titleRef.value) {
//     titleRef.classList.add("inputError");
//     errorTitleRef.classList.remove("opacity");
//     checkTitle = false;
//   } else {
//     titleRef.classList.remove("inputError");
//     errorTitleRef.classList.add("opacity");
//     checkTitle = true;
//   }
// }

// function checkEmptyDate() {
//   const dateRef = document.getElementById("date");
//   const errorDateRef = document.getElementById("errorDate");
//   const inputValue = dateRef.value.trim();
//   const todayStr = getTodayStr();

//   if (!inputValue || inputValue < todayStr) {
//     dateRef.classList.add("inputError");
//     errorDateRef.classList.remove("opacity");
//     checkDate = false;
//   } else {
//     dateRef.classList.remove("inputError");
//     errorDateRef.classList.add("opacity");
//     checkDate = true;
//   }
// }

// function getTodayStr() {
//   const today = new Date();
//   const yyyy = today.getFullYear();
//   const mm = String(today.getMonth() + 1).padStart(2, "0");
//   const dd = String(today.getDate()).padStart(2, "0");
//   return `${yyyy}-${mm}-${dd}`;
// }

// function checkEmptyCategory() {
//   const category = document.getElementById("select").innerText;
//   const errorCatRef = document.getElementById("selectCategoryField");

//   if (category === "Select task category") {
//     errorCatRef.classList.add("inputError");
//     checkCategory = false;
//   } else {
//     errorCatRef.classList.remove("inputError");
//     checkCategory = true;
//   }
// }

// function chooseSubTask(id, icon, cancelOrCheckIcon) {
//   let inputRef = document.getElementById(id);
//   let trimmedInputValue = inputRef.value.trim();
//   if (trimmedInputValue == "") {
//     inputRef.value = "";
//     addDisplayNone(cancelOrCheckIcon);
//     removeDisplayNone(icon);
//   } else if (inputRef.value != "") {
//     addDisplayNone(icon);
//     removeDisplayNone(cancelOrCheckIcon);
//   }
// }

// function deleteTask() {
//   let inputRef = document.getElementById("subTaskInput");
//   inputRef.value = "";
//   removeDisplayNone("plusIcon");
//   toggleDisplayNone("cancelOrCheck");
// }

// function addTask(id, renderedField, plusIconRef, CancelOrCheckRef) {
//   let inputRef = document.getElementById(id);
//   let addedTaskRef = document.getElementById(renderedField);

//   let newID = generateTimeBasedId();

//   addedTaskRef.innerHTML += getSubTasksTemplate(inputRef, newID);
//   removeDisplayNone(plusIconRef);
//   toggleDisplayNone(CancelOrCheckRef);
//   subtasksOpen.push(inputRef.value);
//   inputRef.value = "";
// }

// function addTaskHTML(id, renderedField, plusIconRef, CancelOrCheckRef) {
//   let inputRef = document.getElementById(id);
//   let addedTaskRef = document.getElementById(renderedField);
//   addedTaskRef.innerHTML += subtaskTemplateHTML(inputRef);
//   removeDisplayNone(plusIconRef);
//   toggleDisplayNone(CancelOrCheckRef);
//   subtasksOpen.push(inputRef.value);
//   inputRef.value = "";
// }

// function editTask(id) {
//   let inputRef = document.getElementById(`subtask_${id}`);
//   inputField = inputRef.querySelector("input");
//   if (inputField.classList.contains("activeInput")) return;
//   addDisplayNone(`editOrTrash_${id}`);
//   toggleDisplayNone(`trashOrCheck_${id}`);
//   inputField.classList.add("activeInput");
//   toggleDisplayNone(`bullet_${id}`);
//   let length = inputField.value.length;
//   inputField.setSelectionRange(length, length);
//   let hideRef = document.getElementById(`editOrTrash_${id}`);
//   hideRef.classList.add("opacity");
// }

// function acceptTask(id, valueId) {
//   const editTaksValue = document.getElementById(valueId).value.trim();
//   if (editTaksValue === "") return;
//   toggleDisplayNone(`trashOrCheck_${id}`);
//   let hideRef = document.getElementById(`editOrTrash_${id}`);
//   hideRef.classList.remove("opacity");
//   let inputRef = document.getElementById(`subtask_${id}`);
//   inputField = inputRef.querySelector("input");
//   inputField.blur();
//   inputField.classList.toggle("activeInput");
//   toggleDisplayNone(`bullet_${id}`);
// }

// function completeDeleteTask(id) {
//   let inputRef = document.getElementById(id);
//   if (inputRef) inputRef.remove();
// }

// function addDisplayNone(id) {
//   let ref = document.getElementById(id);
//   if (!ref) return;
//   ref.classList.add("d-nonevip");
// }

// function removeDisplayNone(id) {
//   let ref = document.getElementById(id);
//   if (!ref) return;
//   ref.classList.remove("d-nonevip");
// }

// function toggleDisplayNone(id) {
//   let ref = document.getElementById(id);
//   if (!ref) return;
//   ref.classList.toggle("d-nonevip");
// }

// async function postDataToServer(currentStatus) {
//   let title = document.getElementById("title");
//   let description = document.getElementById("description");
//   let date = document.getElementById("date");
//   let priority = setPriority;
//   let category = document.getElementById("select");

//   // Subtasks aus dem DOM auslesen
//   const subTasksFromDOM = Array.from(document.querySelectorAll(".subTaskAdded"))
//     .map((el) => {
//       // entweder direkt ein Input-Feld oder Textinhalt
//       if (el.tagName === "INPUT") return el.value.trim();
//       let input = el.querySelector("input");
//       if (input) return input.value.trim();
//       return el.textContent.trim();
//     })
//     .filter((val) => val.length > 0);

//   await postData(`/tasks/`, {
//     id: generateTimeBasedId(),
//     title: title.value,
//     description: description.value,
//     date: date.value,
//     priority: priority,
//     assignedTo: assignedTo,
//     category: category.innerText,
//     subTasksOpen: subTasksFromDOM,
//     status: currentStatus,
//   });
// }

// async function postData(path, data = {}) {
//   let response = await fetch(BASE_URL + path + ".json", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });
//   return (responseToJson = await response.json());
// }

// function getId() {
//   return self.crypto.randomUUID();
// }

// function generateTimeBasedId() {
//   return Date.now() + Math.floor(Math.random() * 1000);
// }

// async function searchContacts() {
//   let assigneContacts = [];
//   let contacts = await fetchData("/contacts/");
//   let contactsArray = Object.values(contacts);

//   for (id of assignedTo) {
//     for (search of contactsArray) {
//       if (search.id == id) {
//         assigneContacts.push(search.firstname + " " + search.lastname);
//       }
//     }
//   }
//   return assigneContacts;
// }

// function getContactNameById(id) {
//   let contact = globalContacts.find((c) => c.id === id);
//   return contact ? `${contact.firstname} ${contact.lastname}` : "Unbekannt";
// }
