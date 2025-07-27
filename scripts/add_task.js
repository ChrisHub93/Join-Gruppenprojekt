let priorityUrgent = false;
let priorityMedium = false;
let priorityLow = false;
let checkTitle = false;
let checkDate = false;
let checkCategory = false;
let currentStatus = "To do";
let setPriority = "";
let assignedTo = [];
let subtasksOpen = [];
let subtasksClosed = [];
let debounceTimeOut = 0;
let contactsToAssign;

function upToDate() {
  const dateInput = document.getElementById("date");
  dateInput.min = getTodayStr();
}

function removeValue(id) {
  let ref = document.getElementById(id);
  if (!ref) return;
  ref.value = "";
}

function removeInputError(id) {
  let ref = document.getElementById(id);
  if (!ref) return;
  ref.classList.remove("inputError");
}

function addOpacity(id) {
  let ref = document.getElementById(id);
  if (!ref) return;
  ref.classList.add("opacity");
}

function renderList() {
  let listRef = allMembers.querySelectorAll("li");
  for (let element of listRef) {
    element.classList.remove("assignedBg");
  }
}

function changeArrowOfInput() {
  let ref = document.getElementById("arrow");
  let currentSrc = ref.getAttribute("src");
  if (currentSrc.includes("arrow_drop_down.png")) {
    ref.src = "../assets/icons/arrow_drop_down.png";
  } else {
    ref.src = "../assets/icons/arrow_drop_down.png";
  }
}

function removeClasses() {
  let allMembers = document.getElementById("allMembers");
  let selectCategoryFieldRef = document.getElementById("selectCategoryField");
  renderList();
  setCheckBoxFalse();
  allMembers.classList.remove("show");
  changeArrowOfInput();
  selectCategoryFieldRef.innerHTML = "";
  selectCategoryFieldRef.innerHTML = getBasicSelectTemplate();
}

async function loadUsers() {
  let users = await fetchData("/users/");
  let contactsArray = Object.values(users);
  return contactsArray;
}

async function fetchData(path) {
  let response = await fetch(BASE_URL + path + ".json");
  let responseAsJson = await response.json();
  return responseAsJson;
}

function compare(firstUser, nextUser) {
  if (firstUser.firstname.toUpperCase() < nextUser.firstname.toUpperCase()) {
    return -1;
  } else if (
    firstUser.firstname.toUpperCase() > nextUser.firstname.toUpperCase()
  ) {
    return 1;
  } else {
    return 0;
  }
}

function toggleVisibility(id) {
  let ref = document.getElementById(id);
  if (!ref) return;
  ref.classList.toggle("show");
}

function toggleArrow(id) {
  let ref = document.getElementById(id);
  if (!ref) return;
  let currentSrc = ref.getAttribute("src");
  if (currentSrc.includes("arrow_drop_down.png")) {
    ref.src = "../assets/icons/arrow_drop_down2.png";
  } else {
    ref.src = "../assets/icons/arrow_drop_down.png";
  }
}

function toggleBorderColor(id) {
  let ref = document.getElementById(id);
  if (!ref) return;
  ref.classList.toggle("border-color");
}

async function openAssignedTo() {
  let allMembers = document.getElementById("allMembers");
  let membersAreVisible = allMembers.classList.toggle("show");
  toggleBorderColor("selectMember", membersAreVisible ? "add" : "remove");
  toggleArrow("arrow", membersAreVisible ? "open" : "close");
  if (membersAreVisible) {
    setTimeout(() => {
      document.addEventListener("click", handleClickOutsideAllMembers, true);
    }, 0);
  } else {
    document.removeEventListener("click", handleClickOutsideAllMembers, true);
  }
}

function handleClickOutsideAllMembers(event) {
  let allMembers = document.getElementById("allMembers");
  let input = document.getElementById("userNameWord");
  let arrow = document.getElementById("arrow");
  if (
    !allMembers.contains(event.target) &&
    !input.contains(event.target) &&
    !arrow.contains(event.target)
  ) {
    allMembers.classList.remove("show");
    toggleBorderColor("selectMember", "remove");
    toggleArrow("arrow", "close");
    document.removeEventListener("click", handleClickOutsideAllMembers, true);
  }
}

function getActiveUser(membersRef, id){
let selectedMember = document.getElementById("selected_name_icon" + id);
    if (!selectedMember) {
      getIcon(membersRef, id).then(() => {
        updateAssignedMembersDisplay();
      });
    } else {
      updateAssignedMembersDisplay();
    }
}

function getNotActiveUser(id){
   let selectedMember = document.getElementById("selected_name_icon" + id);
    if (selectedMember) {
      selectedMember.remove();
      updateAssignedMembersDisplay();
    }
}

async function getIcon(membersRef, id) {
  let assignedMembersRef = document.getElementById("assignedMembers");
  let mainDiv = membersRef.querySelector("p");
  let assignedColor = mainDiv.classList[1];
  let contacts = await loadContacts();
  let currentSelectedUser = contacts.find((user) => user.id === id);
  if (currentSelectedUser) {
    assignedMembersRef.innerHTML += `<p id="selected_name_icon${
      currentSelectedUser.id
    }" class="assigned_to_icon ${assignedColor}">${currentSelectedUser.firstname
      .toUpperCase()
      .charAt(0)}${currentSelectedUser.lastname.toUpperCase().charAt(0)}</p>`;
  }
}

function toggleAssignment(id) {
  const index = assignedTo.indexOf(id);
  if (index !== -1) {
    assignedTo.splice(index, 1);
  } else {
    assignedTo.push(id);
  }
}

function updateAssignedMembersDisplay() {
  let container = document.getElementById("assignedMembers");
  let existingWrapper = container.querySelector(".plusWrapper");
  if (existingWrapper) existingWrapper.remove();
  let icons = Array.from(container.querySelectorAll(".assigned_to_icon")).filter((icon) => !icon.closest(".bubbleTooltip"));
  icons.forEach((icon) => (icon.style.display = "flex"));
  if (icons.length > 5) {
    getIconClasses(container);
  }
}

function getIconClasses(container){
  let hiddenIcons = icons.slice(5);
    hiddenIcons.forEach((icon) => (icon.style.display = "none"));
    let plusWrapper = document.createElement("div");
    plusWrapper.classList.add("plusWrapper");
    let plusOne = document.createElement("p");
    plusOne.classList.add("assignedPlusOne");
    plusOne.textContent = `+${hiddenIcons.length}`;
    plusWrapper.appendChild(plusOne);
    container.appendChild(plusWrapper);
}

function getCategory(id) {
  let selectRef = document.getElementById("select");
  let optionsRef = document.getElementById(id);
  selectRef.innerHTML = "";
  selectRef.innerHTML = optionsRef.innerText;
  closeTaskCategory();
}

function removeDisplayNone(id) {
  let ref = document.getElementById(id);
  if (!ref) return;
  ref.classList.remove("d-none");
}

function addDisplayNone(id) {
  let ref = document.getElementById(id);
  if (!ref) return;
  ref.classList.add("d-none");
}

function disableButtons() {
  document.querySelectorAll("button").forEach((btn) => (btn.disabled = true));
  document.body.style.overflow = "hidden";
}

function enableButtons() {
  document.querySelectorAll("button").forEach((btn) => (btn.disabled = false));
  document.body.style.overflow = "";
}

function getTodayStr() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function addDisplayNone(id) {
  let ref = document.getElementById(id);
  if (!ref) return;
  ref.classList.add("d-nonevip");
}

function removeDisplayNone(id) {
  let ref = document.getElementById(id);
  if (!ref) return;
  ref.classList.remove("d-nonevip");
}

function toggleDisplayNone(id) {
  let ref = document.getElementById(id);
  if (!ref) return;
  ref.classList.toggle("d-nonevip");
}

async function postDataToServer(currentStatus) {
  let title = document.getElementById("title");
  let description = document.getElementById("description");
  let date = document.getElementById("date");
  let priority = setPriority;
  let category = document.getElementById("select");
  const subTasksFromDOM = Array.from(document.querySelectorAll(".subTaskAdded"))
    .map((el) => {
      if (el.tagName === "INPUT") return el.value.trim();
      let input = el.querySelector("input");
      if (input) return input.value.trim();
      return el.textContent.trim();
    })
    .filter((val) => val.length > 0);
  await postData(`/tasks/`, {
    id: generateTimeBasedId(),
    title: title.value,
    description: description.value,
    date: date.value,
    priority: priority,
    assignedTo: assignedTo,
    category: category.innerText,
    subTasksOpen: subTasksFromDOM,
    status: currentStatus,
  });
}

async function postData(path, data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responseToJson = await response.json());
}

function getId() {
  return self.crypto.randomUUID();
}

function generateTimeBasedId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}