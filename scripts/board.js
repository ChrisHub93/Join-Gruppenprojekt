let todos = [];

async function loadTasks() {
  console.log(todos);
  
  await logIn();
  todos = todos[0];
  // todos.flat();
  console.log(todos);
  
  let toDoContentRef = document.getElementById("toDoContent");
  let inProgressContentRef = document.getElementById("inProgressContent");
  let awaitFeedbackContentRef = document.getElementById("awaitFeedbackContent");
  let doneContentRef = document.getElementById("doneContent");

  let statusToDo = todos.filter((task) => task["status"] == "To do");

  let statusInProgress = todos.filter(
    (task) => task["status"] == "In progress"
  );
  let statusAwaitFeedback = todos.filter(
    (task) => task["status"] == "Await feedback"
  );
  let statusDone = todos.filter((task) => task["status"] == "Done");

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

let currentDraggedElement;

function startDragging(id) {
  currentDraggedElement = id;
  console.log(currentDraggedElement);
}

function allowDrop(event) {
  event.preventDefault();
}

async function moveTo(status) {
  console.log(todos);
  
  todos[currentDraggedElement].status = "(status)";
  await status;
  console.log(status);
  console.log(todos);
  
  
  putDataStatus(`status/${status}`);
  loadTasks();
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
  let tasksRef = todos[element];
  let addOverlayRef = document.getElementById("overlayTask");
  let dialogTaskContentRef = document.getElementById("dialogTaskContent");
  let addOverlayEditRef = document.getElementById("overlayTaskEdit");
  let checkOpenOverlayEdit = addOverlayEditRef.classList.contains("active");
  let checkOpenOverlay = addOverlayRef.classList.contains("active");
  addOverlayEditRef.classList.remove("active");
  addOverlayRef.classList.add("active");
  dialogTaskContentRef.innerHTML = renderOverlayTaskContent(tasksRef);
  if (!checkOpenOverlay && !checkOpenOverlayEdit) {
    dialogTaskContentRef.style.transform = "translateX(100%)";
    dialogTaskContentRef.style.opacity = "0";
    requestAnimationFrame(() => {
    dialogTaskContentRef.style.transform = "translateX(0)";
    dialogTaskContentRef.style.opacity = "1";
    });
  }
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

function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function getAssignedInitials(assignedToArray) {
  if (assignedToArray === "") {
    return `
    <p class="assigned_to_empty">Nobody assigned yet</p>`;
  } else {
    return assignedToArray
      .map((name) => {
        let initials = getInitials(name);
        let assignedColor = getAvatarColorClass(name);
        return assignedLineRender(initials, name, assignedColor);
      })
      .join("");
  }
}

function getAvatarColorClass(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  let index = Math.abs(hash) % 15;
  return `initials_color_${index}`;
}

function subtasksOverlay(subtasks) {
  if (subtasks === "") {
    return "";
  } else {
    return subtasksOverlayRender(subtasks);
  }
}

function taskOverlaySync() {
  let dialogTaskContentRef = document.getElementById("dialogTaskContent");
  let dialogTaskEditContentRef = document.getElementById("dialogTaskEditContent");

  if (dialogTaskContentRef && dialogTaskEditContentRef) {
    dialogTaskEditContentRef.style.height = dialogTaskContentRef.offsetHeight + "px";
  }
}

function editOverlayTask(tasksRef) {
  taskOverlaySync();
  let tasksEditRef = todos[tasksRef];
  let addOverlayRef = document.getElementById("overlayTask");
  let addOverlayEditRef = document.getElementById("overlayTaskEdit");
  let dialogTaskEditRef = document.getElementById("dialogTaskEditContent");
  addOverlayRef.classList.remove("active");
  addOverlayEditRef.classList.add("active");
  dialogTaskEditRef.innerHTML = renderOverlayTaskEdit(tasksEditRef);
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
      ${prioFullName} <img class="prio_overlay_task" src="${isActive ? iconPathClicked : iconPath}">
    </button>
  `;
}

function setPrioActive(clickedButton) {
  let prioButtons = clickedButton.parentElement.querySelectorAll(".prio_edit_button");
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
    }}

function deleteBoardTask(tasksRef) {
    todos.splice(tasksRef, 1);
    loadTasks();
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
  initAddTask();
}

function closeAddTaskOverlay() {
  const addOverlayRef = document.getElementById("overlayAddTask");

    resetAllPriorities();
    document.body.style.overflow = "";
    addOverlayRef.classList.add("d-nonevip");
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

async function logIn() {
  let data = await loadData("/tasks");
  let tasktodos = Object.values(data);

  todos.push(tasktodos)

 console.log(todos);
 
// console.log(todos);

}

async function loadData(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseToJson = await response.json();

  return responseToJson;
}