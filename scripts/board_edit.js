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

async function initEditContacts(assignedTo = []) {
  let contacts = await loadContacts();
  renderContactListEdit(contacts, assignedTo);
  assignedToEditTemp = [...assignedTo];
  updateAssignedMembersEdit(assignedToEditTemp);
  document.body.overflow = "hidden";
}

async function updateDataEdit(tasksEditRef) {
  if (!checkEditInputFields()) return;

  let tasks = await fetchData("/tasks/");
  let taskKeyEdit = Object.keys(tasks).find(
    (k) => String(tasks[k].id) === String(tasksEditRef)
  );
  let prioButton = document.querySelector(".prio_edit_button.active");
  let priorityEdit = prioButton.dataset.prio;
  let data = dataEditObject(tasks, taskKeyEdit, priorityEdit);

  await putDataEdit(`/tasks/${taskKeyEdit}`, data);
  await loadTasks();
  overlayTask(data.id);
}

function dataEditObject(tasks, taskKeyEdit, priorityEdit) {
  return {
    id: tasks[taskKeyEdit].id,
    category: tasks[taskKeyEdit].category,
    title: document.getElementById("titleEdit").value,
    description: document.getElementById("descriptionEdit").value,
    date: document.getElementById("dateEdit").value,
    priority: priorityEdit,
    assignedTo: assignedToEditTemp,
    subTasksOpen: getUpdatedSubtasks(),
    subTasksClosed: tasks[taskKeyEdit].subTasksClosed,
    status: tasks[taskKeyEdit].status,
  };
}

function checkEditInputFields() {
  let titleValue = document.getElementById("titleEdit").value.trim();
  let dateValue = document.getElementById("dateEdit").value.trim();

  if (titleValue === "" || dateValue === "") {
    return false;
  } else {
    return true;
  }
}

async function putDataEdit(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

function editSubtask(iconElement, id) {
  let ul = iconElement.closest("ul");
  let currentText = ul.querySelector("p").innerText;
  let newContainer = document.createElement("div");

  newContainer.classList.add("subtask_edit_wrapper");
  newContainer.id = `edit-subtask-${id}`;
  newContainer.innerHTML = getEditSubtaskContainer(currentText, id);
  ul.replaceWith(newContainer);
  let inputActive = newContainer.querySelector("input");
  inputActive.focus();
  inputActive.setSelectionRange(
    inputActive.value.length,
    inputActive.value.length
  );
}

function openAssignedToEdit() {
  let editMembers = document.getElementById("editMembers");

  let editIsVisible = editMembers.classList.toggle("show");

  toggleBorderColor("selectMember", editIsVisible ? "add" : "remove");
  toggleArrow("arrow", editIsVisible ? "open" : "close");

  initEditContacts(assignedToEditTemp);

  if (editIsVisible) {
    setTimeout(() => {
      document.addEventListener("click", handleClickOutsideEditContacts);
    }, 0);
  }
}

function handleClickOutsideEditContacts(event) {
  let editMembers = document.getElementById("editMembers");
  let input = document.getElementById("contactSearchInputEdit");
  let arrow = document.getElementById("arrow");

  if (
    !editMembers.contains(event.target) &&
    !input.contains(event.target) &&
    !arrow.contains(event.target)
  ) {
    editMembers.classList.remove("show");
    toggleBorderColor("selectMember", "remove");
    toggleArrow("arrow", "close");
    document.removeEventListener("click", handleClickOutsideEditContacts);
  }
}

function renderContactListEdit(contacts, assignedTo = []) {
  let editMembersRef = document.getElementById("editMembers");
  editMembersRef.innerHTML = "";

  if (contacts) {
    for (let contact of contacts) {
      let name = contact.firstname + " " + contact.lastname;
      let assignedColor = getAvatarColorClass(name);
      let isAssigned = assignedTo.includes(contact.id);
      editMembersRef.innerHTML += getContactListEdit(
        contact,
        assignedColor,
        isAssigned
      );
    }
  }
}

function filterEditContactList() {
  let input = document
    .getElementById("contactSearchInputEdit")
    .value.toLowerCase();
  let editMembersRef = document.getElementById("editMembers");
  let editMembersListItem = editMembersRef.querySelectorAll("li");

  editMembersListItem.forEach((item) => {
    let text = item.textContent.toLowerCase();
    item.style.display = text.includes(input) ? "flex" : "none";
  });
}

async function updateAssignedMembersEdit(assignedTo) {
  const container = document.getElementById("assignedMembersEdit");
  if (!container) return;

  container.innerHTML = "";

  const contacts = await loadContacts();
  const visibleCount = 5;

  renderVisibleAvatars(container, contacts, assignedTo, visibleCount);

  if (assignedTo.length > visibleCount) {
    renderOverflowIcon(container, assignedTo, visibleCount);
  }
}

function renderVisibleAvatars(container, contacts, assignedTo, count) {
  assignedTo.slice(0, count).forEach((id) => {
    const user = contacts.find((c) => c.id === id);
    if (!user) return;

    const icon = createUserIcon(user);
    container.appendChild(icon);
  });
}

function renderOverflowIcon(container, assignedTo, startIndex) {
  const remaining = assignedTo.length - startIndex;
  if (remaining <= 0) return;

  const plusWrapper = document.createElement("div");
  plusWrapper.classList.add("plusWrapperEdit");

  const plusIcon = document.createElement("p");
  plusIcon.className = "assignedPlusOneEdit";
  plusIcon.textContent = `+${remaining}`;

  plusWrapper.appendChild(plusIcon);
  container.appendChild(plusWrapper);
}

function createUserIcon(user) {
  const initials = `${user.firstname[0].toUpperCase()}${user.lastname[0].toUpperCase()}`;
  const icon = document.createElement("p");
  const colorClass = getAvatarColorClass(`${user.firstname} ${user.lastname}`);

  icon.className = `assigned_to_icon ${colorClass}`;
  icon.textContent = initials;

  return icon;
}

function getContactEdit(id) {
  let membersRef = document.getElementById("contactEdit" + id);
  let inputRef = document.getElementById("checkboxEdit" + id);
  let checkBoxImg = document.getElementById("checkBoxImgEdit" + id);

  if (!inputRef.checked) {
    getInputCheckedTrue(membersRef, inputRef, checkBoxImg);
  } else if (inputRef.checked && membersRef.classList.contains("assignedBg")) {
    getInputCheckedFalse(membersRef, inputRef, checkBoxImg);
  }
  toggleAssignmentEdit(id);
}

function toggleAssignmentEdit(id) {
  let index = assignedToEditTemp.indexOf(id);
  if (index !== -1) {
    assignedToEditTemp.splice(index, 1);
  } else {
    assignedToEditTemp.push(id);
  }
}

function checkemptyDateEdit() {
  let dateRef = document.getElementById("dateEdit");
  let errorDateRef = document.getElementById("errorDateEdit");
  if (!dateRef.value) {
    dateRef.classList.add("inputError");
    errorDateRef.classList.remove("opacity");
    checkDate = false;
  } else {
    dateRef.classList.remove("inputError");
    errorDateRef.classList.add("opacity");
    checkDate = true;
  }
}

function upToDateEdit() {
  let dateInput = document.getElementById("dateEdit");
  dateInput.min = getTodayStr();
}
