let todos = [
  {
    id: 0,
    title: "Test new Task",
    category: "User Story",
    description: "Build with start page with recipe recommandation...",
    assignedTo: "",
    subTasks: "Task1",
    priority: "medium",
    date: "11/11/25",
    status: "To do",
  },
  {
    id: 1,
    title: "Kochwelt Page & Recipe Recommander",
    category: "Technical Task",
    description: "build with start",
    assignedTo: "",
    subTasks: "Task1",
    priority: "low",
    date: "11/11/25",
    status: "In progress",
  },
  {
    id: 2,
    title: "Kochwelt Page & Recipe Recommander",
    category: "User Story",
    description: "build with start",
    assignedTo: "",
    subTasks: "Task1",
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
    let addOverlayRef = document.getElementById('overlayTask')
    let dialogTaskContentRef = document.getElementById("dialogTaskContent")
    addOverlayRef.classList.add('active');
    dialogTaskContentRef.style.transform = 'translateX(100%)';
    dialogTaskContentRef.style.opacity = '0';
    dialogTaskContentRef.innerHTML = renderOverlayTaskContent(tasksRef);

    requestAnimationFrame(() => {
        dialogTaskContentRef.style.transform = 'translateX(0)';
        dialogTaskContentRef.style.opacity = '1';
    });
}

function closeOverlay(event) {
    let addOverlayRef = document.getElementById('overlayTask');
    let dialogTaskContentRef = document.getElementById("dialogTaskContent")
    if(event.target === addOverlayRef || event.target.classList.contains('closeIcon')){
      dialogTaskContentRef.style.transform = 'translateX(100%)';
      dialogTaskContentRef.style.opacity = '0';

      setTimeout(() => {
        addOverlayRef.classList.remove('active');
        dialogTaskContentRef.style.transform = '';
        dialogTaskContentRef.style.opacity = '';
      }, 300);
    }
}

function toggleSubtask(img) {
  let fileName = img.src.split('/').pop();
  let isChecked = fileName === 'subtask-checked.png';

    if (isChecked) {
      img.src = '../assets/icons/subtask-unchecked.png';
    } else {
      img.src = '../assets/icons/subtask-checked.png';
    }
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
              <p class="cursor_overlay_task overlay_text_black">${tasksRef.description}</p>
            </div>
            <div class="filledContainer__dueDate flex_gap25">
              <p class="cursor_overlay_task">Due Date:</p>
              <p class="cursor_overlay_task">${tasksRef.date}</p>
            </div>
            <div class="filledContainer__priority flex_gap25">
              <p class="cursor_overlay_task">Priority: </p>
              <div class="flex_gap10">
                <p class="cursor_overlay_task">${tasksRef.priority.charAt(0).toUpperCase() + tasksRef.priority.slice(1).toLowerCase()}</p>
                <img class="prio_overlay_task" src="../assets/icons/priority-${tasksRef.priority}.png" alt="${tasksRef.priority} priority icon">
              </div>
            </div>
            <div class="filledContainer__assignedTo flex_column_overlayTask">
              <p class="cursor_overlay_task">Assigned to:</p>
              <div>${tasksRef.assignedTo}</div>
            </div>
            <div class="filledContainer__subTasks flex_column_overlayTask">
              <p class="cursor_overlay_task">Subtasks:</p>
                <div class="subtask_toggle">
                  <img class="subtask-icon" src="../assets/icons/subtask-unchecked.png" onclick="toggleSubtask(this)">
                  <p class="cursor_overlay_task">${tasksRef.subTasks}</p>
                </div>
            </div>
            <div class="flex_end_gp8">
              <div class="bottom_overlay_task delete_task">
                <img src="../assets/icons/Property 1=delete.png">
                <p>Delete</p>
              </div>
              <div class="seperator_overlay_task"></div>
              <div class="bottom_overlay_task edit_task">
                <img src="../assets/icons/Property 1=edit.png">
                <p>Edit</p>
              </div>
            </div>
  `
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
  const addOverlayRef = document.getElementById('overlayAddTask');
  const openAddTaskOverlayRef = document.getElementById('addTaskContent');
  
  document.body.style.overflow = 'hidden';
  addOverlayRef.classList.remove('d-nonevip');
  openAddTaskOverlayRef.innerHTML = getAddTaskTemplate();
}

function closeAddTaskOverlay() {  
  const addOverlayRef = document.getElementById('overlayAddTask');
  
  document.body.style.overflow = '';
  addOverlayRef.classList.add('d-nonevip');
}