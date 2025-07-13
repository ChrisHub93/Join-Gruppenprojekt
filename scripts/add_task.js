let priorityUrgent = false;
let priorityMedium = false;
let priorityLow = false;
let checkTitle = false;
let checkDate = false;
let currentStatus = 'To do';
let setPriority = "";
let assignedTo = [];
let subtasksOpen = [];
let subtasksClosed = [];
let debounceTimeOut = 0;
let contactsToAssign;

function clearInputFields(){
  let titleRef = document.getElementById("title");
  let errorTitleRef = document.getElementById("errorTitle");
  let descriptionRef = document.getElementById("description");
  let dateRef = document.getElementById("date");
  let errorDateRef = document.getElementById("errorDate");
  let subTaskInputRef = document.getElementById("subTaskInput");
  let subTasksRef = document.getElementById("subTasks");
  let userNameWordRef = document.getElementById("userNameWord");
  let assignedMembersRef = document.getElementById("assignedMembers");
  titleRef.value = '';
  titleRef.classList.remove("inputError");
  errorTitleRef.classList.add("opacity");
  descriptionRef.value = '';
  dateRef.value = '';
  dateRef.classList.remove("inputError");
  errorDateRef.classList.add("opacity");  
  subTaskInputRef.value = '';
  subTasksRef.innerHTML = '';
  userNameWordRef.value = '';
  assignedMembersRef.innerHTML = '';
}

function removeClasses(){
  let allMembers = document.getElementById("allMembers");
  let listRef = allMembers.querySelectorAll("li");
  let inputRef = allMembers.querySelectorAll("input");
  let checkBoxImg = allMembers.querySelectorAll("img");
  let selectCategoryFieldRef = document.getElementById("selectCategoryField");
  for (let element of listRef) {
    element.classList.remove("assignedBg");
  }
  for (const element of inputRef) {
    element.checked = false;
  }
  for (const element of checkBoxImg) {
    element.src = "/assets/icons/Check button.png";
    element.classList.remove("filterChecked"); 
  }
  allMembers.classList.remove("show");
  let ref = document.getElementById("arrow");
  let currentSrc = ref.getAttribute("src");
  if (currentSrc.includes("arrow_drop_down.png")) {
    ref.src = "/assets/icons/arrow_drop_down.png";
  } else {
    ref.src = "/assets/icons/arrow_drop_down.png";
  }
  selectCategoryFieldRef.innerHTML='';
  selectCategoryFieldRef.innerHTML=getBasicSelectTemplate();
}

function clearAddTaskFields(){
  clearInputFields();
  resetAllPriorities();
  setPriorityMedium('medium');
  assignedTo.splice(0, assignedTo.length);
  removeClasses();  
}

function filterContactsToAssign(userNameWord){
  clearTimeout(debounceTimeOut);
  debounceTimeOut = setTimeout(() => {
  currentUser = contactsToAssign.filter((user) => user.firstname.toLowerCase().includes(userNameWord.toLowerCase()));
    if (userNameWord.length >= 2) {
      let allMembersRef = document.getElementById("allMembers");
      allMembersRef.innerHTML = '';
      renderContactList(currentUser);
    } else if (userNameWord.length <=2){
      let allMembersRef = document.getElementById("allMembers");
      allMembersRef.innerHTML = '';
      initAddTask();
    }
  }, 300);
}

async function initAddTask() {
  let contacts = await loadContacts();

  // check if user is logged in
  let username = sessionStorage.getItem('loggedInUser');
  if(username){
    console.log("user gefunden");
    let currentUserLoggedIn = await loadUsers();
    let loggedUser = currentUserLoggedIn.find((user)=> user.name === username);
    if(loggedUser){
      const allMembersRef = document.getElementById("allMembers");
      let name = loggedUser.name;
      
      console.log(name);
      let assignedColor = getAvatarColorClass(name);
      allMembersRef.innerHTML += getContactListLoggedInUser(loggedUser, assignedColor);

    }
  }
  renderContactList(contacts);
  contactsToAssign = contacts;
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
    ref.src = "/assets/icons/arrow_drop_down2.png";
  } else {
    ref.src = "/assets/icons/arrow_drop_down.png";
  }
}

function toggleBorderColor(id) {
  let ref = document.getElementById(id);
  if (!ref) return;
  ref.classList.toggle("border-color");
}

async function openAssignedTo() {
  toggleVisibility("allMembers");
  toggleBorderColor("selectMember");
  toggleArrow("arrow");
  
}




function getContact(id) {
  let membersRef = document.getElementById("contact" + id);
  inputRef = membersRef.querySelector("input");
  checkBoxImg = membersRef.querySelector("img");

  if (!inputRef.checked) {
    getInputCheckedTrue(membersRef, inputRef);
  } else if (inputRef.checked && membersRef.classList.contains("assignedBg")) {
    getInputCheckedFalse(membersRef, inputRef);
  }
  toggleAssignment(id);

  let activeUser = assignedTo.find((currentId)=> currentId == id);
 if(activeUser){
  let selectedMember = document.getElementById("selected_name_icon"+id);
    if(!selectedMember){
      getIcon(membersRef, id);
    } 
 }

 if(!activeUser){
  let selectedMember = document.getElementById("selected_name_icon"+id);
  if(selectedMember){
      selectedMember.remove();
    }
 }
}

async function getIcon(membersRef, id){
  let assignedMembersRef = document.getElementById("assignedMembers");
  let mainDiv = membersRef.querySelector("p");
  let assignedColor = mainDiv.classList[1];
  let contacts = await loadContacts();
  let currentSelectedUser = contacts.find((user) => user.id === id);
  if (currentSelectedUser){
  assignedMembersRef.innerHTML += `<p id="selected_name_icon${currentSelectedUser.id}" class="assigned_to_icon ${assignedColor}">${currentSelectedUser.firstname.toUpperCase().charAt(0)}${currentSelectedUser.lastname.toUpperCase().charAt(0)}</p>`;
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

function setCheckBox(id, event) {
  event.stopPropagation(event);
  let membersRef = document.getElementById(id);
  inputRef = membersRef.querySelector("input");
  checkBoxImg = membersRef.querySelector("img");
  if (inputRef.checked) {
    getCheckBoxFalse(id);
  } else if (
    !inputRef.checked &&
    !membersRef.classList.contains("assignedBg")
  ) {
    inputRef.checked = true;
    checkBoxImg.src = "/assets/icons/Check button true.png";
  } else if (!inputRef.checked) {
    inputRef.checked = true;
    checkBoxImg.src = "/assets/icons/Check button true.png";
    checkBoxImg.classList.add("filterChecked");
  }
}

function getInputCheckedFalse(membersRef, inputRef) {
  checkBoxImg = membersRef.querySelector("img");
  inputRef.checked = false;
  checkBoxImg.src = "/assets/icons/Check button.png";
  membersRef.classList.remove("assignedBg");
  checkBoxImg.classList.remove("filterChecked");
}

function getInputCheckedTrue(membersRef, inputRef) {
  checkBoxImg = membersRef.querySelector("img");
  inputRef.checked = true;
  checkBoxImg.src = "/assets/icons/Check button true.png";
  membersRef.classList.add("assignedBg");
  checkBoxImg.classList.add("filterChecked");
}

function getCheckBoxFalse(id) {
  let membersRef = document.getElementById(id);
  inputRef = membersRef.querySelector("input");
  imgRef = membersRef.querySelector("img");
  inputRef.checked = false;
  imgRef.src = "/assets/icons/Check button.png";
  imgRef.classList.remove("filterChecked");
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

function setPriorityUrgent(id) {
  if (!priorityUrgent) {
    resetAllPriorities();
    priorityUrgent = true;
    let urgentRef = document.getElementById(id);
    urgentRef.classList.toggle("priorityUrgentBg");
    addDisplayNone("standardUrgentIcon");
    removeDisplayNone("activeUrgentIcon");
    setPriority = "urgent";
  } else if (priorityUrgent) {
    resetAllPriorities();
  }
}

function setPriorityMedium(id) {
  if (!priorityMedium) {
    resetAllPriorities();
    priorityMedium = true;
    let urgentRef = document.getElementById(id);
    urgentRef.classList.toggle("priorityMediumBg");
    addDisplayNone("standardMediumIcon");
    removeDisplayNone("activeMediumIcon");
    setPriority = "medium";
  } else if (priorityMedium) {
    resetAllPriorities();
  }
}

function setPriorityLow(id) {
  if (!priorityLow) {
    resetAllPriorities();
    priorityLow = true;
    let urgentRef = document.getElementById(id);
    urgentRef.classList.toggle("priorityLowBg");
    addDisplayNone("standardLowIcon");
    removeDisplayNone("activeLowIcon");
    setPriority = "low";
  } else if (priorityLow) {
    resetAllPriorities();
  }
}

function resetAllPriorities() {
  priorityUrgent = false;
  priorityMedium = false;
  priorityLow = false;
  document.getElementById("urgent").classList.remove("priorityUrgentBg");
  removeDisplayNone("standardUrgentIcon");
  addDisplayNone("activeUrgentIcon");
  document.getElementById("medium").classList.remove("priorityMediumBg");
  removeDisplayNone("standardMediumIcon");
  addDisplayNone("activeMediumIcon");
  document.getElementById("low").classList.remove("priorityLowBg");
  removeDisplayNone("standardLowIcon");
  addDisplayNone("activeLowIcon");
}

function removeDisplayNone(id) {
  let ref = document.getElementById(id);
  if (!ref) return;
  ref.classList.remove("d-none");
}

function addDisplayNone(id) {
  let ref = document.getElementById(id);
  if (!ref) return;
  ref.classList.add("d-none");
}

function createTask() {
  checkEmptyTitle();
  checkEmptyDate();
  if (checkTitle && checkDate) {
    closeAddTaskOverlaySuccses();
    postDataToServer(currentStatus);
    currentStatus = 'To do';
    setTimeout(()=>{
      window.location.href= "../html/board.html";
    }, 700);    
  }  
}

async function createTaskBoard() {
  checkEmptyTitle();
  checkEmptyDate();
  if (checkTitle && checkDate) {
    await postDataToServer(currentStatus);
    closeAddTaskOverlaySuccses();
    currentStatus = 'To do';
    loadTasks();
  }
}

function checkEmptyTitle() {
  let titleRef = document.getElementById("title");
  let errorTitleRef = document.getElementById("errorTitle");
  if (!titleRef.value) {
    titleRef.classList.add("inputError");
    errorTitleRef.classList.remove("opacity");
    checkTitle = false;
  } else {
    titleRef.classList.remove("inputError");
    errorTitleRef.classList.add("opacity");
    checkTitle = true;
  }
}

function checkEmptyDate() {
  let dateRef = document.getElementById("date");
  let errorDateRef = document.getElementById("errorDate");
  if (!dateRef.value) {
    dateRef.classList.add("inputError");
    errorDateRef.classList.remove("opacity");
    checkDate = false;
  } else {
    dateRef.classList.remove("inputError");
    errorDateRef.classList.add("opacity");
    checkDate = true;
  }
}

function chooseSubTask(id, icon, cancelOrCheckIcon) {
  let inputRef = document.getElementById(id);
  if (inputRef.value == "") {
    inputRef.value = "";
  } else if (inputRef.value != "") {
    addDisplayNone(icon);
    toggleDisplayNone(cancelOrCheckIcon);
  }
}

function deleteTask() {
  let inputRef = document.getElementById("subTaskInput");
  inputRef.value = "";
  removeDisplayNone("plusIcon");
  toggleDisplayNone("cancelOrCheck");
}

function addTask(id, renderedField, plusIconRef, CancelOrCheckRef) {
  let inputRef = document.getElementById(id);
  let addedTaskRef = document.getElementById(renderedField);

  let newID = generateTimeBasedId();

  addedTaskRef.innerHTML += getSubTasksTemplate(inputRef, newID);
  removeDisplayNone(plusIconRef);
  toggleDisplayNone(CancelOrCheckRef);
  subtasksOpen.push(inputRef.value);
  inputRef.value = "";
}

function addTaskHTML(id, renderedField, plusIconRef, CancelOrCheckRef) {
  let inputRef = document.getElementById(id);
  let addedTaskRef = document.getElementById(renderedField);
  addedTaskRef.innerHTML += subtaskTemplateHTML(inputRef);
  removeDisplayNone(plusIconRef);
  toggleDisplayNone(CancelOrCheckRef);
  subtasksOpen.push(inputRef.value);
  inputRef.value = "";
}

function editTask(id) {
  let inputRef = document.getElementById(id);
  inputField = inputRef.querySelector("input");
  if (inputField.classList[1] == "activeInput") {
    return;
  } else {
    addDisplayNone("editOrTrash" + id);
    toggleDisplayNone("trashOrCheck" + id);
    inputField.classList.add("activeInput");
    let bulletRef = `bullet${id}`;
    toggleDisplayNone(bulletRef);
    let length = inputField.value.length;
    inputField.setSelectionRange(length, length);
    let target = "editOrTrash" + id;
    let hideRef = document.getElementById(target);
    hideRef.classList.add("opacity");
  }
}

function acceptTask(id) {
  toggleDisplayNone("trashOrCheck" + id);
  let target = "editOrTrash" + id;
  let hideRef = document.getElementById(target);
  hideRef.classList.remove("opacity");
  let inputRef = document.getElementById(id);
  inputField = inputRef.querySelector("input");
  inputField.blur();
  inputField.classList.toggle("activeInput");
  let bulletRef = `bullet${id}`;
  toggleDisplayNone(bulletRef);
}

function completeDeleteTask(id) {
  let inputRef = document.getElementById(id);
  inputRef.remove();
}

function addDisplayNone(id) {
  let ref = document.getElementById(id);
  if (!ref) return;
  ref.classList.add("d-nonevip");
}

function removeDisplayNone(id) {
  let ref = document.getElementById(id);
  if (!ref) return;
  ref.classList.remove("d-nonevip");
}

function toggleDisplayNone(id) {
  let ref = document.getElementById(id);
  if (!ref) return;
  ref.classList.toggle("d-nonevip");
}

async function postDataToServer(currentStatus) {
  let title = document.getElementById("title");
  let description = document.getElementById("description");
  let date = document.getElementById("date");
  let priority = setPriority;
  let category = document.getElementById("select"); 

  await postData(`/tasks/`, {
    id: generateTimeBasedId(),
    title: title.value,
    description: description.value,
    date: date.value,
    priority: priority,
    assignedTo: assignedTo,
    category: category.innerText,
    subTasksOpen: subtasksOpen,
    status: currentStatus,
  });
}

async function postData(path, data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responseToJson = await response.json());
}

function getId() {
  return self.crypto.randomUUID();
}

function generateTimeBasedId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

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
  let contact = globalContacts.find(c => c.id === id);
  return contact ? `${contact.firstname} ${contact.lastname}` : "Unbekannt";
}