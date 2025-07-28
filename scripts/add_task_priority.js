/**
 * function to set the urgent button
 * 
 * @param {string} id - id (urgent) of the HTML Element 
 */
function setPriorityUrgent(id) {
  if (!priorityUrgent) {
    togglePrioritySet("Urgent", id, "urgent");
    priorityUrgent = true;
  } else {
    resetAllPriorities();
  }
}

/**
 * function to set the medium button
 * 
 * @param {string} id - id (medium) of the HTML Element button
 */
function setPriorityMedium(id) {
  if (!priorityMedium) {
    togglePrioritySet("Medium", id, "medium");
    priorityMedium = true;
  } else {
    resetAllPriorities();
  }
}

/**
 * function to set the low button
 * 
 * @param {string} id - id (low) of the HTML Element button
 */
function setPriorityLow(id) {
  if (!priorityLow) {
    togglePrioritySet("Low", id, "low");
    priorityLow = true;
  } else {
    resetAllPriorities();
  }
}

/**
 * function to set the new priority or turn it off
 * 
 * @param {string} prio - capitalized name of the clicked priority to identify CSS class and Icons
 * @param {string} id - id (urgent, medium, low) of the clicked HTML Element button
 * @param {string} newSetPrio - lower case name of the clicked priority to set the new priority
 */
function togglePrioritySet(prio, id, newSetPrio) {
  resetAllPriorities();
  let bgClass = `priority${prio}Bg`;
  let standardIcon = `standard${prio}Icon`;
  let activeIcon = `active${prio}Icon`;
  document.getElementById(id).classList.add(bgClass);
  addDisplayNone(standardIcon);
  removeDisplayNone(activeIcon);
  setPriority = newSetPrio;
}

/**
 * function to set back all priority buttons to not activated
 */
function resetAllPriorities() {
  priorityUrgent = false;
  priorityMedium = false;
  priorityLow = false;
  let priorities = ["Urgent", "Medium", "Low"];
  priorities.forEach(label => {
    let el = label.toLowerCase();
    document.getElementById(el).classList.remove(`priority${label}Bg`);
    removeDisplayNone(`standard${label}Icon`);
    addDisplayNone(`active${label}Icon`);
  });
}