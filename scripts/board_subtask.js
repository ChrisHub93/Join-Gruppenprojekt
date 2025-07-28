/**
 * Adds empty arrays for `subTasksOpen` and `subTasksClosed` if they are undefined.
 * Populates the global `todos` array with updated task objects.
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
 * Saves an edited subtask input by replacing the edit input with a standard list item.
 *
 * @param {HTMLElement} iconElement - The element inside the editable subtask container
 * @param {number|string} id - ID of the parent task
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
 * Collects all subtasks (both from input fields and existing <p> tags) and returns them as an array.
 *
 * @returns {Array<string>} - List of updated subtask strings
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
 * Toggles a subtask between completed and open states by updating the UI icon and syncing with the server.
 *
 * @param {HTMLImageElement} img - The clicked image element representing checkbox
 * @param {number} id - ID of the task
 * @param {string} clickedID - ID of the subtask container (DOM element)
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
 * Moves a subtask between two lists (`subTasksOpen` and `subTasksClosed`) in the task data,
 * and updates the backend via PATCH request.
 *
 * @param {number} id - ID of the task
 * @param {string} clickedID - ID of the subtask DOM element
 * @param {string} fromKey - Property name of the source list (e.g. 'subTasksClosed')
 * @param {string} toKey - Property name of the destination list (e.g. 'subTasksOpen')
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
 * Renders the subtask overlay content if subtasks are available.
 *
 * @param {object} taskRef - Task object
 * @returns {string} - HTML string or empty string
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
 * Renders the subtask edit overlay if subtasks exist in the task.
 *
 * @param {object} tasksEditRef - Task object being edited
 * @returns {string} - HTML string or empty string
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
 * Sends a PATCH request to update part of a resource in the backend.
 *
 * @param {string} path - The relative path to the resource (e.g. "tasks/abc123")
 * @param {object} data - The partial data to update
 * @returns {Promise<object>} - The server's response as JSON
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