let todos = [];
let currentDraggedElement;

async function loadTasks() {
  let tasks = await fetchData("/tasks/");
  if (tasks === null) {
    return;
  }
  todos = Object.values(tasks);
  // console.log(todos);

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

function startDragging(id) {
  currentDraggedElement = id;
  console.log(currentDraggedElement);
  rotateAnimation()
}

function stopDragging() {
  straightAnimation()
}

function allowDrop(event) {
  event.preventDefault();
}

function rotateAnimation() {
  const taskRef = document.getElementById(currentDraggedElement);
  taskRef.classList.remove("animate-straight");
  taskRef.classList.add("animate-rotate");
}

function straightAnimation() {
  const taskRef = document.getElementById(currentDraggedElement);
  taskRef.classList.remove("animate-rotate");
  taskRef.classList.add("animate-straight");
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

function toggleSubtask(img) {
  let fileName = img.src.split("/").pop();
  let isChecked = fileName === "subtask-checked.png";

  if (isChecked) {
    img.src = "../assets/icons/subtask-unchecked.png";
  } else {
    img.src = "../assets/icons/subtask-checked.png";
  }
}

function subtasksOverlay(subtasks) {
  if (subtasks === undefined) {
    return "";
  } else {
    return subtasksOverlayRender(subtasks);
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

function openAddTaskOverlay() {
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
    assignedTo: await searchContacts(),
    subTasks: getUpdatedSubtasks(),
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
    let editedSubtasks = document.querySelectorAll('.flex_edit');
    let updatedSubtasks = [];

  for (let el of editedSubtasks) {
    let pTag = el.querySelector('p');

    if (pTag) {
      let text = pTag.textContent.trim();
      if (text !== '') {
        updatedSubtasks.push(text);
      }
    }
  }
  return updatedSubtasks;
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
  inputActive.setSelectionRange(inputActive.value.length, inputActive.value.length);
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
  let searchInput = document.getElementById('filterTasks').value.trim().toLowerCase();
  console.log(searchInput)
  let filteredTask = todos.slice(0).filter(todos => todos.title.toLowerCase().includes(searchInput) || todos.description.toLowerCase().includes(searchInput));
  console.log(filteredTask);
  todos = filteredTask;
  loadSearch(todos);
}

function loadSearch(todos) {
  let searchInput = document.getElementById('filterTasks').value;
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