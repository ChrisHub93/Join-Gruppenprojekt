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

function createTask() {
  checkEmptyTitle();
  checkEmptyDate();
  checkEmptyCategory();
  if (checkTitle && checkDate && checkCategory) {
    disableButtons();
    closeAddTaskOverlaySuccses();
    postDataToServer(currentStatus);
    currentStatus = "To do";
    setTimeout(() => {
      window.location.href = "../html/board.html";
    }, 700);
  }
}

async function createTaskBoard() {
  checkEmptyTitle();
  checkEmptyDate();
  checkEmptyCategory();
  if (checkTitle && checkDate && checkCategory) {
    await postDataToServer(currentStatus);
    disableButtons();
    closeAddTaskOverlaySuccses();
    currentStatus = "To do";
    setTimeout(() => {
      loadTasks();
      enableButtons();
    }, 700);
  }
}

function chooseSubTask(id, icon, cancelOrCheckIcon) {
  let inputRef = document.getElementById(id);
  let trimmedInputValue = inputRef.value.trim();
  if (trimmedInputValue == "") {
    inputRef.value = "";
    addDisplayNone(cancelOrCheckIcon);
    removeDisplayNone(icon);
  } else if (inputRef.value != "") {
    addDisplayNone(icon);
    removeDisplayNone(cancelOrCheckIcon);
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
  let inputRef = document.getElementById(`subtask_${id}`);
  inputField = inputRef.querySelector("input");
  if (inputField.classList.contains("activeInput")) return;
  addDisplayNone(`editOrTrash_${id}`);
  toggleDisplayNone(`trashOrCheck_${id}`);
  inputField.classList.add("activeInput");
  toggleDisplayNone(`bullet_${id}`);
  let length = inputField.value.length;
  inputField.setSelectionRange(length, length);
  let hideRef = document.getElementById(`editOrTrash_${id}`);
  hideRef.classList.add("opacity");
}

function acceptTask(id, valueId) {
  const editTaksValue = document.getElementById(valueId).value.trim();
  if (editTaksValue === "") return;
  toggleDisplayNone(`trashOrCheck_${id}`);
  let hideRef = document.getElementById(`editOrTrash_${id}`);
  hideRef.classList.remove("opacity");
  let inputRef = document.getElementById(`subtask_${id}`);
  inputField = inputRef.querySelector("input");
  inputField.blur();
  inputField.classList.toggle("activeInput");
  toggleDisplayNone(`bullet_${id}`);
}

function completeDeleteTask(id) {
  let inputRef = document.getElementById(id);
  if (inputRef) inputRef.remove();
}