let loadTodos = [];
let todos = [];
let currentDraggedElement;
let globalContacts = [];
let isToggling = false;

async function loadTasks() {
  let toDoContentRef = document.getElementById("toDoContent");
  let inProgressContentRef = document.getElementById("inProgressContent");
  let awaitFeedbackContentRef = document.getElementById("awaitFeedbackContent");
  let doneContentRef = document.getElementById("doneContent");
  let tasks = await fetchData("/tasks/");

  if (tasks === null) {
    toDoContentRef.innerHTML = getEmptyTemplate();
    inProgressContentRef.innerHTML = getEmptyTemplate();
    awaitFeedbackContentRef.innerHTML = getEmptyTemplate();
    doneContentRef.innerHTML = getEmptyTemplate();
    return;
  }
  loadTodos = Object.values(tasks);
  addSubtasks();

  let contactsData = await fetchData("/contacts/");
  globalContacts = Object.values(contactsData);
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

function addSubtasks() {
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

// prettier-ignore
function calculateAndRenderProgressBar(element) {
  let percent = 0;
  let tasksOpenLength = element.subTasksOpen?.length ?? 0;
  let tasksClosedLength = element.subTasksClosed?.length ?? 0;
  let tasksLength = tasksOpenLength + tasksClosedLength

  if (tasksLength === 0) {
     document.getElementById("filledContainer-status" + element.id).style.display = "none";
  } else {
    percent = Math.round(((tasksClosedLength)/ tasksLength) * 100);
    document.getElementById('status-bar-js' + element.id).style = `width: ${percent}%`;
    document.getElementById('status-bar-number1' + element.id).innerText = `${tasksClosedLength}`;
    document.getElementById('status-bar-number2' + element.id).innerText = `${tasksLength}`;
  }
}

function startDragging(id) {
  currentDraggedElement = id;
}

function allowDrop(event) {
  event.preventDefault();
}

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

async function deleteBoardTasks(tasksRef) {
  let tasks = await fetchData("/tasks/");
  let key = Object.keys(tasks).find(
    (key) => String(tasks[key].id) === tasksRef
  );
  await deleteTasks("/tasks/", key);
  deleteOverlaySuccses()
  loadTasks();
}

async function deleteTasks(path, key) {
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
  disableScroll()
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

async function toggleSubtask(img, id, clickedID) {
  if (isToggling) return;
  isToggling = true;

  try {
    let fileName = img.src.split("/").pop();
    let isChecked = fileName === "subtask-checked.png";

    if (isChecked) {
      img.src = "../assets/icons/subtask-unchecked.png";
      await postSubtaskClosed(id, clickedID);
    } else {
      img.src = "../assets/icons/subtask-checked.png";
      await postSubtaskOpen(id, clickedID);
    }
  } finally {
    isToggling = false;
  }
}

async function postSubtaskClosed(id, clickedID) {
  const clickedValue = document.getElementById(clickedID).innerText.trim();
  let getTasks = await fetchData("tasks/");
  let taskKey = Object.keys(getTasks).find((key) => getTasks[key].id === id);
  if (!taskKey) return;

  const task = getTasks[taskKey];
  const closedSubtasks = task.subTasksClosed || [];
  const openSubtasks = task.subTasksOpen || [];

  const subTaskIndex = closedSubtasks.findIndex(
    (task) => task.trim() === clickedValue
  );
  if (subTaskIndex === -1) return;

  const [movedSubtask] = closedSubtasks.splice(subTaskIndex, 1);
  openSubtasks.push(movedSubtask);

  await patchData(`tasks/${taskKey}`, {
    subTasksOpen: openSubtasks,
    subTasksClosed: closedSubtasks,
  });
}

async function postSubtaskOpen(id, clickedID) {
  const clickedValue = document.getElementById(clickedID).innerText.trim();

  let getTasks = await fetchData("tasks/");
  let taskKey = Object.keys(getTasks).find((key) => getTasks[key].id === id);
  if (!taskKey) return;

  const task = getTasks[taskKey];
  const closedSubtasks = task.subTasksClosed || [];
  const openSubtasks = task.subTasksOpen || [];

  const subTaskIndex = openSubtasks.findIndex(
    (task) => task.trim() === clickedValue
  );
  if (subTaskIndex === -1) return;

  const [movedSubtask] = openSubtasks.splice(subTaskIndex, 1);
  closedSubtasks.push(movedSubtask);

  await patchData(`tasks/${taskKey}`, {
    subTasksOpen: openSubtasks,
    subTasksClosed: closedSubtasks,
  });
}

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
  toggleFlatpickr(document.getElementById("dateEdit"));
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
function toggleFlatpickr(inputElement) {
  if (flatpickrInstance) {
    flatpickrInstance.destroy();
    flatpickrInstance = null;
  }
  if (!flatpickrInstance) {
    flatpickrInstance = flatpickr(inputElement, {
      dateFormat: "d/m/Y",
      allowInput: true,
      defaultDate: inputElement.value || null,
      minDate: "today",
      disableMobile: true,
    });
  }
}

function formatDateToDisplay(dateStr) {
  if (!dateStr) return "";

  if (dateStr.includes("/")) {
    return dateStr;
  }

  let [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
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

  setMinDate();
  initAddTask();

  currentStatus = status;
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

function deleteOverlaySuccses() {
  const addOverlayRef = document.getElementById("overlayDeleteTask");
  addOverlayRef.classList.remove("d-nonevip");

  document.getElementById("deleteSuccesMessage").style.display = "flex";
  setTimeout(() => {
    document.body.style.overflow = "";
    addOverlayRef.classList.add("d-nonevip");
    document.getElementById("deleteSuccesMessage").style.display = "none";
  }, 800);
}

async function loadData(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseToJson = await response.json();

  return responseToJson;
}

async function updateDataEdit(tasksEditRef) {
  let checkInputs = checkEditInputFields();
  if (!checkInputs) {
    return;
  } else {
    let tasks = await fetchData("/tasks/");
    let taskKeyEdit = Object.keys(tasks).find(
      (k) => String(tasks[k].id) === String(tasksEditRef)
    );
    let prioButton = document.querySelector(".prio_edit_button.active");
    let priorityEdit = prioButton.dataset.prio;
    let data = {
      id: tasks[taskKeyEdit].id,
      category: tasks[taskKeyEdit].category,
      title: document.getElementById("titleEdit").value,
      description: document.getElementById("descriptionEdit").value,
      date: document.getElementById("dateEdit").value,
      priority: priorityEdit,
      assignedTo: assignedToEditTemp,
      subTasksOpen: getUpdatedSubtasks(),
      status: tasks[taskKeyEdit].status,
    };

    await putDataEdit(`/tasks/${taskKeyEdit}`, data);
    await loadTasks();

    overlayTask(data.id);
  }
}

function checkEditInputFields() {
  let titleValue = document.getElementById("titleEdit").value.trim();
  let dateValue = document.getElementById("dateEdit").value.trim();

  if (titleValue === "" || dateValue === "") {
    return false;
  } else {
    return true;
  }
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

function editSubtask(iconElement, id) {
  let ul = iconElement.closest("ul");
  let currentText = ul.querySelector("p").innerText;

  let newContainer = document.createElement("div");
  newContainer.classList.add("subtask_edit_wrapper");
  newContainer.id = `edit-subtask-${id}`;
  newContainer.innerHTML = `
    <input type="text" value="${currentText}" class="subtask_input_edit noBorder">
    <div class="edit_subtask_checkbox">
      <img class="edit_icons edit_icons_subtask_change" src="../assets/icons/check-subtask.png" onclick="saveSubtask(this, '${id}')">
      <div class="seperator_edit"></div>
      <img onclick="completeDeleteTask('edit-subtask-${id}')" class="edit_icons edit_icons_subtask_change" src="../assets/icons/delete.png">
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

function saveSubtask(iconElement, id) {
  let updatedSubtask = iconElement.closest(".subtask_edit_wrapper");
  let newValue = updatedSubtask.querySelector("input").value.trim();

  if (newValue === "") {
    return
  } else {
    let newUL = document.createElement("ul");
    newUL.classList.add("subtask_list_edit");
    newUL.id = `Subtask${newValue}-${id}`;
    newUL.innerHTML = `
      <li>
        <div class="flex_edit">
          <p>${newValue}</p>
          <div class="hide_edit_subtask">
            <img onclick="editSubtask(this)" class="edit_icons" src="../assets/icons/edit.png">
            <div class="seperator_edit"></div>
            <img onclick="completeDeleteTask('Subtask${newValue}-${id}')" class="edit_icons" src="../assets/icons/delete.png">
          </div>
        </div>
      </li>
    `;
  
    updatedSubtask.replaceWith(newUL);
  }
  
}

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

async function initEditContacts(assignedTo = []) {
  let contacts = await loadContacts();
  renderContactListEdit(contacts, assignedTo);
  assignedToEditTemp = [...assignedTo];
  updateAssignedMembersEdit(assignedToEditTemp);
  document.body.overflow = "hidden";
}

function openAssignedToEdit() {
  let editMembers = document.getElementById("editMembers");

  let editIsVisible = editMembers.classList.toggle("show");

  toggleBorderColor("selectMember", editIsVisible ? "add" : "remove");
  toggleArrow("arrow", editIsVisible ? "open" : "close");

  initEditContacts(assignedToEditTemp);


  if (editIsVisible) {
    setTimeout(() => {
      document.addEventListener("click", handleClickOutsideEditContacts);
    }, 0);
  }
}

function handleClickOutsideEditContacts(event) {
  let editMembers = document.getElementById("editMembers");
  let input = document.getElementById("contactSearchInputEdit");
  let arrow = document.getElementById("arrow");

  if (
    !editMembers.contains(event.target) &&
    !input.contains(event.target) &&
    !arrow.contains(event.target)
  ) {
    editMembers.classList.remove("show");
    toggleBorderColor("selectMember", "remove");
    toggleArrow("arrow", "close");
    document.removeEventListener("click", handleClickOutsideEditContacts);
  }
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
                  id="contactEdit${contact.id}"
                  class="optionsCategory inputFlex ${
                    isAssigned ? "assignedBg" : ""
                  }">
                  <div class="contacts_name_icon">
                    <p class="assigned_to_icon ${assignedColor}">${contact.firstname
    .toUpperCase()
    .charAt(0)}${contact.lastname.toUpperCase().charAt(0)}</p>
                    ${contact.firstname + " "} ${contact.lastname}
                  </div>
                  <input id="checkboxEdit${contact.id}" type="checkbox" class="checkBox" ${
                    isAssigned ? "checked" : ""
                  } />
                  <img
                    onclick="getContactEdit('${contact.id}', event)"
                    id="checkBoxImgEdit${contact.id}"
                    class="checkBoxImg ${isAssigned ? "filterChecked" : ""}"
                    src="${
                      isAssigned
                        ? "../assets/icons/Check button true.png"
                        : "../assets/icons/Check button.png"
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

async function updateAssignedMembersEdit(assignedTo) {
  let assignedMembersEditRef = document.getElementById("assignedMembersEdit");
  if (!assignedMembersEditRef) return;
  assignedMembersEditRef.innerHTML = "";

  let contacts = await loadContacts();
  let visibleCount = 5;
  let total = assignedTo.length;

  assignedTo.forEach((id, index) => {
    const user = contacts.find(c => c.id === id);
    if (!user) return;

    let initials = `${user.firstname[0].toUpperCase()}${user.lastname[0].toUpperCase()}`;
    let icon = document.createElement("p");
    let colorClass = getAvatarColorClass(`${user.firstname} ${user.lastname}`);
    icon.className = `assigned_to_icon ${colorClass}`;
    icon.textContent = initials;

    if (index < visibleCount) {
      assignedMembersEditRef.appendChild(icon);
    }
  });

  if (total > visibleCount) {
    let hiddenUsers = assignedTo.slice(visibleCount).map(id =>
      contacts.find(c => c.id === id)
    );

    let plusWrapper = document.createElement("div");
    plusWrapper.classList.add("plusWrapperEdit");

    let plusIcon = document.createElement("p");
    plusIcon.className = "assignedPlusOneEdit";
    plusIcon.textContent = `+${total - visibleCount}`;

    let tooltip = document.createElement("div");
    tooltip.classList.add("bubbleTooltipEdit");

    hiddenUsers.forEach(user => {
      if (!user) return;
      let initials = `${user.firstname[0].toUpperCase()}${user.lastname[0].toUpperCase()}`;
      let colorClass = getAvatarColorClass(`${user.firstname} ${user.lastname}`);
      let icon = document.createElement("p");
      icon.className = `assigned_to_icon ${colorClass}`;
      icon.textContent = initials;
      tooltip.appendChild(icon);
    });

    plusWrapper.appendChild(plusIcon);
    plusWrapper.appendChild(tooltip);
    assignedMembersEditRef.appendChild(plusWrapper);
  }
}

function getContactEdit(id) {
  let membersRef = document.getElementById("contactEdit" + id);
  let inputRef = document.getElementById("checkboxEdit" + id);
  let checkBoxImg = document.getElementById("checkBoxImgEdit" + id);

  if (!inputRef.checked) {
    getInputCheckedTrue(membersRef, inputRef, checkBoxImg);
  } else if (inputRef.checked && membersRef.classList.contains("assignedBg")) {
    getInputCheckedFalse(membersRef, inputRef, checkBoxImg);
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

function renderAssignedTo(assignedToIds) {
  if (!assignedToIds || assignedToIds.length === 0) {
    return `<div>Currently unassigned</div>`;
  }

  const MAX_VISIBLE = 5;
  const visibleIds = assignedToIds.slice(0, MAX_VISIBLE);
  const extraCount = assignedToIds.length - MAX_VISIBLE;

  let html = visibleIds
    .map((id, index) => {
      let contactRef = globalContacts.find((contact) => contact.id === id);
      if (!contactRef) return "";
      let name = `${contactRef.firstname} ${contactRef.lastname}`;
      let initials = getInitials(name);
      let colorClass = getAvatarColorClass(name);
      let leftOffset = index * 24;

      return `
        <div class="assigned ${colorClass}" style="position:absolute; left: ${leftOffset}px">
          ${initials
            .split("")
            .map((letter) => `<span>${letter}</span>`)
            .join("")}
        </div>`;
    })
    .join("");

  if (extraCount > 0) {
    let leftOffset = MAX_VISIBLE * 24;
    html += `
      <div class="assigned more" style="position:absolute; left: ${leftOffset}px">
        +${extraCount}
      </div>`;
  }

  return html;
}

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

function checkemptyDateEdit() {
  let dateRef = document.getElementById("dateEdit");
  let errorDateRef = document.getElementById("errorDateEdit");
  if (!dateRef.value) {
    dateRef.classList.add("inputError");
    errorDateRef.classList.remove("opacity");
    checkDate = false;
  } else {
    dateRef.classList.remove("inputError");
    errorDateRef.classList.add("opacity");
    checkDate = true;
  }
}

function setMinDate() {
  const dateInput = document.getElementById('date');
  dateInput.min = getTodayStr();
}

function disableScroll() {
  document.body.classList.add("no-scroll");
  document.documentElement.classList.add("no-scroll");
}

function enableScroll() {
  document.body.classList.remove("no-scroll");
  document.documentElement.classList.remove("no-scroll");
}