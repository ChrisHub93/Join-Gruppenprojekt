let loadTodos = [];
let todos = [];
let globalContacts = [];
let isToggling = false;

function getLoadTasksTemplateFunctions(
  toDoContentRef,
  inProgressContentRef,
  awaitFeedbackContentRef,
  doneContentRef
) {
  toDoContentRef.innerHTML = getEmptyTemplate();
  inProgressContentRef.innerHTML = getEmptyTemplate();
  awaitFeedbackContentRef.innerHTML = getEmptyTemplate();
  doneContentRef.innerHTML = getEmptyTemplate();
}

function emptyContentHTML(
  toDoContentRef,
  inProgressContentRef,
  awaitFeedbackContentRef,
  doneContentRef
) {
  toDoContentRef.innerHTML = "";
  inProgressContentRef.innerHTML = "";
  awaitFeedbackContentRef.innerHTML = "";
  doneContentRef.innerHTML = "";
}

async function loadTasks() {
  let toDoContentRef = document.getElementById("toDoContent");
  let inProgressContentRef = document.getElementById("inProgressContent");
  let awaitFeedbackContentRef = document.getElementById("awaitFeedbackContent");
  let doneContentRef = document.getElementById("doneContent");
  let tasks = await fetchData("/tasks/");
  if (tasks === null) {
    getLoadTasksTemplateFunctions(
      toDoContentRef,
      inProgressContentRef,
      awaitFeedbackContentRef,
      doneContentRef
    );
    return;
  }
  loadTodos = Object.values(tasks);
  addEmptySubtasks();
  let contactsData = await fetchData("/contacts/");
  globalContacts = Object.values(contactsData);
  let statusToDo = todos.filter((task) => task.status === "To do");
  let statusInProgress = todos.filter((task) => task.status === "In progress");
  let statusAwaitFeedback = todos.filter(
    (task) => task.status === "Await feedback"
  );
  let statusDone = todos.filter((task) => task.status === "Done");
  emptyContentHTML(
    toDoContentRef,
    inProgressContentRef,
    awaitFeedbackContentRef,
    doneContentRef
  );
  checkAllStatus(
    statusToDo,
    toDoContentRef,
    statusInProgress,
    inProgressContentRef,
    statusAwaitFeedback,
    awaitFeedbackContentRef,
    statusDone,
    doneContentRef
  );
}

function checkAllStatus(
  statusToDo,
  toDoContentRef,
  statusInProgress,
  inProgressContentRef,
  statusAwaitFeedback,
  awaitFeedbackContentRef,
  statusDone,
  doneContentRef
) {
  checkStatusToDo(statusToDo, toDoContentRef);
  checkStatusInProgress(statusInProgress, inProgressContentRef);
  checkStatusAwaitFeedback(statusAwaitFeedback, awaitFeedbackContentRef);
  checkStatusDone(statusDone, doneContentRef);
}

function checkStatusToDo(statusToDo, toDoContentRef) {
  if (statusToDo.length === 0) {
    toDoContentRef.innerHTML = getEmptyTemplate();
  } else {
    for (let index = 0; index < statusToDo.length; index++) {
      const element = statusToDo[index];
      toDoContentRef.innerHTML += getTaskTemplate(element);
      calculateAndRenderProgressBar(element);
    }
  }
}

function checkStatusInProgress(statusInProgress, inProgressContentRef) {
  if (statusInProgress.length == 0) {
    inProgressContentRef.innerHTML = getEmptyTemplate();
  } else {
    for (let index = 0; index < statusInProgress.length; index++) {
      const element = statusInProgress[index];
      inProgressContentRef.innerHTML += getTaskTemplate(element);
      calculateAndRenderProgressBar(element);
    }
  }
}

function checkStatusAwaitFeedback(
  statusAwaitFeedback,
  awaitFeedbackContentRef
) {
  if (statusAwaitFeedback.length == 0) {
    awaitFeedbackContentRef.innerHTML = getEmptyTemplate();
  } else {
    for (let index = 0; index < statusAwaitFeedback.length; index++) {
      const element = statusAwaitFeedback[index];
      awaitFeedbackContentRef.innerHTML += getTaskTemplate(element);
      calculateAndRenderProgressBar(element);
    }
  }
}

function checkStatusDone(statusDone, doneContentRef) {
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

function calculateAndRenderProgressBar(element) {
  let percent = 0;
  let tasksOpenLength = element.subTasksOpen?.length ?? 0;
  let tasksClosedLength = element.subTasksClosed?.length ?? 0;
  let tasksLength = tasksOpenLength + tasksClosedLength;
  if (tasksLength === 0) {
    document.getElementById(
      "filledContainer-status" + element.id
    ).style.display = "none";
  } else {
    percent = Math.round((tasksClosedLength / tasksLength) * 100);
    document.getElementById(
      "status-bar-js" + element.id
    ).style = `width: ${percent}%`;
    document.getElementById(
      "status-bar-number1" + element.id
    ).innerText = `${tasksClosedLength}`;
    document.getElementById(
      "status-bar-number2" + element.id
    ).innerText = `${tasksLength}`;
  }
}

async function deleteBoardTasks(tasksRef) {
  let tasks = await fetchData("/tasks/");
  let key = Object.keys(tasks).find(
    (key) => String(tasks[key].id) === tasksRef
  );
  await deleteTasks("/tasks/", key);
  deleteOverlaySuccses();
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

function overlayTask(element) {
  let tasksRef = searchElement(element);
  let { addOverlayTaskRef, dialogTaskContentRef, addOverlayEditRef } =
    getOverlayElements();
  let checkOpenOverlayEdit = addOverlayEditRef.classList.contains("active");
  let checkOpenOverlay = addOverlayTaskRef.classList.contains("active");
  addOverlayEditRef.classList.remove("active");
  addOverlayTaskRef.classList.add("active");
  dialogTaskContentRef.innerHTML = renderOverlayTaskContent(todos[tasksRef]);
  disableScroll();
  if (!checkOpenOverlay && !checkOpenOverlayEdit) {
    overlaySlide(dialogTaskContentRef);
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

function getOverlayElements() {
  return {
    addOverlayTaskRef: document.getElementById("overlayTask"),
    dialogTaskContentRef: document.getElementById("dialogTaskContent"),
    addOverlayEditRef: document.getElementById("overlayTaskEdit"),
    dialogTaskEditContent: document.getElementById("dialogTaskEditContent"),
  };
}

function overlaySlide(element) {
  element.style.transform = "translateX(100%)";
  element.style.opacity = "0";
  requestAnimationFrame(() => {
    element.style.transform = "translateX(0)";
    element.style.opacity = "1";
  });
}

function closeOverlay(event) {
  let {
    addOverlayTaskRef,
    dialogTaskContentRef,
    addOverlayEditRef,
    dialogTaskEditContent,
  } = getOverlayElements();
  if (
    event.target === addOverlayTaskRef ||
    event.target.closest("#overlayTask .closeIcon") ||
    event.target.closest(".delete_task")
  ) {
    closeOverlayAnimation(dialogTaskContentRef, addOverlayTaskRef);
  } else if (
    event.target === addOverlayEditRef ||
    event.target.closest("#overlayTaskEdit .closeIcon")
  ) {
    closeOverlayAnimation(dialogTaskEditContent, addOverlayEditRef);
  }
}

function closeOverlayAnimation(contentRef, overlayRef) {
  contentRef.style.transform = "translateX(100%)";
  contentRef.style.opacity = "0";
  setTimeout(() => {
    overlayRef.classList.remove("active");
    contentRef.style.transform = "";
    contentRef.style.opacity = "";
  }, 300);
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

function renderPrioButton(prioName, activePrio) {
  let prioGet = prioName.toLowerCase();
  let isActive = prioGet === activePrio.toLowerCase();
  let prioFullName = prioName.charAt(0).toUpperCase() + prioName.slice(1);
  let iconPath = `../assets/icons/priority-${prioGet}.png`;
  let iconPathClicked = `../assets/icons/priority-clicked-${prioGet}.png`;
  return prioButtonTemplate(
    prioFullName,
    prioGet,
    isActive,
    iconPath,
    iconPathClicked
  );
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

function formatDateToDisplay(dateStr) {
  if (!dateStr) return "";

  if (dateStr.includes("/")) {
    return dateStr;
  }
  let [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

async function loadData(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseToJson = await response.json();
  return responseToJson;
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

function clearAllDocuments(){
  document.getElementById("toDoContent").innerHTML = "";
  document.getElementById("inProgressContent").innerHTML = "";
  document.getElementById("awaitFeedbackContent").innerHTML = "";
  document.getElementById("doneContent").innerHTML = "";
}

function renderStatus(status, elementId){
  if (status.length === 0) {
    elementId.innerHTML = getEmptyTemplate();
  } else {
    for (let index = 0; index < status.length; index++) {
      const element = statusToDo[index];
      elementId.innerHTML += getTaskTemplate(element);
      calculateAndRenderProgressBar(element);
    }
  }
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
  clearAllDocuments();
  renderStatus(statusToDo, toDoContentRef);
  renderStatus(statusInProgress, inProgressContentRef);
  renderStatus(statusAwaitFeedback, awaitFeedbackContentRef);
  renderStatus(statusDone, doneContentRef);
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

function disableScroll() {
  document.body.classList.add("no-scroll");
  document.documentElement.classList.add("no-scroll");
}

function enableScroll() {
  document.body.classList.remove("no-scroll");
  document.documentElement.classList.remove("no-scroll");
}