/**
 * Opens the overlay for adding a new task.
 * Sets the current status, initializes the overlay content, animation, and input fields.
 *
 * @param {string} status - The status to assign to the new task (e.g. "To do")
 */
function openAddTaskOverlay(status) {
  const addOverlayRef = document.getElementById("overlayAddTask");
  const openAddTaskOverlayRef = document.getElementById("addTaskContent");

  document.body.style.overflow = "hidden";
  addOverlayRef.classList.remove("d-nonevip");
  openAddTaskOverlayRef.innerHTML = getAddTaskTemplate();

  const taskContentRef = document.getElementById("addTaskOverlay");
  taskContentRef.classList.remove("animate-out");
  void taskContentRef.offsetWidth;
  taskContentRef.classList.add("animate-in");

  setMinDate();
  initAddTask();

  currentStatus = status;
}

/**
 * Closes the add task overlay with a slide-out animation.
 * Once the animation finishes, the overlay is hidden and priorities are reset.
 */
function closeAddTaskOverlay() {
  const addOverlayRef = document.getElementById("overlayAddTask");
  const taskContentRef = document.getElementById("addTaskOverlay");

  taskContentRef.classList.remove("animate-in");
  void taskContentRef.offsetWidth;
  taskContentRef.classList.add("animate-out");

  taskContentRef.addEventListener("animationend", function handler() {
    taskContentRef.removeEventListener("animationend", handler);
    addOverlayRef.classList.add("d-nonevip");
    document.body.style.overflow = "";
    resetAllPriorities();
  });
}

/**
 * Sets the minimum date for the task date input to today's date.
 * Prevents users from selecting a past date.
 */
function setMinDate() {
  const dateInput = document.getElementById("date");
  dateInput.min = getTodayStr();
}

/**
 * Validates the title input in the edit task form.
 * If the input is empty, sets `checkTitle` to false and shows an error.
 * Otherwise, hides the error and sets `checkTitle` to true.
 */

function checkEmptyTitleEdit() {
  let titleRef = document.getElementById("titleEdit");
  let errorTitleRef = document.getElementById("errorTitleEdit");
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

/**
 * Closes the add task overlay after successfully adding a task.
 * Displays a success message briefly before hiding the overlay and resetting the state.
 */
function closeAddTaskOverlaySuccses() {
  const addOverlayRef = document.getElementById("overlayAddTask");
  addOverlayRef.classList.remove("d-nonevip");

  document.getElementById("AddTaskSuccesMessage").style.display = "flex";
  setTimeout(() => {
    resetAllPriorities();
    document.body.style.overflow = "";
    addOverlayRef.classList.add("d-nonevip");
    document.getElementById("AddTaskSuccesMessage").style.display = "none";
  }, 700);
}
