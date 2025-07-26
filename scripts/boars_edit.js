function editOverlayTask(tasksRef) {  
  taskOverlaySync();
  let tasksEditRef = searchElement(tasksRef);
  let addOverlayRef = document.getElementById("overlayTask");
  let addOverlayEditRef = document.getElementById("overlayTaskEdit");
  let dialogTaskEditRef = document.getElementById("dialogTaskEditContent");
  addOverlayRef.classList.remove("active");
  addOverlayEditRef.classList.add("active");
  dialogTaskEditRef.innerHTML = renderOverlayTaskEdit(todos[tasksEditRef]);
  upToDateEdit();  
}