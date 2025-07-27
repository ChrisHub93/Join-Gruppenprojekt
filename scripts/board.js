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
  const toDo = document.getElementById("toDoContent");
  const inProgress = document.getElementById("inProgressContent");
  const awaitFeedback = document.getElementById("awaitFeedbackContent");
  const done = document.getElementById("doneContent");

  const tasks = await fetchData("/tasks/");
  if (!tasks) {
    renderEmptyTemplatesForAllColumns(toDo, inProgress, awaitFeedback, done);
    return;
  }

  loadTodos = Object.values(tasks);
  addEmptySubtasks();

  const contacts = await fetchData("/contacts/");
  globalContacts = Object.values(contacts);

  const toDoTasks = loadTodos.filter(t => t.status === "To do");
  const inProgressTasks = loadTodos.filter(t => t.status === "In progress");
  const awaitFeedbackTasks = loadTodos.filter(t => t.status === "Await feedback");
  const doneTasks = loadTodos.filter(t => t.status === "Done");

  clearAllTaskColumns(toDo, inProgress, awaitFeedback, done);
  checkAllStatus(toDoTasks, toDo, inProgressTasks, inProgress, awaitFeedbackTasks, awaitFeedback, doneTasks, done);
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
 * Retrieves references to the main overlay elements in the DOM.
 *
 * @returns {Object} An object containing references to overlay-related DOM elements:
 *  - {HTMLElement|null} addOverlayTaskRef - The task overlay container element.
 *  - {HTMLElement|null} dialogTaskContentRef - The content container for the task overlay.
 *  - {HTMLElement|null} addOverlayEditRef - The edit task overlay container element.
 *  - {HTMLElement|null} dialogTaskEditContent - The content container for the edit task overlay.
 */
function getOverlayElements() {
  return {
    addOverlayTaskRef: document.getElementById("overlayTask"),
    dialogTaskContentRef: document.getElementById("dialogTaskContent"),
    addOverlayEditRef: document.getElementById("overlayTaskEdit"),
    dialogTaskEditContent: document.getElementById("dialogTaskEditContent"),
  };
}

/**
 * Animates the given element by sliding it in from the right and fading it in.
 *
 * @param {HTMLElement} element - The DOM element to animate.
 */
function overlaySlide(element) {
  element.style.transform = "translateX(100%)";
  element.style.opacity = "0";
  requestAnimationFrame(() => {
    element.style.transform = "translateX(0)";
    element.style.opacity = "1";
  });
}

/**
 * Handles closing of task or edit overlays when the user clicks outside the content area
 * or on specific close/delete elements.
 *
 *@param {MouseEvent} event - The click event that triggered the handler
 */
function closeOverlay(event) {
  let {
    addOverlayTaskRef,
    dialogTaskContentRef,
    addOverlayEditRef,
    dialogTaskEditContent,
  } = getOverlayElements();
  if (
    event.target === addOverlayTaskRef ||
    event.target.closest("#overlayTask .closeIcon") ||
    event.target.closest(".delete_task")
  ) {
    closeOverlayAnimation(dialogTaskContentRef, addOverlayTaskRef);
  } else if (
    event.target === addOverlayEditRef ||
    event.target.closest("#overlayTaskEdit .closeIcon")
  ) {
    closeOverlayAnimation(dialogTaskEditContent, addOverlayEditRef);
  }
}

/**
 * Animates the closing of an overlay by sliding it out to the right and fading it out.
 * After the animation (300ms), it removes the "active" class from the overlay and resets styles.
 *
 * @param {HTMLElement} contentRef - The DOM element containing the overlay content.
 * @param {HTMLElement} overlayRef - The overlay container element to hide.
 */
function closeOverlayAnimation(contentRef, overlayRef) {
  contentRef.style.transform = "translateX(100%)";
  contentRef.style.opacity = "0";
  setTimeout(() => {
    overlayRef.classList.remove("active");
    contentRef.style.transform = "";
    contentRef.style.opacity = "";
  }, 300);
}

/**
 * Synchronizes the height of the task edit overlay with the height of the task view overlay.
 * 
 * Ensures a consistent layout when switching between view and edit mode.
 */
function taskOverlaySync() {
  let dialogTaskContentRef = document.getElementById("dialogTaskContent");
  let dialogTaskEditContentRef = document.getElementById(
    "dialogTaskEditContent"
  );
  if (dialogTaskContentRef && dialogTaskEditContentRef) {
    dialogTaskEditContentRef.style.height =
      dialogTaskContentRef.offsetHeight + "px";
  }
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

function formatDateToDisplay(dateStr) {
  if (!dateStr) return "";

  if (dateStr.includes("/")) {
    return dateStr;
  }
  let [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

async function loadData(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseToJson = await response.json();
  return responseToJson;
}

function filterTasks() {
  let searchInput = document
    .getElementById("filterTasks")
    .value.trim()
    .toLowerCase();
  let filteredTask = todos
    .slice(0)
    .filter(
      (todos) =>
        todos.title.toLowerCase().includes(searchInput) ||
        todos.description.toLowerCase().includes(searchInput)
    );
  todos = filteredTask;
  loadSearch(todos);
}

function clearAllDocuments() {
  document.getElementById("toDoContent").innerHTML = "";
  document.getElementById("inProgressContent").innerHTML = "";
  document.getElementById("awaitFeedbackContent").innerHTML = "";
  document.getElementById("doneContent").innerHTML = "";
}

function loadSearch(todos) {
  let searchInput = document.getElementById("filterTasks").value;
  if (searchInput === "") {
    loadTasks();
    return;
  }
  let toDoContentRef = document.getElementById("toDoContent");
  let inProgressContentRef = document.getElementById("inProgressContent");
  let awaitFeedbackContentRef = document.getElementById("awaitFeedbackContent");
  let doneContentRef = document.getElementById("doneContent");
  let statusToDo = todos.filter((task) => task.status === "To do");
  let statusInProgress = todos.filter((task) => task.status === "In progress");
  let statusAwaitFeedback = todos.filter(
    (task) => task.status === "Await feedback"
  );
  let statusDone = todos.filter((task) => task.status === "Done");
  clearAllDocuments();
  renderStatus(statusToDo, toDoContentRef);
  renderStatus(statusInProgress, inProgressContentRef);
  renderStatus(statusAwaitFeedback, awaitFeedbackContentRef);
  renderStatus(statusDone, doneContentRef);
}

function renderAssignedTo(assignedToIds) {
  if (!assignedToIds || assignedToIds.length === 0) {
    return renderUnassigned();
  }
  const MAX_VISIBLE = 5;
  const visibleIds = assignedToIds.slice(0, MAX_VISIBLE);
  const extraCount = assignedToIds.length - MAX_VISIBLE;
  let html = visibleIds
    .map((id, index) => {
      let contactRef = globalContacts.find((contact) => contact.id === id);
      if (!contactRef) return "";
      let name = `${contactRef.firstname} ${contactRef.lastname}`;
      let initials = getInitials(name);
      let colorClass = getAvatarColorClass(name);
      let leftOffset = index * 24;
      return assignedMembersTemplate(colorClass, leftOffset, initials);
    })
    .join("");
  if (extraCount > 0) {
    let leftOffset = MAX_VISIBLE * 24;
    html += plusMembers(leftOffset, extraCount);
  }
  return html;
}

function disableScroll() {
  document.body.classList.add("no-scroll");
  document.documentElement.classList.add("no-scroll");
}

function enableScroll() {
  document.body.classList.remove("no-scroll");
  document.documentElement.classList.remove("no-scroll");
}
