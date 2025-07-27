function addEmptySubtasks() {
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
  loadTasks();
}

async function moveSubtaskBetweenLists(id, clickedID, fromKey, toKey) {
  const clickedValue = document.getElementById(clickedID).innerText.trim();
  let getTasks = await fetchData("tasks/");
  let taskKey = Object.keys(getTasks).find((key) => getTasks[key].id === id);
  if (!taskKey) return;
  let task = getTasks[taskKey];
  let fromSubtaskList = task[fromKey] || [];
  let toSubtaskList = task[toKey] || [];
  let subTaskIndex = fromSubtaskList.findIndex(
    (task) => task.trim() === clickedValue
  );
  if (subTaskIndex === -1) return;
  let [movedSubtask] = fromSubtaskList.splice(subTaskIndex, 1);
  toSubtaskList.push(movedSubtask);
  await patchData(`tasks/${taskKey}`, {
    [fromKey]: fromSubtaskList,
    [toKey]: toSubtaskList,
  });
}

async function postSubtaskClosed(id, clickedID) {
  await moveSubtaskBetweenLists(
    id,
    clickedID,
    "subTasksClosed",
    "subTasksOpen"
  );
}

async function postSubtaskOpen(id, clickedID) {
  await moveSubtaskBetweenLists(
    id,
    clickedID,
    "subTasksOpen",
    "subTasksClosed"
  );
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