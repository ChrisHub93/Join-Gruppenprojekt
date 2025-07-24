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

function startDragging(id) {
  currentDraggedElement = id;
}

function allowDrop(event) {
  event.preventDefault();
}

function highlight(id) {
  const el = document.getElementById(id);
  el.classList.add("dragContainer");
}

function removeHighlight(id) {
  const el = document.getElementById(id);
  el.classList.remove("dragContainer");
}
