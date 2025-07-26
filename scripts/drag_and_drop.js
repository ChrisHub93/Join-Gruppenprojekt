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

function highlightDragContainer(id, action) {
  const el = document.getElementById(id);
  if (el && (action === 'add' || action === 'remove')) {
    el.classList[action]("dragContainer");
  }
}