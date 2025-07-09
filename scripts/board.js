let todos = [];
let currentDraggedElement;
let globalContacts = [];

async function loadTasks() {
  let tasks = await fetchData("/tasks/");
  if (tasks === null) {
    return;
  }
  todos = Object.values(tasks);
  let contactsData = await fetchData("/contacts/");
  globalContacts = Object.values(contactsData);

  let toDoContentRef = document.getElementById("toDoContent");
  let inProgressContentRef = document.getElementById("inProgressContent");
  let awaitFeedbackContentRef = document.getElementById("awaitFeedbackContent");
  let doneContentRef = document.getElementById("doneContent");

  // console.log("TodDOs vor filter:",todos);
  let statusToDo = todos.filter((task) => task.status === "To do");

  let statusInProgress = todos.filter((task) => task.status === "In progress");
  let statusAwaitFeedback = todos.filter(
    (task) => task.status === "Await feedback"
  );

  let statusDone = todos.filter((task) => task.status === "Done");

  toDoContentRef.innerHTML = "";
  inProgressContentRef.innerHTML = "";
  awaitFeedbackContentRef.innerHTML = "";
  doneContentRef.innerHTML = "";

  if (statusToDo.length === 0) {
    toDoContentRef.innerHTML = getEmptyTemplate();
  } else {
    for (let index = 0; index < statusToDo.length; index++) {
      const element = statusToDo[index];
      toDoContentRef.innerHTML += getTaskTemplate(element);
      calculateAndRenderProgressBar(element);
    }
  }

  if (statusInProgress.length == 0) {
    inProgressContentRef.innerHTML = getEmptyTemplate();
  } else {
    for (let index = 0; index < statusInProgress.length; index++) {
      const element = statusInProgress[index];
      inProgressContentRef.innerHTML += getTaskTemplate(element);
      calculateAndRenderProgressBar(element);
    }
  }

  if (statusAwaitFeedback.length == 0) {
    awaitFeedbackContentRef.innerHTML = getEmptyTemplate();
  } else {
    for (let index = 0; index < statusAwaitFeedback.length; index++) {
      const element = statusAwaitFeedback[index];
      awaitFeedbackContentRef.innerHTML += getTaskTemplate(element);
      calculateAndRenderProgressBar(element);
    }
  }

  if (statusDone.length == 0) {
    doneContentRef.innerHTML = getEmptyTemplate();
  } else {
    for (let index = 0; index < statusDone.length; index++) {
      const element = statusDone[index];

      doneContentRef.innerHTML += getTaskTemplate(element);
      calculateAndRenderProgressBar(element);
    }
  }
}

// prettier-ignore
function calculateAndRenderProgressBar(element) {
  let percent = 0;
  let tasksOpenLength = element.subTasksOpen?.length ?? 0;
  let tasksClosedLength = element.subTasksClose?.length ?? 0;

  if (tasksOpenLength === 0) {
     document.getElementById("filledContainer-status" + element.id).style.display = "none";
  } else {
    percent = Math.round(((tasksClosedLength)/ tasksOpenLength) * 100);
    document.getElementById('status-bar-js' + element.id).style = `width: ${percent}%`;
    document.getElementById('status-bar-number1' + element.id).innerText = `${tasksClosedLength}`;
    document.getElementById('status-bar-number2' + element.id).innerText = `${tasksOpenLength}`;
  }
}

function startDragging(id) {
  currentDraggedElement = id;
  console.log(currentDraggedElement);
}

function allowDrop(event) {
  event.preventDefault();
}

async function moveTo(status) {
  let tasks = await fetchData("/tasks/");

  console.log("todos (vorher):", todos);

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

async function deleteBoardTasks(tasksRef) {
  let tasks = await fetchData("/tasks/");
  let key = Object.keys(tasks).find(
    (key) => String(tasks[key].id) === tasksRef
  );
  await deleteTasks("/tasks/", key);
  loadTasks();
}

async function deleteTasks(path, key) {
  console.log("FirebaseKey:", key);
  let response = await fetch(BASE_URL + path + key + ".json", {
    method: "DELETE",
  });
  return await response.json();
}

async function putDataStatus(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responseToJson = await response.json());
}

function highlight(id) {
  document.getElementById(id).innerHTML = getDragTemplate();
}

function removeHighlight(id) {
  document.getElementById(id).innerHTML = "";
}

function overlayTask(element) {
  let tasksRef = searchElement(element);
  let addOverlayRef = document.getElementById("overlayTask");
  let dialogTaskContentRef = document.getElementById("dialogTaskContent");
  let addOverlayEditRef = document.getElementById("overlayTaskEdit");
  let checkOpenOverlayEdit = addOverlayEditRef.classList.contains("active");
  let checkOpenOverlay = addOverlayRef.classList.contains("active");
  addOverlayEditRef.classList.remove("active");
  addOverlayRef.classList.add("active");
  dialogTaskContentRef.innerHTML = renderOverlayTaskContent(todos[tasksRef]);
  if (!checkOpenOverlay && !checkOpenOverlayEdit) {
    dialogTaskContentRef.style.transform = "translateX(100%)";
    dialogTaskContentRef.style.opacity = "0";
    requestAnimationFrame(() => {
      dialogTaskContentRef.style.transform = "translateX(0)";
      dialogTaskContentRef.style.opacity = "1";
    });
  }
}

function searchElement(id) {
  const index = todos.findIndex((task) => task.id == id);
  if (index === -1) {
    console.error("Task mit ID nicht gefunden:", id);
    return;
  }
  return index;
}

function closeOverlay(event) {
  let addOverlayTaskRef = document.getElementById("overlayTask");
  let addOverlayEditRef = document.getElementById("overlayTaskEdit");
  let dialogTaskContentRef = document.getElementById("dialogTaskContent");
  let dialogTaskEditContent = document.getElementById("dialogTaskEditContent");
  if (
    event.target === addOverlayTaskRef ||
    event.target.closest("#overlayTask .closeIcon") ||
    event.target.closest(".delete_task")
  ) {
    dialogTaskContentRef.style.transform = "translateX(100%)";
    dialogTaskContentRef.style.opacity = "0";

    setTimeout(() => {
      addOverlayTaskRef.classList.remove("active");
      dialogTaskContentRef.style.transform = "";
      dialogTaskContentRef.style.opacity = "";
    }, 300);
  } else if (
    event.target === addOverlayEditRef ||
    event.target.closest("#overlayTaskEdit .closeIcon")
  ) {
    dialogTaskEditContent.style.transform = "translateX(100%)";
    dialogTaskEditContent.style.opacity = "0";

    setTimeout(() => {
      addOverlayEditRef.classList.remove("active");
      dialogTaskEditContent.style.transform = "";
      dialogTaskEditContent.style.opacity = "";
    }, 300);
  }
}

// Testbereich Start
function toggleSubtask(img, id) {
  let fileName = img.src.split("/").pop();
  let isChecked = fileName === "subtask-checked.png";
  console.log(id);

  if (isChecked) {
    img.src = "../assets/icons/subtask-unchecked.png";
    postSubtaskClosed(id);
  } else {
    img.src = "../assets/icons/subtask-checked.png";
    postSubtaskOpen(id);
  }
}

async function postSubtaskClosed(id) {
  const index = todos.findIndex((task) => task.id == id);
  let foundTask = todos[index].subTasksClosed;
  foundTask = foundTask.splice(index, 1).toString();
  
  todos[index].subTasksOpen.push(foundTask);
}

function postSubtaskOpen(id) {
  const index = todos.findIndex((task) => task.id == id);
  let foundTask = todos[index].subTasksOpen;
  foundTask = foundTask.splice(index, 1).toString();
  
  todos[index].subTasksClosed.push(foundTask);

  console.log("testSplice", foundTask);
  console.log("SubtaskClosed Array:",subtasksClosed);
}

function closeOverlayAndPushToServer(id) {
  console.log(todos);
  console.log("subOpen:",subtasksOpen);
  console.log("subClosed:",subtasksClosed);
}

// Testbereich ENDE

function subtasksOverlay(taskRef) {
  if (taskRef.subTasksOpen == undefined && taskRef.subTasksClose === undefined) {
    return "";
  } else {
    return subtasksOverlayRender(taskRef);
  }
}

function subtasksOverlayEdit(tasksEditRef) {
  if (tasksEditRef === undefined) {
    return "";
  } else {
    return subtasksOverlayRenderEdit(tasksEditRef);
  }
}

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

function editOverlayTask(tasksRef) {
  taskOverlaySync();
  let tasksEditRef = searchElement(tasksRef);
  let addOverlayRef = document.getElementById("overlayTask");
  let addOverlayEditRef = document.getElementById("overlayTaskEdit");
  let dialogTaskEditRef = document.getElementById("dialogTaskEditContent");
  addOverlayRef.classList.remove("active");
  addOverlayEditRef.classList.add("active");
  dialogTaskEditRef.innerHTML = renderOverlayTaskEdit(todos[tasksEditRef]);
}

function renderPrioButton(prioName, activePrio) {
  let prioGet = prioName.toLowerCase();
  let isActive = prioGet === activePrio.toLowerCase();
  let prioFullName = prioName.charAt(0).toUpperCase() + prioName.slice(1);
  let iconPath = `../assets/icons/priority-${prioGet}.png`;
  let iconPathClicked = `../assets/icons/priority-clicked-${prioGet}.png`;

  return `
    <button 
      class="prio_edit_button ${prioGet} ${isActive ? "active" : ""}" 
      data-prio="${prioGet}" 
      type="button"
      onclick="setPrioActive(this)">
      ${prioFullName} <img class="prio_overlay_task" src="${
    isActive ? iconPathClicked : iconPath
  }">
    </button>
  `;
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

let flatpickrInstance = null;
function toggleFlatpickr() {
  if (!flatpickrInstance) {
    flatpickrInstance = flatpickr("#date", {
      dateFormat: "d/m/Y",
      allowInput: true,
    });
  }
}

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

  initAddTask();

  currentStatus = status;
  console.log("status:", currentStatus);
}

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

async function loadData(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseToJson = await response.json();

  return responseToJson;
}

async function updateDataEdit(tasksEditRef) {
  let tasks = await fetchData("/tasks/");

  let taskKeyEdit = Object.keys(tasks).find(
    (k) => String(tasks[k].id) === String(tasksEditRef)
  );
  let prioButton = document.querySelector(".prio_edit_button.active");
  let priorityEdit = prioButton.dataset.prio;
  let data = {
    id: tasks[taskKeyEdit].id,
    category: tasks[taskKeyEdit].category,
    title: title.value,
    description: description.value,
    date: date.value,
    priority: priorityEdit,
    assignedTo: assignedToEditTemp,
    subTasksOpen: getUpdatedSubtasks(),
    status: tasks[taskKeyEdit].status,
  };

  await putDataEdit(`/tasks/${taskKeyEdit}`, data);
  await loadTasks();

  overlayTask(data.id);
}

async function putDataEdit(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

function getUpdatedSubtasks() {
  let editedSubtasks = document.querySelectorAll(".flex_edit");
  let maindiv = document.getElementById("subTasks");
  let newSubTasks = maindiv.querySelectorAll("input");
  let updatedSubtasks = [];

  for (let index = 0; index < newSubTasks.length; index++) {
    const element = newSubTasks[index];
    let addedTask = element.offsetParent.id;
    console.log(updatedSubtasks);
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
  // return updatedSubtasks;
}

function editSubtask(iconElement) {
  let ul = iconElement.closest("ul");
  let currentText = ul.querySelector("p").innerText;

  let newContainer = document.createElement("div");
  newContainer.classList.add("subtask_edit_wrapper");
  newContainer.innerHTML = `
    <input type="text" value="${currentText}" class="subtask_input_edit">
    <div class="edit_subtask_checkbox">
      <img class="edit_icons edit_icons_subtask_change" src="../assets/icons/check-subtask.png" onclick="saveSubtask(this)">
      <div class="seperator_edit"></div>
      <img class="edit_icons edit_icons_subtask_change" src="../assets/icons/delete.png">
    </div>
  `;
  ul.replaceWith(newContainer);
  let inputActive = newContainer.querySelector("input");
  inputActive.focus();
  inputActive.setSelectionRange(
    inputActive.value.length,
    inputActive.value.length
  );
}

function saveSubtask(iconElement) {
  let updatedSubtask = iconElement.closest(".subtask_edit_wrapper");
  let newValue = updatedSubtask.querySelector("input").value;

  let newUL = document.createElement("ul");
  newUL.innerHTML = `
    <li>
      <div onclick="editSubtask(this)" class="flex_edit">
        <p>${newValue}</p>
        <div class="hide_edit_subtask">
          <img class="edit_icons" src="../assets/icons/edit.png">
          <div class="seperator_edit"></div>
          <img class="edit_icons" src="../assets/icons/delete.png">
        </div>
      </div>
    </li>
  `;

  updatedSubtask.replaceWith(newUL);
}

function filterTasks() {
  let searchInput = document
    .getElementById("filterTasks")
    .value.trim()
    .toLowerCase();
  console.log(searchInput);
  let filteredTask = todos
    .slice(0)
    .filter(
      (todos) =>
        todos.title.toLowerCase().includes(searchInput) ||
        todos.description.toLowerCase().includes(searchInput)
    );
  console.log(filteredTask);
  todos = filteredTask;
  loadSearch(todos);
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

  // console.log("TodDOs vor filter:",todos);
  let statusToDo = todos.filter((task) => task.status === "To do");

  let statusInProgress = todos.filter((task) => task.status === "In progress");
  let statusAwaitFeedback = todos.filter(
    (task) => task.status === "Await feedback"
  );

  let statusDone = todos.filter((task) => task.status === "Done");

  toDoContentRef.innerHTML = "";
  inProgressContentRef.innerHTML = "";
  awaitFeedbackContentRef.innerHTML = "";
  doneContentRef.innerHTML = "";

  if (statusToDo.length === 0) {
    toDoContentRef.innerHTML = getEmptyTemplate();
  } else {
    for (let index = 0; index < statusToDo.length; index++) {
      const element = statusToDo[index];
      toDoContentRef.innerHTML += getTaskTemplate(element);
    }
  }

  if (statusInProgress.length == 0) {
    inProgressContentRef.innerHTML = getEmptyTemplate();
  } else {
    for (let index = 0; index < statusInProgress.length; index++) {
      const element = statusInProgress[index];
      inProgressContentRef.innerHTML += getTaskTemplate(element);
    }
  }

  if (statusAwaitFeedback.length == 0) {
    awaitFeedbackContentRef.innerHTML = getEmptyTemplate();
  } else {
    for (let index = 0; index < statusAwaitFeedback.length; index++) {
      const element = statusAwaitFeedback[index];
      awaitFeedbackContentRef.innerHTML += getTaskTemplate(element);
    }
  }

  if (statusDone.length == 0) {
    doneContentRef.innerHTML = getEmptyTemplate();
  } else {
    for (let index = 0; index < statusDone.length; index++) {
      const element = statusDone[index];

      doneContentRef.innerHTML += getTaskTemplate(element);
    }
  }
}

async function initEditContacts(assignedTo = []) {
  let contacts = await loadContacts();
  renderContactListEdit(contacts, assignedTo);
  assignedToEditTemp = [...assignedTo];
}

function openAssignedToEdit() {
  toggleVisibility("editMembers");
  toggleBorderColor("selectMember");
  toggleArrow("arrow");
  let assignedMembersEditRef = document.getElementById("assignedMembersEdit");
  assignedMembersEditRef.classList.toggle("d-nonevip");
  initEditContacts(assignedToEditTemp);
  updateAssignedMembersEdit(assignedToEditTemp);
}

function renderContactListEdit(contacts, assignedTo = []) {
  let editMembersRef = document.getElementById("editMembers");
  editMembersRef.innerHTML = "";

  if (contacts) {
    for (let contact of contacts) {
      let name = contact.firstname + " " + contact.lastname;
      let assignedColor = getAvatarColorClass(name);
      let isAssigned = assignedTo.includes(contact.id);
      editMembersRef.innerHTML += getContactListEdit(
        contact,
        assignedColor,
        isAssigned
      );
    }
  }
}

function getContactListEdit(contact, assignedColor, isAssigned) {
  return `  <li
                  onclick="getContactEdit('${contact.id}')"
                  id="contact${contact.id}"
                  class="optionsCategory inputFlex ${
                    isAssigned ? "assignedBg" : ""
                  }">
                  <div class="contacts_name_icon">
                    <p class="assigned_to_icon ${assignedColor}">${contact.firstname
    .toUpperCase()
    .charAt(0)}${contact.lastname.toUpperCase().charAt(0)}</p>
                    ${contact.firstname + " "} ${contact.lastname}
                  </div>
                  <input type="checkbox" class="checkBox" ${
                    isAssigned ? "checked" : ""
                  } />
                  <img
                    onclick="setCheckBox('contact${contact.id}', event)"
                    id="checkBoxImg${contact.id}"
                    class="checkBoxImg ${isAssigned ? "filterChecked" : ""}"
                    src="${
                      isAssigned
                        ? "/assets/icons/Check button true.png"
                        : "/assets/icons/Check button.png"
                    }"
                    alt=""
                  />
                </li>
  `;
}

function filterEditContactList() {
  let input = document
    .getElementById("contactSearchInputEdit")
    .value.toLowerCase();
  let editMembersRef = document.getElementById("editMembers");
  let editMembersListItem = editMembersRef.querySelectorAll("li");

  editMembersListItem.forEach((item) => {
    let text = item.textContent.toLowerCase();
    item.style.display = text.includes(input) ? "flex" : "none";
  });
}

function updateAssignedMembersEdit(assignedTo) {
  let assignedMembersEditRef = document.getElementById("assignedMembersEdit");
  if (!assignedMembersEditRef) return;
  assignedMembersEditRef.innerHTML = getAssignedInitialsEditIcons(assignedTo);
}

function getContactEdit(id) {
  let membersRef = document.getElementById("contact" + id);
  inputRef = membersRef.querySelector("input");
  checkBoxImg = membersRef.querySelector("img");

  if (!inputRef.checked) {
    getInputCheckedTrue(membersRef, inputRef);
  } else if (inputRef.checked && membersRef.classList.contains("assignedBg")) {
    getInputCheckedFalse(membersRef, inputRef);
  }
  toggleAssignmentEdit(id);
}

function toggleAssignmentEdit(id) {
  let index = assignedToEditTemp.indexOf(id);
  if (index !== -1) {
    assignedToEditTemp.splice(index, 1);
  } else {
    assignedToEditTemp.push(id);
  }
}
