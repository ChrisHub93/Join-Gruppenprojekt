/**
 * Filters the global `todos` array based on the user's search input.
 * 
 * It checks whether the `title` or `description` of a task includes the search term (case-insensitive).
 * The filtered tasks are assigned back to `todos` and passed to `loadSearch()` for rendering.
 * 
 * @returns {void}
 */
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

/**
 * Renders filtered tasks by their status into the appropriate task columns.
 * 
 * If the search input is empty, it reloads all tasks.
 * Otherwise, it categorizes the filtered tasks by status and displays them
 * in the corresponding sections: "To do", "In progress", "Await feedback", and "Done".
 *
 * @param {Array} todos - The list of filtered task objects to be rendered.
 * @returns {void}
 */

function loadSearch(todos) {
  let searchInput = document.getElementById("filterTasks").value;
  if (searchInput === "") {
    loadTasks();
    return;
  }
  let columns = getTaskColumns();
  let filteredTasks = filteredTasksByStatus(todos);
  clearAllDocuments();
  renderStatus(filteredTasks["To do"], columns.toDo);
  renderStatus(filteredTasks["In progress"], columns.inProgress);
  renderStatus(filteredTasks["Await feedback"], columns.awaitFeedback);
  renderStatus(filteredTasks["Done"], columns.done);
}

/**
 * Clears the inner HTML content of all task columns:
 * "To Do", "In Progress", "Await Feedback", and "Done".
 *
 * This is typically used before re-rendering tasks to ensure the UI is reset.
 *
 * @returns {void}
 */
function clearAllDocuments() {
  document.getElementById("toDoContent").innerHTML = "";
  document.getElementById("inProgressContent").innerHTML = "";
  document.getElementById("awaitFeedbackContent").innerHTML = "";
  document.getElementById("doneContent").innerHTML = "";
}
