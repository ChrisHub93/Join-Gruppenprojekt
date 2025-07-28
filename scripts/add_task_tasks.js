/**
 * Opens the task category dropdown and sets the placeholder text.
 */
function openTaskCategory() {
  toggleVisibility("allOptions");
  let selectRef = document.getElementById("select");
  selectRef.innerText = `Select task category`;
  toggleArrow("arrowCategory");
}

/**
 * Closes the task category dropdown and toggles the arrow icon.
 */
function closeTaskCategory() {
  toggleVisibility("allOptions");
  toggleArrow("arrowCategory");
}

/**
 * Initializes the Add Task view by loading contacts and rendering the current user.
 */
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

/**
 * Creates a new task, validates fields, disables UI, and redirects to board.
 */
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

/**
 * Creates a new task directly on the board, validates fields, and updates UI.
 */
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

/**
 * Handles subtask input behavior for icon visibility depending on content.
 * @param {string} id - The ID of the input field.
 * @param {string} icon - The ID of the default icon.
 * @param {string} cancelOrCheckIcon - The ID of the cancel/check icon group.
 */
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

/**
 * Deletes a pending subtask input and resets icon visibility.
 */
function deleteTask() {
  let inputRef = document.getElementById("subTaskInput");
  inputRef.value = "";
  removeDisplayNone("plusIcon");
  toggleDisplayNone("cancelOrCheck");
}

/**
 * Adds a new subtask, renders its HTML, updates icons and clears input.
 * @param {string} id - The ID of the input field.
 * @param {string} renderedField - The ID of the container to append HTML.
 * @param {string} plusIconRef - The ID of the plus icon to show.
 * @param {string} CancelOrCheckRef - The ID of the cancel/check icon to hide.
 */
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

/**
 * Adds a subtask using a predefined HTML template function.
 * @param {string} id - The ID of the input element.
 * @param {string} renderedField - The ID of the HTML container to render into.
 * @param {string} plusIconRef - The ID of the plus icon.
 * @param {string} CancelOrCheckRef - The ID of the cancel/check icons.
 */
function addTaskHTML(id, renderedField, plusIconRef, CancelOrCheckRef) {
  let inputRef = document.getElementById(id);
  let addedTaskRef = document.getElementById(renderedField);
  addedTaskRef.innerHTML += subtaskTemplateHTML(inputRef);
  removeDisplayNone(plusIconRef);
  toggleDisplayNone(CancelOrCheckRef);
  subtasksOpen.push(inputRef.value);
  inputRef.value = "";
}

/**
 * Enables subtask editing by toggling input and visibility of controls.
 * @param {string|number} id - The subtask's unique identifier.
 */
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

/**
 * Accepts and saves subtask changes if not empty, updates display.
 * @param {string|number} id - The subtask's identifier.
 * @param {string} valueId - The ID of the input element holding the value.
 */
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

/**
 * Completely deletes a subtask element from the DOM.
 * @param {string} id - The ID of the subtask element to delete.
 */
function completeDeleteTask(id) {
  let inputRef = document.getElementById(id);
  if (inputRef) inputRef.remove();
}