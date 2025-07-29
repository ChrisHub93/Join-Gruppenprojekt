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

/**
 * Sets the minimum selectable date of the input element with ID "date" to today.
 */
function upToDate() {
  const dateInput = document.getElementById("date");
  dateInput.min = getTodayStr();
}

/**
 * Clears the value of an input element by ID.
 * @param {string} id - The ID of the input element.
 */
function removeValue(id) { 
  let ref = document.getElementById(id);
  if (!ref) return;
  ref.value = "";
}

/**
 * Removes the "inputError" class from the element with the given ID.
 * @param {string} id - The ID of the element.
 */
function removeInputError(id) {
  let ref = document.getElementById(id);
  if (!ref) return;
  ref.classList.remove("inputError");
}

/**
 * Adds the "opacity" class to the element with the given ID.
 * @param {string} id - The ID of the element.
 */
function addOpacity(id) {
  let ref = document.getElementById(id);
  if (!ref) return;
  ref.classList.add("opacity");
}

/**
 * Removes the "assignedBg" class from all list items inside allMembers.
 */
function renderList() {
  let listRef = allMembers.querySelectorAll("li");
  for (let element of listRef) {
    element.classList.remove("assignedBg");
  }
}

/**
 * Sets the arrow icon to the default down arrow.
 */
function changeArrowOfInput() {
  let ref = document.getElementById("arrow");
  let currentSrc = ref.getAttribute("src");
  if (currentSrc.includes("arrow_drop_down.png")) {
    ref.src = "../assets/icons/arrow_drop_down.png";
  } else {
    ref.src = "../assets/icons/arrow_drop_down.png";
  }
}

/**
 * Resets the category selector and related UI classes.
 */
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

/**
 * Loads user data from the server.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of user objects.
 */
async function loadUsers() {
  let users = await fetchData("/users/");
  let contactsArray = Object.values(users);
  return contactsArray;
}

/**
 * Fetches data from the given path.
 * @param {string} path - The API path.
 * @returns {Promise<Object>} A promise resolving to the fetched JSON data.
 */
async function fetchData(path) {
  let response = await fetch(BASE_URL + path + ".json");
  let responseAsJson = await response.json();
  return responseAsJson;
}

/**
 * Compares two users by their first name.
 * @param {Object} firstUser - The first user object.
 * @param {Object} nextUser - The second user object.
 * @returns {number} Comparison result: -1, 0, or 1.
 */
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

/**
 * Toggles the "show" class on an element by ID.
 * @param {string} id - The element ID.
 */
function toggleVisibility(id) {
  let ref = document.getElementById(id);
  if (!ref) return;
  ref.classList.toggle("show");
}

/**
 * Toggles the arrow icon source between two states.
 * @param {string} id - The image element ID.
 */
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

/**
 * Toggles a border color class on an element.
 * @param {string} id - The element ID.
 */
function toggleBorderColor(id) {
  let ref = document.getElementById(id);
  if (!ref) return;
  ref.classList.toggle("border-color");
}

/**
 * Opens or closes the "Assigned To" selection and attaches/detaches click event listener.
 */
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

/**
 * Closes the members list if a click occurs outside of it.
 * @param {MouseEvent} event - The click event.
 */
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

/**
 * Renders a user icon if not already shown.
 * @param {HTMLElement} membersRef - The reference element.
 * @param {string} id - The user ID.
 */
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

/**
 * Removes a user's icon if currently active.
 * @param {string} id - The user ID.
 */
function getNotActiveUser(id){
   let selectedMember = document.getElementById("selected_name_icon" + id);
    if (selectedMember) {
      selectedMember.remove();
      updateAssignedMembersDisplay();
    }
}

/**
 * Loads user icon and appends it to the assigned members container.
 * @param {HTMLElement} membersRef - The reference element.
 * @param {string} id - The user ID.
 */
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

/**
 * Adds or removes user ID from the assignedTo array.
 * @param {string} id - The user ID.
 */
function toggleAssignment(id) {
  const index = assignedTo.indexOf(id);
  if (index !== -1) {
    assignedTo.splice(index, 1);
  } else {
    assignedTo.push(id);
  }
}

/**
 * Updates the display of assigned member icons.
 */
function updateAssignedMembersDisplay() {
  let container = document.getElementById("assignedMembers");
  let existingWrapper = container.querySelector(".plusWrapper");
  if (existingWrapper) existingWrapper.remove();
  let icons = Array.from(container.querySelectorAll(".assigned_to_icon")).filter((icon) => !icon.closest(".bubbleTooltip"));
  icons.forEach((icon) => (icon.style.display = "flex"));
  if (icons.length > 5) {
    getIconClasses(container, icons);
  }
}

/**
 * Hides extra member icons and adds a "+X" indicator.
 * @param {HTMLElement} container - The container of the icons.
 * @param {HTMLElement[]} icons - array of icon elements
 */
function getIconClasses(container, icons){
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

/**
 * Sets the selected category based on user input.
 * @param {string} id - The ID of the category option.
 */
function getCategory(id) {
  let selectRef = document.getElementById("select");
  let optionsRef = document.getElementById(id);
  selectRef.innerHTML = "";
  selectRef.innerHTML = optionsRef.innerText;
  closeTaskCategory();
}

/**
 * Removes "d-nonevip" class from an element.
 * @param {string} id - Element ID.
 */
function removeDisplayNone(id) {
  let ref = document.getElementById(id);
  if (!ref) return;
  ref.classList.remove("d-none");
  ref.classList.remove("d-nonevip");
}

/**
 * Adds "d-nonevip" class to an element.
 * @param {string} id - Element ID.
 */
function addDisplayNone(id) {
  let ref = document.getElementById(id);
  if (!ref) return;
  ref.classList.add("d-none");
}

/**
 * Disables all buttons and prevents scrolling.
 */
function disableButtons() {
  document.querySelectorAll("button").forEach((btn) => (btn.disabled = true));
  document.body.style.overflow = "hidden";
}

/**
 * Enables all buttons and restores scrolling.
 */
function enableButtons() {
  document.querySelectorAll("button").forEach((btn) => (btn.disabled = false));
  document.body.style.overflow = "";
}

/**
 * Returns today's date in YYYY-MM-DD format.
 * @returns {string} Formatted date string.
 */
function getTodayStr() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Toggles the "d-nonevip" class of an element.
 * @param {string} id - Element ID.
 */
function toggleDisplayNone(id) {
  let ref = document.getElementById(id);
  if (!ref) return;
  ref.classList.toggle("d-nonevip");
}

/**
 * function to save a task to the server
 * 
 * @param {string} currentStatus - status of the task 
 */
async function postDataToServer(currentStatus) {
    let task = {
    id: generateTimeBasedId(),
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    date: document.getElementById("date").value,
    priority: setPriority,
    category: document.getElementById("select").innerText,
    assignedTo: assignedTo,
    subTasksOpen: getSubTasksFromDom(),
    status: currentStatus,
  };

  await postData(`/tasks/`, task);
}

/**
 * function to give back a list of subtasks
 * 
 * @returns {string} - an array of subtask texts
 */
function getSubTasksFromDom(){
  return Array.from(document.querySelectorAll(".subTaskAdded")).map((el) => {if (el.tagName === "INPUT") return el.value.trim();
      let input = el.querySelector("input");
      if (input) return input.value.trim();
      return el.textContent.trim();}).filter((val) => val.length > 0);
}

/**
 * Sends data to a server endpoint via POST.
 * @param {string} path - API path.
 * @param {Object} data - Data to be posted.
 * @returns {Promise<Object>} JSON response.
 */
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

/**
 * Generates a UUID using the browser's crypto API.
 * @returns {string} A UUID string.
 */
function getId() {
  return self.crypto.randomUUID();
}

/**
 * Generates a time-based numeric ID.
 * @returns {number} A unique ID based on timestamp.
 */
function generateTimeBasedId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}