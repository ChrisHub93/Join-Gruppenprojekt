let todos = [
  {
    id: 0,
    title: "Test new Task",
    category: "User Story",
    description: "Build with start page with recipe recommandation...",
    assignedTo: ["Chris Mü", "Kenan Ce", "Dave Ha"],
    subTasks: ["Task1", "Task2"],
    priority: "medium",
    date: "10/06/2025",
    status: "To do",
  },
  {
    id: 1,
    title: "Kochwelt Page & Recipe Recommander",
    category: "Technical Task",
    description: "build with start",
    assignedTo: "",
    subTasks: ["Task1"],
    priority: "low",
    date: "",
    status: "In progress",
  },
  {
    id: 2,
    title: "Kochwelt Page & Recipe Recommander",
    category: "User Story",
    description: "build with start",
    assignedTo: "",
    subTasks: [],
    priority: "urgent",
    date: "11/11/25",
    status: "Await feedback",
  },
  {
    id: 3,
    title: "Kochwelt Page & Recipe Recommander",
    category: "User Story",
    description: "build with start",
    assignedTo: "",
    subTasks: "Task1",
    priority: "medium",
    date: "11/11/25",
    status: "Done",
  },
];

function loadTasks() {
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

function moveTo(status) {
  todos[currentDraggedElement]["status"] = status;
  loadTasks();
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
  addOverlayRef.classList.add("active");
  dialogTaskContentRef.style.transform = "translateX(100%)";
  dialogTaskContentRef.style.opacity = "0";
  dialogTaskContentRef.innerHTML = renderOverlayTaskContent(tasksRef);

  requestAnimationFrame(() => {
    dialogTaskContentRef.style.transform = "translateX(0)";
    dialogTaskContentRef.style.opacity = "1";
  });
}

function closeOverlay(event) {
  let addOverlayTaskRef = document.getElementById("overlayTask");
  let addOverlayEditRef = document.getElementById("overlayTaskEdit");
  let dialogTaskContentRef = document.getElementById("dialogTaskContent");
  let dialogTaskEditContent = document.getElementById("dialogTaskEditContent");
  if (
    event.target === addOverlayTaskRef ||
    event.target.closest("#overlayTask .closeIcon")
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

let flatpickrInstance = null;
function toggleFlatpickr() {
  if (!flatpickrInstance) {
    flatpickrInstance = flatpickr("#date", {
      dateFormat: "d/m/Y",
      allowInput: true,
    });
  }
}

function renderOverlayTaskEdit(tasksEditRef) {
  let prio = tasksEditRef.priority.toLowerCase();
  toggleFlatpickr();

  return `
      <div class="edit_dialog_wrapper">
        <div class="edit_close_container">
          <img onclick="closeOverlay(event)" class="closeIcon" src="../assets/icons/close.png" alt="">
        </div>

      <div class="edit_dialog_scrollable">
        <div class="form_edit_task">
          <div class="form_edit_container">
            <label for="title">Title</label>
            <input class="border_edit_active" type="text" id="title" name="title" value="${
              tasksEditRef.title
            }" required>
          </div>
          <div class="form_edit_container">
            <label for="description">Description</label>
            <textarea class="border_edit_active" id="description" name="description">${
              tasksEditRef.description
            }</textarea>
          </div>
          <div class="form_edit_container">
            <label for="date">Due Date</label>
            <input onclick="toggleFlatpickr(event)" class="duedate_edit border_edit_active" type="text" id="date" name="date" value="${
              tasksEditRef.date
            }" placeholder="dd/mm/yyyy" required>
          </div>
          <div class="form_edit_container">
            <h4>Priority</h4>
            <div class="prio_edit_container">
              ${renderPrioButton("urgent", prio)}
              ${renderPrioButton("medium", prio)}
              ${renderPrioButton("low", prio)}
            </div>
          </div>
          <div class="form_edit_container">
            <span>Assigned to</span>
              <div class="category">
                <div id="assignedContainer" class="inputSelectContact" onclick="openAssignedTo()">
                  <span id="selectMember" class="select inputFlex">
                    Select Contacts to Assign
                  </span>
                  <img id="arrow" class="arrow inputStyleArrow" src="/assets/icons/arrow_drop_down.png"/>
                </div>
                <ul id="allMembers" class="options">
                
                </ul>
              </div>
                <div id="assignedMembers"></div>
          </div>
          <div class="form_edit_container">
            <label for="subTaskInput">Subtasks</label>
            <div class="edit_subtask_input">  
              <input class="border_edit_active" type="text" name="subtasks" id="subTaskInput" placeholder="Add new subtask"/>
              <img onclick="chooseSubTask()" id="plusIcon" class="plusIcon_edit" src="../assets/icons/Subtasks-plus.png"/>
              <div id="cancelOrCheck" class="cancelOrCheck d-nonevip">
                <img ="deleteTask()" src="../assets/icons/iconoir_cancel.png"/>
                <div class="subTasksSeperator"></div>
                <img onclick="addTask()" src="../assets/icons/Property 1=check.png"/>
              </div>
            </div>
            <div id="subTasks"></div>
          </div>
        </div>
        </div>
          <div class="edit_okay_box">
          <button class="edit_okay"> Ok
          <img src="../assets/icons/check.png">
          </button>
          </div>
        </div>
  `;
}

function assignedLineRender(initials, name, assignedColor) {
  return `
    <div class="assigned_to_line">
      <p class="assigned_to_icon ${assignedColor}">${initials}</p>
      <p class="assigned_to_name">${name}</p>
    </div>`;
}

function subtasksOverlayRender(subtasks) {
  return `
    <div class="subtask_container">
      ${subtasks
        .map(
          (subtask) => `
        <div class="subtask_toggle">
          <img class="subtask-icon" src="../assets/icons/subtask-unchecked.png" onclick="toggleSubtask(this)">
          <p class="cursor_overlay_task">${subtask}</p>
        </div>
      `
        )
        .join("")}
    </div>
  `;
}

function renderOverlayTaskContent(tasksRef) {
  return `
          <div class="flex_between">
            <div class="filledContainer__category">
              <p class="cursor_overlay_task">${tasksRef.category}</p>
            </div>
              <img onclick="closeOverlay(event)" class="closeIcon" src="../assets/icons/close.png" alt="">
          </div>
            <div class="filledContainer__title">
              <h1 class="cursor_overlay_task">${tasksRef.title}</h1>
            </div>
            <div class="filledContainer__description">
              <p class="cursor_overlay_task overlay_text_black">${
                tasksRef.description
              }</p>
            </div>
            <div class="filledContainer__dueDate flex_gap25">
              <p class="cursor_overlay_task">Due Date:</p>
              <p class="cursor_overlay_task">${tasksRef.date}</p>
            </div>
            <div class="filledContainer__priority flex_gap25">
              <p class="cursor_overlay_task">Priority: </p>
              <div class="flex_gap10">
                <p class="cursor_overlay_task">${
                  tasksRef.priority.charAt(0).toUpperCase() +
                  tasksRef.priority.slice(1).toLowerCase()
                }</p>
                <img class="prio_overlay_task" src="../assets/icons/priority-${
                  tasksRef.priority
                }.png" alt="${tasksRef.priority} priority icon">
              </div>
            </div>
            <div class="filledContainer__assignedTo flex_column_overlayTask">
              <p class="cursor_overlay_task">Assigned to:</p>
              <div class="assigned_to_container">${getAssignedInitials(
                tasksRef.assignedTo
              )}</div>
            </div>
            <div class="filledContainer__subTasks flex_column_overlayTask">
              <p class="cursor_overlay_task">Subtasks:</p>
              ${subtasksOverlay(tasksRef.subTasks)}
            </div>
            <div class="flex_end_gp8">
              <div class="bottom_overlay_task delete_task">
                <img src="../assets/icons/Property 1=delete.png">
                <p>Delete</p>
              </div>
              <div class="seperator_overlay_task"></div>
              <div onclick="editOverlayTask('${tasksRef.id}'); initAddTask()" class="bottom_overlay_task edit_task">
                <img src="../assets/icons/Property 1=edit.png">
                <p>Edit</p>
              </div>
            </div>
  `;
}

function getTaskTemplate(element) {
  return `<div onclick="overlayTask(${element["id"]})" class="filledContainer" draggable = "true" ondragstart="startDragging(${element["id"]})">
              <div class="filledContainer__category">
                <p>${element.category}</p>
              </div>
              <div class="filledContainer__title">
                <p>${element.title}</p>
              </div>
              <div class="filledContainer__description">
                <p>${element.description}</p>
              </div>
              <div class="filledContainer__status">
                <div
                  class="statusLine"
                  role="progressbar"
                  aria-label="Example with label"
                  aria-valuenow="25"
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  <div
                    id="status-bar-js"
                    class="progress-bar"
                    style="width: 50%"
                  ></div>
                </div>
                <p>1/3 Subtasks</p>
              </div>
              <div class="taskInfo">
                <div id="assignedTo" class="assignedTo">
                  <div class="assigned">
                    <span>A</span>
                    <span>M</span>
                  </div>
                  <div class="assigned assignedPlusOne">
                    <span>C</span>
                    <span>M</span>
                  </div>
                  <div class="assigned assignedPlusTwo">
                    <span>K</span>
                    <span>A</span>
                  </div>
                </div>

                <div class="priority">
                  <img src="../assets/icons/Prio media.png" alt="prio icon" />
                </div>
              </div>
            </div>
            
            `;
}

function getDragTemplate() {
  return `
   <div class="dragContainer">
            </div>
  `;
}

function getEmptyTemplate() {
  return `
   <div class="emptyContainer">
              <p class="emptyContainer__text">No Tasks To do</p>
              <p></p>
            </div>
  `;
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
