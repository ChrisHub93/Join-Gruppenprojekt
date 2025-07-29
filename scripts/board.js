let loadTodos = [];
let todos = [];
let globalContacts = [];
let isToggling = false;

/**
 * Renders the empty task template in all status columns if no tasks exist.
 *
 * @param {HTMLElement} toDoContentRef - DOM element for the "To Do" column
 * @param {HTMLElement} inProgressContentRef - DOM element for the "In Progress" column
 * @param {HTMLElement} awaitFeedbackContentRef - DOM element for the "Await Feedback" column
 * @param {HTMLElement} doneContentRef - DOM element for the "Done" column
 * @returns {void}
 */
function renderEmptyTemplatesForAllColumns(
  toDoContentRef,
  inProgressContentRef,
  awaitFeedbackContentRef,
  doneContentRef
) {
  toDoContentRef.innerHTML = getEmptyTemplate();
  inProgressContentRef.innerHTML = getEmptyTemplate();
  awaitFeedbackContentRef.innerHTML = getEmptyTemplate();
  doneContentRef.innerHTML = getEmptyTemplate();
}

/**
 * Clears the inner HTML of all task board status columns.
 *
 * @param {HTMLElement} toDoContentRef - DOM element for the "To Do" column
 * @param {HTMLElement} inProgressContentRef - DOM element for the "In Progress" column
 * @param {HTMLElement} awaitFeedbackContentRef - DOM element for the "Await Feedback" column
 * @param {HTMLElement} doneContentRef - DOM element for the "Done" column
 * @returns {void}
 */
function clearAllTaskColumns(
  toDoContentRef,
  inProgressContentRef,
  awaitFeedbackContentRef,
  doneContentRef
) {
  toDoContentRef.innerHTML = "";
  inProgressContentRef.innerHTML = "";
  awaitFeedbackContentRef.innerHTML = "";
  doneContentRef.innerHTML = "";
}

/**
 * Loads all tasks from the server and renders them into the respective status columns.
 * 
 * If no tasks exist, empty task templates will be rendered instead.
 * Also loads all contacts and stores them in the global `globalContacts` array.
 * 
 * @returns {void}
 */
async function loadTasks() {
  let columns = getTaskColumns();
  const tasks = await fetchData("/tasks/");
  if (!tasks) {
    renderEmptyTemplatesForAllColumns(...Object.values(columns));
    return;
  }
  loadTodos = Object.values(tasks);
  addEmptySubtasks();
  await loadGlobalContacts();
  let filteredTask = filteredTasksByStatus(loadTodos)
  clearAllTaskColumns(...Object.values(columns));
  checkAllStatus(
    filteredTask["To do"], columns.toDo,
    filteredTask["In progress"], columns.inProgress,
    filteredTask["Await feedback"], columns.awaitFeedback,
    filteredTask["Done"], columns.done);
}

/**
 * function to declare our four columns
 * 
 * @returns {Object} - of our task columns
 */
function getTaskColumns() {
  return {
    toDo: document.getElementById("toDoContent"),
    inProgress: document.getElementById("inProgressContent"),
    awaitFeedback: document.getElementById("awaitFeedbackContent"),
    done: document.getElementById("doneContent"),
  };
}

/**
 * function to load contact data and save it to globalContacts
 */
async function loadGlobalContacts() {
  let contacts = await fetchData("/contacts/");
  globalContacts = Object.values(contacts);
}

/**
 * function to filter the tasks based on status
 * 
 * @param {Object[]} tasks - array of tasks objects
 * @returns 
 */
function filteredTasksByStatus(tasks) {
  return {
    "To do": tasks.filter(t => t.status === "To do"),
    "In progress": tasks.filter(t => t.status === "In progress"),
    "Await feedback": tasks.filter(t => t.status === "Await feedback"),
    "Done": tasks.filter(t => t.status === "Done"),
  };
}

/**
 * Renders the progress bar for a task's subtasks.
 * 
 * If no subtasks exist, the progress bar container will be hidden.
 * 
 * @param {object} element - Task object element
 */
function calculateAndRenderProgressBar(element) {
  let percent = 0;
  let tasksOpenLength = element.subTasksOpen?.length ?? 0;
  let tasksClosedLength = element.subTasksClosed?.length ?? 0;
  let tasksLength = tasksOpenLength + tasksClosedLength;
  if (tasksLength === 0) {
    document.getElementById(
      "filledContainer-status" + element.id
    ).style.display = "none";
  } else {
    renderProgressBar(percent, tasksClosedLength, tasksLength, element);
  }
}

/**
 * Renders the progress bar UI for a given task.
 * 
 * It sets the width of the progress bar and updates the displayed number
 * of completed and total subtasks.
 *
 * @param {number} tasksClosedLength - Number of completed subtasks
 * @param {number} tasksLength - Total number of subtasks
 * @param {object} element - Task object containing an `id` property
 * @returns {void}
 */
function renderProgressBar(percent, tasksClosedLength, tasksLength, element) {
  percent = Math.round((tasksClosedLength / tasksLength) * 100);
    document.getElementById(
      "status-bar-js" + element.id
    ).style = `width: ${percent}%`;
    document.getElementById(
      "status-bar-number1" + element.id
    ).innerText = `${tasksClosedLength}`;
    document.getElementById(
      "status-bar-number2" + element.id
    ).innerText = `${tasksLength}`;
}
/**
 * Deletes a task from the board by its task ID.
 * 
 * Fetches all tasks, finds the matching task key by ID, deletes it from the server,
 * then triggers UI updates by closing the overlay and reloading tasks.
 * 
 * @param {number} tasksRef - The ID of the task to delete
 * @returns {Promise<void>} Resolves when the deletion and UI updates are complete
 */
async function deleteBoardTasks(tasksRef) {
  let tasks = await fetchData("/tasks/");
  let key = Object.keys(tasks).find(
    (key) => String(tasks[key].id) === tasksRef
  );
  await deleteTasks("/tasks/", key);
  deleteOverlaySuccses();
  loadTasks();
}

/**
 * Sends a DELETE request to remove a task by its key from the server.
 * 
 * @param {string} path - The base API path (e.g., "/tasks/")
 * @param {string} key - The server key of the task to delete
 * @returns {Promise<object>} The parsed JSON response from the server
 */
async function deleteTasks(path, key) {
  let response = await fetch(BASE_URL + path + key + ".json", {
    method: "DELETE",
  });
  return await response.json();
}

/**
 * Shows a delete success overlay for 0.8 seconds.
 * 
 * Removes the hidden class from the delete overlay and displays the success message,
 * then hides the overlay and message again after 800 milliseconds.
 * Also resets the document body's overflow style.
 * 
 * @returns {void}
 */
function deleteOverlaySuccses() {
  const addOverlayRef = document.getElementById("overlayDeleteTask");
  addOverlayRef.classList.remove("d-nonevip");

  document.getElementById("deleteSuccesMessage").style.display = "flex";
  setTimeout(() => {
    document.body.style.overflow = "";
    addOverlayRef.classList.add("d-nonevip");
    document.getElementById("deleteSuccesMessage").style.display = "none";
  }, 800);
}

/**
 * Opens the task overlay for the given task element.
 * 
 * It finds the task index by searching for the element,
 * then switches the UI by hiding the edit overlay (if open),
 * showing the task overlay, rendering the task content,
 * and disabling page scroll. If no overlay was previously open,
 * it triggers the slide-in animation for the overlay.
 * 
 * @param {number} ID - ID of the task to display
 * @returns {void}
 */
function overlayTask(ID) {
  let tasksRef = searchElement(ID);
  let { addOverlayTaskRef, dialogTaskContentRef, addOverlayEditRef } =
    getOverlayElements();
  let checkOpenOverlayEdit = addOverlayEditRef.classList.contains("active");
  let checkOpenOverlay = addOverlayTaskRef.classList.contains("active");
  addOverlayEditRef.classList.remove("active");
  addOverlayTaskRef.classList.add("active");
  dialogTaskContentRef.innerHTML = renderOverlayTaskContent(todos[tasksRef]);
  disableScroll();
  if (!checkOpenOverlay && !checkOpenOverlayEdit) {
    overlaySlide(dialogTaskContentRef);
  }
}

/**
 * Searches for the index of the task with the given ID in the todos array.
 * If no matching ID is found, logs an error and returns undefined.
 * 
 * @param {number} id - ID of the task to search for.
 * @returns {number|undefined} - Index of the task in the todos array, or undefined if not found.
 */
function searchElement(id) {
  const index = todos.findIndex((task) => task.id == id);
  if (index === -1) {
    console.error("Task mit ID nicht gefunden:", id);
    return;
  }
  return index;
}

/**
 * Generates the HTML for a priority button based on its name and active state.
 *
 * Converts the priority name to lowercase to match asset paths and checks if it is the currently active priority.
 * Builds appropriate icon paths for normal and clicked states.
 *
 * @param {string} prioName - The name of the priority (e.g., "High", "Medium", "Low").
 * @param {string} activePrio - The currently selected priority name to determine active state.
 * @returns {string} - The HTML string for the priority button, generated by `prioButtonTemplate`.
 */
function renderPrioButton(prioName, activePrio) {
  let prioGet = prioName.toLowerCase();
  let isActive = prioGet === activePrio.toLowerCase();
  let prioFullName = prioName.charAt(0).toUpperCase() + prioName.slice(1);
  let iconPath = `../assets/icons/priority-${prioGet}.png`;
  let iconPathClicked = `../assets/icons/priority-clicked-${prioGet}.png`;
  return prioButtonTemplate(
    prioFullName,
    prioGet,
    isActive,
    iconPath,
    iconPathClicked
  );
}

/**
 * Formats a date string from `YYYY-MM-DD` to `DD/MM/YYYY` for display.
 * 
 * If the input already contains a `/`, it is returned unchanged (assumed to be already formatted).
 * If the input is empty or undefined, it returns an empty string.
 * 
 * @param {string} dateStr - The date string in `YYYY-MM-DD` format.
 * @returns {string} - The formatted date string in `DD/MM/YYYY` format or unchanged if already formatted.
 */
function formatDateToDisplay(dateStr) {
  if (!dateStr) return "";

  if (dateStr.includes("/")) {
    return dateStr;
  }
  let [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

/**
 * Loads data from the given path on the server.
 * 
 * @param {string} path - The relative path to the resource (e.g., "users")
 * @returns - A promise that resolves to the parsed JSON data
 */
async function loadData(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseToJson = await response.json();
  return responseToJson;
}

/**
 * Renders a list of assigned member avatars with initials and color coding.
 * Shows up to 5 avatars with overlapping style and a "+X" overflow indicator if more members exist.
 * If the assignedToIds array is empty or not provided, renders a placeholder for unassigned tasks.
 * 
 * @param {Array<string>} assignedToIds - Array of contact IDs assigned to the task
 * @returns {string} - HTML string representing the assigned members avatars and overflow icon
 */
function renderAssignedTo(assignedToIds) {
  if (!assignedToIds || assignedToIds.length === 0) {
    return renderUnassigned();
  }
  const MAX_VISIBLE = 5;
  const visibleIds = assignedToIds.slice(0, MAX_VISIBLE);
  const extraCount = assignedToIds.length - MAX_VISIBLE;
  let html = visibleIds
    .map((id, index) => renderAssignedIcon(id, index * 24))
    .join("");

  let extra = extraCount > 0 ? plusMembers(MAX_VISIBLE * 24, extraCount) : "";

  return html + extra;
}

/**
 * function to render an icon element based on the contact id
 *
 * @param {string} id - contact id
 * @param {number} offset - left space for the next icon
 * @returns {string} - HTML for the icon element
 */
function renderAssignedIcon(id, offset) {
  const contact = globalContacts.find(c => c.id === id);
  if (!contact) return "";
  const name = `${contact.firstname} ${contact.lastname}`;
  const initials = getInitials(name);
  const colorClass = getAvatarColorClass(name);
  return assignedMembersTemplate(colorClass, offset, initials);
}

/**
 * Disables page scrolling by adding the "no-scroll" CSS class
 * to the <body> and <html> elements.
 * 
 * Typically used to prevent background scroll when overlays or modals are open.
 * 
 * @returns {void}
 */
function disableScroll() {
  document.body.classList.add("no-scroll");
  document.documentElement.classList.add("no-scroll");
}

/**
 * Enables page scrolling by removing the "no-scroll" CSS class
 * from the <body> and <html> elements.
 * 
 * Typically used to restore scroll functionality after an overlay or modal is closed.
 * 
 * @returns {void}
 */
function enableScroll() {
  document.body.classList.remove("no-scroll");
  document.documentElement.classList.remove("no-scroll");
}
