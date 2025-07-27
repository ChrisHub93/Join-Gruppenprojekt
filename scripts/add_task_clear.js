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

function clearInnerHTML(id) {
  let ref = document.getElementById(id);
  if (!ref) return;
  ref.innerHTML = "";
}

function clearAddTaskFields() {
  clearInputFields();
  resetAllPriorities();
  setPriorityMedium("medium");
  assignedTo.splice(0, assignedTo.length);
  removeClasses();
}