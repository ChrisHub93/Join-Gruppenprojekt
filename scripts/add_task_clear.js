/**
 * function to clear all inputs and set off error texts
 */
function clearInputFields() {
  removeValue("title");
  removeInputError("title");
  addOpacity("errorTitle");
  removeValue("description");
  removeValue("date");
  removeInputError("date");
  addOpacity("errorDate");
  removeValue("subTaskInput");
  clearInnerHTML("subTasks");
  removeValue("userNameWord");
  clearInnerHTML("assignedMembers");
}

/**
 * function to set back the add task formular to standard
 */
function clearAddTaskFields() {
  clearInputFields();
  resetAllPriorities();
  setPriorityMedium("medium");
  assignedTo.splice(0, assignedTo.length);
  removeClasses();
}

/**
 * 
 * @param {string} id - id of an HTML element, which needs to be cleared
 * @returns {void}
 */
function clearInnerHTML(id) {
  let ref = document.getElementById(id);
  if (!ref) return;
  ref.innerHTML = "";
}