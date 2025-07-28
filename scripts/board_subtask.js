/**
 * Initializes the `subTasksOpen` and `SubTasksClosed` properties for each task in `loadTodos`.
 * If these properties are undefined, they are set to empty arrays.
 * @function addEmptySubtasks
 */
function addEmptySubtasks() {
  todos = [];
  for (let task of loadTodos) {
    if (task.subTasksOpen === undefined) {
      task.subTasksOpen = [];
    }
    if (task.subTasksClosed === undefined) {
      task.subTasksClosed = [];
    }
    todos.push(task);
  }
}

/**
 * 
 * @param {HTMLElement} iconElement - The icon element that was clicked to trigger the save.
 * @param {string|number} id - The identifier for subtask group.
 * @returns {void}
 */
function saveSubtask(iconElement, id) {
  let updatedSubtask = iconElement.closest(".subtask_edit_wrapper");
  let newValue = updatedSubtask.querySelector("input").value.trim();
  if (newValue === "") {
    return;
  } else {
    let newUL = document.createElement("ul");
    newUL.classList.add("subtask_list_edit");
    newUL.id = `Subtask${newValue}-${id}`;
    newUL.innerHTML = saveSubtaskTemplate(newValue, id);
    updatedSubtask.replaceWith(newUL);
  }
}


/**
 * Gathers and returns a list of updated subtask values from the DOM.
 * @returns {string[]} An array of subtask values.
 */
function getUpdatedSubtasks() {
  let editedSubtasks = document.querySelectorAll(".flex_edit");
  let maindiv = document.getElementById("subTasksEdit");
  let newSubTasks = maindiv.querySelectorAll("input");
  let updatedSubtasks = [];
  for (let index = 0; index < newSubTasks.length; index++) {
    const element = newSubTasks[index];
    let addedTask = element.offsetParent.id;
    updatedSubtasks.push(addedTask);
  }
  for (let el of editedSubtasks) {
    let pTag = el.querySelector("p");
    if (pTag) {
      let text = pTag.textContent.trim();
      if (text !== "") {
        updatedSubtasks.push(text);
      }
    }
  }
  return updatedSubtasks;
}

/**
 * Toggles the checked state of a subtask and updates it on the server.
 * 
 * Based on the current image source (`subtask-checked.png`
 * or `subtask-unchecked.png`), 
 * this function switches the subtask state, updates the icon, 
 * sends the new state to the server,
 * and reloads the task list.
 * 
 * @async
 * @function toggleSubtask
 * @param {HTMLImageElement} img - The image element representing the subtask checkbox.
 * @param {string|number} id - The ID of the parent task.
 * @param {string|number} clickedID - The ID of the subtask being toggled.
 * @returns {Promise<void>} Resolves when the toggle operation and task reload are complete.
 */
async function toggleSubtask(img, id, clickedID) {
  if (isToggling) return;
  isToggling = true;
  try {
    let fileName = img.src.split("/").pop();
    let isChecked = fileName === "subtask-checked.png";

    if (isChecked) {
      img.src = "../assets/icons/subtask-unchecked.png";
      await moveSubtaskBetweenLists(id, clickedID, "subTasksClosed", "subTasksOpen");
    } else {
      img.src = "../assets/icons/subtask-checked.png";
      await moveSubtaskBetweenLists(id, clickedID, "subTasksOpen", "subTasksClosed");
    }
  } finally {
    isToggling = false;
  }
  loadTasks();
}

/**
 *
 * This function fetches all tasks, identifies the task with the given ID, and
 * transfers the subtask (identified by its DOM element's text content) from the list specified by `fromKey` to the list specified by `toKey`. The updated task data is then sent to the server via a PATCH request.
 *  
 * @async
 * @function moveSubtaskBetweenLists
 * @param {string|number} id - The ID of the task containing the subtask.
 * @param {string} clickedID - The DOM ID of the element representing the clicked subtask.
 * @param {string} fromKey - The key of the source subtask list (e.g., "subTasksOpen").
 * @param {string} toKey - The key of the target subtask list (e.g., "subTasksClosed").
 * @returns {Promise<void>} Resolves when the update is completed or exits early if conditions aren't met.
 */
async function moveSubtaskBetweenLists(id, clickedID, fromKey, toKey) {
  const clickedValue = document.getElementById(clickedID).innerText.trim();
  let getTasks = await fetchData("tasks/");
  let taskKey = Object.keys(getTasks).find((key) => getTasks[key].id === id);
  if (!taskKey) return;
  let task = getTasks[taskKey];
  let fromSubtaskList = task[fromKey] || [];
  let toSubtaskList = task[toKey] || [];
  let subTaskIndex = fromSubtaskList.findIndex(
    (task) => task.trim() === clickedValue
  );
  if (subTaskIndex === -1) return;
  let [movedSubtask] = fromSubtaskList.splice(subTaskIndex, 1);
  toSubtaskList.push(movedSubtask);
  await patchData(`tasks/${taskKey}`, {
    [fromKey]: fromSubtaskList,
    [toKey]: toSubtaskList,
  });
}

/**
 * Moves a subtask from the "closed" list to the "open" list for a given task.
 * 
 * @async
 * @function postSubtaskClosed
 * @param {string|number} id - The ID of the task.
 * @param {string} clickedID - The DOM ID of the subtask element being toggled.
 * @returns {Promise<void>} Resolves after the subtask has been moved and the server updated.
 */
async function postSubtaskClosed(id, clickedID) {
  await moveSubtaskBetweenLists(
    id,
    clickedID,
    "subTasksClosed",
    "subTasksOpen"
  );
}

/**
 * Moves a subtask from the "open" list to the "closed" list for a given task.
 * 
 * @async
 * @function postSubtaskOpen
 * @param {string|number} id - The ID of the task.
 * @param {string} clickedID - The DOM ID of the subtask element being toggled.
 * @returns {Promise<void>} Resolves after the subtask has been moved and the server updated.
 */
async function postSubtaskOpen(id, clickedID) {
  await moveSubtaskBetweenLists(
    id,
    clickedID,
    "subTasksOpen",
    "subTasksClosed"
  );
}

/**
 * Returns the rendered subtask overlay HTML for a given task if it contains subtasks.
 * 
 * @function subtasksOverlay
 * @param {*} taskRef - The task object to check for subtasks.
 * @returns {string} The rendered HTML string for the subtask overlay or an empty string if no subtasks exist.
 */
function subtasksOverlay(taskRef) {
  if (
    taskRef.subTasksOpen == undefined &&
    taskRef.subTasksClosed === undefined
  ) {
    return "";
  } else {
    return subtasksOverlayRender(taskRef);
  }
}

/**
 * Returns the rendered editable subtask overlay HTML for a given task edit reference.
 * 
 * @function subtasksOverlayEdit
 * @param {*} tasksEditRef - The task edit object to check for subtasks.
 * @returns {string} The rendered HTML string for the editable subtask overlay or an empty string if no subtasks exist.
 */
function subtasksOverlayEdit(tasksEditRef) {
  if (
    tasksEditRef.subTasksOpen === undefined &&
    tasksEditRef.subTasksClosed === undefined
  ) {
    return "";
  } else {
    return subtasksOverlayRenderEdit(tasksEditRef);
  }
}

/**
 * Sends a PATCH request with JSON data to the specified API endpoint and returns the parsed JSON response.
 * 
 * @async
 * @function patchData
 * @param {string} path - The API resource path
 * @param {object} data - The data object to be patched
 * @returns {Promise<Object>} A promise that resolves to the JSON response from the server.
 */
async function patchData(path, data = {}) {
  const response = await fetch(BASE_URL + path + ".json", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}