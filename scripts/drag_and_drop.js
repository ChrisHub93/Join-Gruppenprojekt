let currentDraggedElement;

/**
 * Loads all tasks from the server, updates the status of the dragged task,
 * saves the updated task back to the server, and reloads the task list.
 * 
 * @param {string} status - The new status to assign to the dragged task (e.g., "To Do")
 * @returns {void}
 */
async function moveTo(status) {
  let tasks = await fetchData("/tasks/");
  const index = todos.findIndex((task) => task.id == currentDraggedElement);
  if (index === -1) {
    console.error("Task mit ID nicht gefunden:", currentDraggedElement);
    return;
  }

  todos[index].status = status;

  let taskKey = Object.keys(tasks).find(
    (key) => tasks[key].id === currentDraggedElement
  );

  await putDataStatus(`tasks/${taskKey}`, todos[index]);
  loadTasks();
}

/**
 * Stores the ID of the dragged task element in a global variable
 * so it can be accessed during the drop operation.
 * 
 * @param {string} id - The ID of the element being dragged
 */
function startDragging(id) {
  currentDraggedElement = id;
}

/**
 * Enables dropping by preventing the browser's default handling of the dragover event.
 * 
 * @param {DragEvent} event - The dragover event
 */
function allowDrop(event) {
  event.preventDefault();
}

/**
 * Adds or removes the CSS class 'dragContainer' to visually highlight a container during drag operations.
 * 
 * @param {string} id - ID of the element to highlight
 * @param {string} action - Either 'add' or 'remove' to control the class
 */
function highlightDragContainer(id, action) {
  const el = document.getElementById(id);
  if (el && (action === 'add' || action === 'remove')) {
    el.classList[action]("dragContainer");
  }
}