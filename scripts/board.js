let todos = [
  {
    id: 0,
    title: "Test new Task",
    category: "User Story",
    description: "build with start",
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
    priority: "medium",
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
    priority: "medium",
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
    addOverlayRef.classList.remove('d-nonevip');
    dialogTaskContentRef.innerHTML = renderOverlayTaskContent(tasksRef);
}

function closeOverlay(event) {
    let addOverlayRef = document.getElementById('overlayTask');
    if(event.target === addOverlayRef || event.target.classList.contains('closeIcon')){
    addOverlayRef.classList.add('d-nonevip');
    }
}

function renderOverlayTaskContent(tasksRef) {
  return `
          <div class="flex_between">
            <div class="filledContainer__category">
              <p>${tasksRef.category}</p>
            </div>
              <img onclick="closeOverlay(event)" class="closeIcon" src="../assets/icons/close.png" alt="">
          </div>
            <div class="filledContainer__title">
              <p>${tasksRef.title}</p>
            </div>
            <div class="filledContainer__description">
              <p>${tasksRef.description}</p>
            </div>
            <div class="filledContainer__dueDate">
              <p>Due Date: ${tasksRef.date}</p>
            </div>
            <div class="filledContainer__priority">
              <p>Priority: ${tasksRef.priority}</p>
            </div>
            <div class="filledContainer__assignedTo">
              <p>Assigned to: ${tasksRef.assignedTo}</p>
            </div>
            <div class="filledContainer__subTasks">
              <p>Subtasks: ${tasksRef.subTasks}</p>
            </div>
  `
}

function getTaskTemplate(element) {
  return `<div onclick="overlayTask(${element["id"]})" class="filledContainer" draggable = "true" ondragstart="startDragging(${element["id"]})">
              <div class="filledContainer__category">
                <p>User Story</p>
              </div>
              <div class="filledContainer__title">
                <p>${element.title}</p>
              </div>
              <div class="filledContainer__description">
                <p>Build with start page with recipe recommandation...</p>
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
                <p>1/2 Subtasks</p>
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
   <div class="emptyContainer">
              <p class="emptyContainer__text"></p>
              <p></p>
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
