/**
 * Switches from the task detail overlay to the task edit overlay for the given task.
 * 
 * It locates the task by ID in the `todos` array, hides the task view overlay,
 * shows the edit overlay, renders the edit form for the selected task, and
 * checks whether the current date is up to date.
 * 
 * @param {number} taskID - ID of the task to be edited
 */
function editOverlayTask(taskID) {
  taskOverlaySync();
  let tasksEditRef = searchElement(taskID);
  let addOverlayRef = document.getElementById("overlayTask");
  let addOverlayEditRef = document.getElementById("overlayTaskEdit");
  let dialogTaskEditRef = document.getElementById("dialogTaskEditContent");
  addOverlayRef.classList.remove("active");
  addOverlayEditRef.classList.add("active");
  dialogTaskEditRef.innerHTML = renderOverlayTaskEdit(todos[tasksEditRef]);
  upToDateEdit();
}

/**
 * Initializes the contact list in the edit task overlay.
 * 
 * Loads all contacts from the server, renders them into the edit view,
 * copies the provided assigned contacts into a temporary array for editing,
 * and updates the displayed assigned contacts.
 * 
 * @param {Array} assignedTo - Array of user IDs assigned to the task
 */
async function initEditContacts(assignedTo = []) {
  let contacts = await loadContacts();
  renderContactListEdit(contacts, assignedTo);
  assignedToEditTemp = [...assignedTo];
  updateAssignedMembersEdit(assignedToEditTemp);
  document.body.overflow = "hidden";
}

/**
 * Updates the task data when the "OK" button is pressed in the edit overlay.
 * 
 * If required input fields are missing, the function exits early.
 * 
 * It loads all tasks from the server, locates the task by ID, determines the selected priority,
 * builds a new task data object, sends the updated task to the server, reloads the task list,
 * and displays the updated task in the detail view.
 * 
 * @param {*} taskID - ID of the task to be edited
 * @returns {void}
 */
async function updateDataEdit(taskID) {
  if (!checkEditInputFields()) return;

  let tasks = await fetchData("/tasks/");
  let taskKeyEdit = Object.keys(tasks).find(
    (k) => String(tasks[k].id) === String(taskID)
  );
  let prioButton = document.querySelector(".prio_edit_button.active");
  let priorityEdit = prioButton.dataset.prio;
  let data = dataEditObject(tasks, taskKeyEdit, priorityEdit);

  await putDataEdit(`/tasks/${taskKeyEdit}`, data);
  await loadTasks();
  overlayTask(data.id);
}

/**
 * Builds a new task object from the current form input and existing task data.
 * 
 * @param {Object<string, Object>} tasks - All tasks from the server, keyed by database ID
 * @param {string} taskKeyEdit - The database key (Firebase ID) of the task to be edited
 * @param {string} priorityEdit - The new priority (e.g., "medium")
 * @returns {Object} The updated task object to be sent to the server
 */
function dataEditObject(tasks, taskKeyEdit, priorityEdit) {
  return {
    id: tasks[taskKeyEdit].id,
    category: tasks[taskKeyEdit].category,
    title: document.getElementById("titleEdit").value,
    description: document.getElementById("descriptionEdit").value,
    date: document.getElementById("dateEdit").value,
    priority: priorityEdit,
    assignedTo: assignedToEditTemp,
    subTasksOpen: getUpdatedSubtasks(),
    subTasksClosed: tasks[taskKeyEdit].subTasksClosed,
    status: tasks[taskKeyEdit].status,
  };
}

/**
 * Checks whether the required title and date input fields are filled.
 * 
 * @returns {boolean} - Returns true if both title and date have values; otherwise false
 */
function checkEditInputFields() {
  let titleValue = document.getElementById("titleEdit").value.trim();
  let dateValue = document.getElementById("dateEdit").value.trim();

  if (titleValue === "" || dateValue === "") {
    return false;
  } else {
    return true;
  }
}

/**
 * Sends data to the server using a PUT request.
 * Overwrites the resource at the given path with the provided data.
 * 
 * @param {string} path - The relative path to the resource (e.g., "tasks/abc123")
 * @param {object} data - The full data object to be stored at the specified location
 * @returns {Promise<object>} The server's response as a parsed JSON object
 */
async function putDataEdit(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}


/**
 * Replaces a subtask list item with an input field for editing.
 * 
 * Locates the surrounding <ul> element of the clicked icon, extracts the current subtask text,
 * replaces the list with an editable input container, and focuses the input for immediate editing.
 * 
 * @param {HTMLElement} iconElement - The element (e.g., pencil icon) that was clicked
 * @param {string|number} id - The ID of the subtask to be edited
 */
function editSubtask(iconElement, id) {
  let ul = iconElement.closest("ul");
  let currentText = ul.querySelector("p").innerText;
  let newContainer = document.createElement("div");

  newContainer.classList.add("subtask_edit_wrapper");
  newContainer.id = `edit-subtask-${id}`;
  newContainer.innerHTML = getEditSubtaskContainer(currentText, id);
  ul.replaceWith(newContainer);
  let inputActive = newContainer.querySelector("input");
  inputActive.focus();
  inputActive.setSelectionRange(
    inputActive.value.length,
    inputActive.value.length
  );
}

/**
 * Toggles the visibility of the list of assignable users in the edit task view.
 * 
 * When the list is shown, it updates the border color of the selection container
 * and rotates the dropdown arrow icon. It also initializes the contact list and
 * adds a click listener to detect clicks outside the container.
 */
function openAssignedToEdit() {
  let editMembers = document.getElementById("editMembers");

  let editIsVisible = editMembers.classList.toggle("show");

  toggleBorderColor("selectMember", editIsVisible ? "add" : "remove");
  toggleArrow("arrow", editIsVisible ? "open" : "close");

  initEditContacts(assignedToEditTemp);

  if (editIsVisible) {
    setTimeout(() => {
      document.addEventListener("click", handleClickOutsideEditContacts);
    }, 0);
  }
}

/**
 * Closes the dropdown menu for editing assigned members when clicking outside of it.
 * 
 * Also resets the border styling and arrow direction.
 * 
 * @param {MouseEvent} event - The click event that triggered the handler
 */
function handleClickOutsideEditContacts(event) {
  let editMembers = document.getElementById("editMembers");
  let input = document.getElementById("contactSearchInputEdit");
  let arrow = document.getElementById("arrow");

  if (
    !editMembers.contains(event.target) &&
    !input.contains(event.target) &&
    !arrow.contains(event.target)
  ) {
    editMembers.classList.remove("show");
    toggleBorderColor("selectMember", "remove");
    toggleArrow("arrow", "close");
    document.removeEventListener("click", handleClickOutsideEditContacts);
  }
}


/**
 * Renders the list of contacts and highlights those who are assigned to the task.
 * 
 * @param {Array} contacts - List of all available contacts
 * @param {Array} assignedTo - List of contacts currently assigned to the task
 */
function renderContactListEdit(contacts, assignedTo = []) {
  let editMembersRef = document.getElementById("editMembers");
  editMembersRef.innerHTML = "";

  if (contacts) {
    for (let contact of contacts) {
      let name = contact.firstname + " " + contact.lastname;
      let assignedColor = getAvatarColorClass(name);
      let isAssigned = assignedTo.includes(contact.id);
      editMembersRef.innerHTML += getContactListEdit(
        contact,
        assignedColor,
        isAssigned
      );
    }
  }
}

/**
 * Filters the contact list in the edit view based on the search input.
 * 
 * Only contacts whose names match the input string will be displayed.
 */
function filterEditContactList() {
  let input = document
    .getElementById("contactSearchInputEdit")
    .value.toLowerCase();
  let editMembersRef = document.getElementById("editMembers");
  let editMembersListItem = editMembersRef.querySelectorAll("li");

  editMembersListItem.forEach((item) => {
    let text = item.textContent.toLowerCase();
    item.style.display = text.includes(input) ? "flex" : "none";
  });
}

/**
 * Updates the avatar display for the assigned contacts in the edit view.
 * 
 * If the container element 'assignedMembersEdit' does not exist, the function returns early.
 * Otherwise, it clears the container, renders up to five visible avatars,
 * and adds an overflow icon if more than five contacts are assigned.
 * 
 * @param {Array} assignedTo - List of contacts currently assigned to the task
 * @returns {void}
 */
async function updateAssignedMembersEdit(assignedTo) {
  const container = document.getElementById("assignedMembersEdit");
  if (!container) return;

  container.innerHTML = "";

  const contacts = await loadContacts();
  const visibleCount = 5;

  renderVisibleAvatars(container, contacts, assignedTo, visibleCount);

  if (assignedTo.length > visibleCount) {
    renderOverflowIcon(container, assignedTo, visibleCount);
  }
}

/**
 * Renders up to a given number of avatar icons into the specified container.
 * 
 * @param {HTMLElement} container - The DOM element where the avatars will be rendered
 * @param {Array} contacts - List of all available contact objects
 * @param {Array} assignedTo - List of contact IDs currently assigned to the task
 * @param {number} count - Maximum number of avatars to display
 */
function renderVisibleAvatars(container, contacts, assignedTo, count) {
  assignedTo.slice(0, count).forEach((id) => {
    const user = contacts.find((c) => c.id === id);
    if (!user) return;

    const icon = createUserIcon(user);
    container.appendChild(icon);
  });
}

/**
 * Renders the overflow icon (e.g., "+3") indicating how many assigned users are not shown.
 * 
 * The number displayed depends on how many users exceed the visible avatar limit.
 * 
 * @param {HTMLElement} container - The DOM element where the avatar icons are rendered
 * @param {Array} assignedTo - List of contact IDs currently assigned to the task
 * @param {number} startIndex - Number of avatars already displayed
 * @returns {void}
 */
function renderOverflowIcon(container, assignedTo, startIndex) {
  const remaining = assignedTo.length - startIndex;
  if (remaining <= 0) return;

  const plusWrapper = document.createElement("div");
  plusWrapper.classList.add("plusWrapperEdit");

  const plusIcon = document.createElement("p");
  plusIcon.className = "assignedPlusOneEdit";
  plusIcon.textContent = `+${remaining}`;

  plusWrapper.appendChild(plusIcon);
  container.appendChild(plusWrapper);
}

/**
 * Creates a user icon element with the initials of the user's first and last name.
 * The icon gets a background color class based on the user's full name.
 * 
 * @param {object} user - User data object containing at least `firstname` and `lastname`
 * @returns {HTMLElement} - Returns a <p> element containing the user's initials
 */
function createUserIcon(user) {
  const initials = `${user.firstname[0].toUpperCase()}${user.lastname[0].toUpperCase()}`;
  const icon = document.createElement("p");
  const colorClass = getAvatarColorClass(`${user.firstname} ${user.lastname}`);

  icon.className = `assigned_to_icon ${colorClass}`;
  icon.textContent = initials;

  return icon;
}

/**
 * Handles the selection state of a contact in the edit view.
 * 
 * Checks if the contact is already assigned. If not, it marks the contact as selected;
 * otherwise, it unselects it. Updates the UI and assigned contact list accordingly.
 * 
 * @param {string} id - ID of the contact
 */
function getContactEdit(id) {
  let membersRef = document.getElementById("contactEdit" + id);
  let inputRef = document.getElementById("checkboxEdit" + id);
  let checkBoxImg = document.getElementById("checkBoxImgEdit" + id);

  if (!inputRef.checked) {
    getInputCheckedTrue(membersRef, inputRef, checkBoxImg);
  } else if (inputRef.checked && membersRef.classList.contains("assignedBg")) {
    getInputCheckedFalse(membersRef, inputRef, checkBoxImg);
  }
  toggleAssignmentEdit(id);
  initEditContacts(assignedToEditTemp);
}

/**
 * Toggles the assignment state of a contact in the temporary assignment list.
 * 
 * If the contact ID is already in the list, it will be removed.
 * Otherwise, it will be added to the list.
 * 
 * @param {string} id - ID of the contact
 */
function toggleAssignmentEdit(id) {
  let index = assignedToEditTemp.indexOf(id);
  if (index !== -1) {
    assignedToEditTemp.splice(index, 1);
  } else {
    assignedToEditTemp.push(id);
  }
}

/**
 * Validates whether the date input field has a value.
 * 
 * If empty, it adds an error style and displays an error message.
 * Otherwise, it removes the error style and hides the message.
 * 
 * Also updates the global variable `checkDate` accordingly.
 */
function checkEmptyDateEdit() {
  let dateRef = document.getElementById("dateEdit");
  let errorDateRef = document.getElementById("errorDateEdit");
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

/**
 * Sets the minimum selectable date for the date input field to today.
 * 
 * Prevents users from selecting a past date.
 */
function upToDateEdit() {
  let dateInput = document.getElementById("dateEdit");
  dateInput.min = getTodayStr();
}

/**
 * Toggles the active state of priority buttons within the same container.
 * 
 * Deactivates all priority buttons first by removing the "active" class and resetting their icons.
 * If the clicked button was not already active, it becomes active and its icon is updated.
 * 
 * @param {HTMLElement} clickedButton - The button element that was clicked.
 */
function setPrioActive(clickedButton) {
  let prioButtons =
    clickedButton.parentElement.querySelectorAll(".prio_edit_button");
  let prioButtonClicked = clickedButton.classList.contains("active");
  prioButtons.forEach((btn) => {
    btn.classList.remove("active");
    let prio = btn.dataset.prio;
    let icon = btn.querySelector("img");
    icon.src = `../assets/icons/priority-${prio}.png`;
  });
  if (!prioButtonClicked) {
    clickedButton.classList.add("active");
    let prio = clickedButton.dataset.prio;
    let icon = clickedButton.querySelector("img");
    icon.src = `../assets/icons/priority-clicked-${prio}.png`;
  }
}