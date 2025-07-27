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

function saveSubtask(iconElement, id) {
  let updatedSubtask = iconElement.closest(".subtask_edit_wrapper");
  let newValue = updatedSubtask.querySelector("input").value.trim();
  if (newValue === "") {
    return;
  } else {
    let newUL = document.createElement("ul");
    newUL.classList.add("subtask_list_edit");
    newUL.id = `Subtask${newValue}-${id}`;
    newUL.innerHTML = saveSubtaskTemplate(newValue, id);
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