function setPriorityUrgent(id) {
  if (!priorityUrgent) {
    resetAllPriorities();
    priorityUrgent = true;
    let urgentRef = document.getElementById(id);
    urgentRef.classList.toggle("priorityUrgentBg");
    addDisplayNone("standardUrgentIcon");
    removeDisplayNone("activeUrgentIcon");
    setPriority = "urgent";
  } else if (priorityUrgent) {
    resetAllPriorities();
  }
}

function setPriorityMedium(id) {
  if (!priorityMedium) {
    resetAllPriorities();
    priorityMedium = true;
    let urgentRef = document.getElementById(id);
    urgentRef.classList.toggle("priorityMediumBg");
    addDisplayNone("standardMediumIcon");
    removeDisplayNone("activeMediumIcon");
    setPriority = "medium";
  } else if (priorityMedium) {
    resetAllPriorities();
  }
}

function setPriorityLow(id) {
  if (!priorityLow) {
    resetAllPriorities();
    priorityLow = true;
    let urgentRef = document.getElementById(id);
    urgentRef.classList.toggle("priorityLowBg");
    addDisplayNone("standardLowIcon");
    removeDisplayNone("activeLowIcon");
    setPriority = "low";
  } else if (priorityLow) {
    resetAllPriorities();
  }
}

function resetAllPriorities() {
  priorityUrgent = false;
  priorityMedium = false;
  priorityLow = false;
  document.getElementById("urgent").classList.remove("priorityUrgentBg");
  removeDisplayNone("standardUrgentIcon");
  addDisplayNone("activeUrgentIcon");
  document.getElementById("medium").classList.remove("priorityMediumBg");
  removeDisplayNone("standardMediumIcon");
  addDisplayNone("activeMediumIcon");
  document.getElementById("low").classList.remove("priorityLowBg");
  removeDisplayNone("standardLowIcon");
  addDisplayNone("activeLowIcon");
}

function removeDisplayNone(id) {
  let ref = document.getElementById(id);
  if (!ref) return;
  ref.classList.remove("d-none");
}

function addDisplayNone(id) {
  let ref = document.getElementById(id);
  if (!ref) return;
  ref.classList.add("d-none");
}

function createTask() {
  checkEmptyTitle();
  checkEmptyDate();
  checkEmptyCategory();
  if (checkTitle && checkDate && checkCategory) {
    disableButtons();
    closeAddTaskOverlaySuccses();
    postDataToServer(currentStatus);
    currentStatus = "To do";
    setTimeout(() => {
      window.location.href = "../html/board.html";
    }, 700);
  }
}

async function createTaskBoard() {
  checkEmptyTitle();
  checkEmptyDate();
  checkEmptyCategory();
  if (checkTitle && checkDate && checkCategory) {
    await postDataToServer(currentStatus);
    disableButtons();
    closeAddTaskOverlaySuccses();
    currentStatus = "To do";
    setTimeout(() => {
      loadTasks();
      enableButtons();
    }, 700);
  }
}

function disableButtons() {
  document.querySelectorAll("button").forEach((btn) => (btn.disabled = true));
  document.body.style.overflow = "hidden";
}

function enableButtons() {
  document.querySelectorAll("button").forEach((btn) => (btn.disabled = false));
  document.body.style.overflow = "";
}

function checkEmptyTitle() {
  let titleRef = document.getElementById("title");
  let errorTitleRef = document.getElementById("errorTitle");
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

function checkEmptyDate() {
  const dateRef = document.getElementById("date");
  const errorDateRef = document.getElementById("errorDate");
  const inputValue = dateRef.value.trim();
  const todayStr = getTodayStr();
  if (!inputValue || inputValue < todayStr) {
    dateRef.classList.add("inputError");
    errorDateRef.classList.remove("opacity");
    checkDate = false;
  } else {
    dateRef.classList.remove("inputError");
    errorDateRef.classList.add("opacity");
    checkDate = true;
  }
}

function getTodayStr() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function checkEmptyCategory() {
  const category = document.getElementById("select").innerText;
  const errorCatRef = document.getElementById("selectCategoryField");
  if (category === "Select task category") {
    errorCatRef.classList.add("inputError");
    checkCategory = false;
  } else {
    errorCatRef.classList.remove("inputError");
    checkCategory = true;
  }
}

function chooseSubTask(id, icon, cancelOrCheckIcon) {
  let inputRef = document.getElementById(id);
  let trimmedInputValue = inputRef.value.trim();
  if (trimmedInputValue == "") {
    inputRef.value = "";
    addDisplayNone(cancelOrCheckIcon);
    removeDisplayNone(icon);
  } else if (inputRef.value != "") {
    addDisplayNone(icon);
    removeDisplayNone(cancelOrCheckIcon);
  }
}

function deleteTask() {
  let inputRef = document.getElementById("subTaskInput");
  inputRef.value = "";
  removeDisplayNone("plusIcon");
  toggleDisplayNone("cancelOrCheck");
}

function addTask(id, renderedField, plusIconRef, CancelOrCheckRef) {
  let inputRef = document.getElementById(id);
  let addedTaskRef = document.getElementById(renderedField);
  let newID = generateTimeBasedId();
  addedTaskRef.innerHTML += getSubTasksTemplate(inputRef, newID);
  removeDisplayNone(plusIconRef);
  toggleDisplayNone(CancelOrCheckRef);
  subtasksOpen.push(inputRef.value);
  inputRef.value = "";
}

function addTaskHTML(id, renderedField, plusIconRef, CancelOrCheckRef) {
  let inputRef = document.getElementById(id);
  let addedTaskRef = document.getElementById(renderedField);
  addedTaskRef.innerHTML += subtaskTemplateHTML(inputRef);
  removeDisplayNone(plusIconRef);
  toggleDisplayNone(CancelOrCheckRef);
  subtasksOpen.push(inputRef.value);
  inputRef.value = "";
}

function editTask(id) {
  let inputRef = document.getElementById(`subtask_${id}`);
  inputField = inputRef.querySelector("input");
  if (inputField.classList.contains("activeInput")) return;
  addDisplayNone(`editOrTrash_${id}`);
  toggleDisplayNone(`trashOrCheck_${id}`);
  inputField.classList.add("activeInput");
  toggleDisplayNone(`bullet_${id}`);
  let length = inputField.value.length;
  inputField.setSelectionRange(length, length);
  let hideRef = document.getElementById(`editOrTrash_${id}`);
  hideRef.classList.add("opacity");
}

function acceptTask(id, valueId) {
  const editTaksValue = document.getElementById(valueId).value.trim();
  if (editTaksValue === "") return;
  toggleDisplayNone(`trashOrCheck_${id}`);
  let hideRef = document.getElementById(`editOrTrash_${id}`);
  hideRef.classList.remove("opacity");
  let inputRef = document.getElementById(`subtask_${id}`);
  inputField = inputRef.querySelector("input");
  inputField.blur();
  inputField.classList.toggle("activeInput");
  toggleDisplayNone(`bullet_${id}`);
}

function completeDeleteTask(id) {
  let inputRef = document.getElementById(id);
  if (inputRef) inputRef.remove();
}

function addDisplayNone(id) {
  let ref = document.getElementById(id);
  if (!ref) return;
  ref.classList.add("d-nonevip");
}

function removeDisplayNone(id) {
  let ref = document.getElementById(id);
  if (!ref) return;
  ref.classList.remove("d-nonevip");
}

function toggleDisplayNone(id) {
  let ref = document.getElementById(id);
  if (!ref) return;
  ref.classList.toggle("d-nonevip");
}

async function postDataToServer(currentStatus) {
  let title = document.getElementById("title");
  let description = document.getElementById("description");
  let date = document.getElementById("date");
  let priority = setPriority;
  let category = document.getElementById("select");
  // Subtasks aus dem DOM auslesen
  const subTasksFromDOM = Array.from(document.querySelectorAll(".subTaskAdded"))
    .map((el) => {
      // entweder direkt ein Input-Feld oder Textinhalt
      if (el.tagName === "INPUT") return el.value.trim();
      let input = el.querySelector("input");
      if (input) return input.value.trim();
      return el.textContent.trim();
    })
    .filter((val) => val.length > 0);
  await postData(`/tasks/`, {
    id: generateTimeBasedId(),
    title: title.value,
    description: description.value,
    date: date.value,
    priority: priority,
    assignedTo: assignedTo,
    category: category.innerText,
    subTasksOpen: subTasksFromDOM,
    status: currentStatus,
  });
}

async function postData(path, data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responseToJson = await response.json());
}

function getId() {
  return self.crypto.randomUUID();
}

function generateTimeBasedId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

async function searchContacts() {
  let assigneContacts = [];
  let contacts = await fetchData("/contacts/");
  let contactsArray = Object.values(contacts);

  for (id of assignedTo) {
    for (search of contactsArray) {
      if (search.id == id) {
        assigneContacts.push(search.firstname + " " + search.lastname);
      }
    }
  }
  return assigneContacts;
}

function getContactNameById(id) {
  let contact = globalContacts.find((c) => c.id === id);
  return contact ? `${contact.firstname} ${contact.lastname}` : "Unbekannt";
}
