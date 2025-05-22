let priorityUrgent = false;
let priorityMedium = false;
let priorityLow = false;

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
    ref.src = "/assets/icons/arrow_drop_down2.png";
  } else {
    ref.src = "/assets/icons/arrow_drop_down.png";
  }
}

function toggleBorderColor(id) {
  let ref = document.getElementById(id);
  if (!ref) return;
  ref.classList.toggle("border-color");
}

function openAssignedTo() {
  toggleVisibility("allMembers");
  toggleBorderColor("selectMember");
  toggleArrow("arrow");
}

function getContact(id) {
  let membersRef = document.getElementById(id);
  inputRef = membersRef.querySelector("input");
  checkBoxImg = membersRef.querySelector("img");
  if (!inputRef.checked && membersRef.classList.contains("assignedBg")) {
    getInputCheckedFalse(membersRef, inputRef);
  } else if (!inputRef.checked) {
    getInputCheckedTrue(membersRef, inputRef);
  } else if (inputRef.checked && membersRef.classList.contains("assignedBg")) {
    getInputCheckedFalse(membersRef, inputRef);
  } else if (inputRef.checked) {
    membersRef.classList.toggle("assignedBg");
    checkBoxImg.classList.toggle("filterChecked");
  }
}

function setCheckBox(id, event) {
  event.stopPropagation(event);
  let membersRef = document.getElementById(id);
  inputRef = membersRef.querySelector("input");
  checkBoxImg = membersRef.querySelector("img");
  if (inputRef.checked) {
    getCheckBoxFalse(id);
  } else if (!inputRef.checked && !membersRef.classList.contains("assignedBg")) {
    inputRef.checked = true;
    checkBoxImg.src = "/assets/icons/Check button true.png";
  } else if (!inputRef.checked) {
    inputRef.checked = true;
    checkBoxImg.src = "/assets/icons/Check button true.png";
    checkBoxImg.classList.add("filterChecked");
  }
}

function getInputCheckedFalse(membersRef, inputRef) {
  checkBoxImg = membersRef.querySelector("img");
  inputRef.checked = false;
  checkBoxImg.src = "/assets/icons/Check button.png";
  membersRef.classList.remove("assignedBg");
  checkBoxImg.classList.remove("filterChecked");
}

function getInputCheckedTrue(membersRef, inputRef) {
  checkBoxImg = membersRef.querySelector("img");
  inputRef.checked = true;
  checkBoxImg.src = "/assets/icons/Check button true.png";
  membersRef.classList.add("assignedBg");
  checkBoxImg.classList.add("filterChecked");
}

function getCheckBoxFalse(id) {
  let membersRef = document.getElementById(id);
  inputRef = membersRef.querySelector("input");
  imgRef = membersRef.querySelector("img");
  inputRef.checked = false;
  imgRef.src = "/assets/icons/Check button.png";
  imgRef.classList.remove("filterChecked");
}

function openTaskCategory() {
  toggleVisibility("allOptions");
  let selectRef = document.getElementById("select");
  selectRef.innerText = `Select task category`;
  toggleArrow("arrowCategory");
}

function closeTaskCategory() {
  toggleVisibility("allOptions");
  toggleArrow("arrowCategory");
}

function getCategory(id) {
  let selectRef = document.getElementById("select");
  let optionsRef = document.getElementById(id);
  selectRef.innerHTML = "";
  selectRef.innerHTML = optionsRef.innerText;
  closeTaskCategory();
}

function setPriorityUrgent(id) {
  if (!priorityUrgent) {
    resetAllPriorities();
    priorityUrgent = true;
    let urgentRef = document.getElementById(id);
    urgentRef.classList.toggle("priorityUrgentBg");
    addDisplayNone("standardUrgentIcon");
    removeDisplayNone("activeUrgentIcon");
  } else if (priorityUrgent) {
    resetAllPriorities();
  }
}

function setPriorityMedium(id) {
  if (!priorityMedium) {
    resetAllPriorities();
    priorityMedium = true;
    let urgentRef = document.getElementById(id);
    urgentRef.classList.toggle("priorityMediumBg");
    addDisplayNone("standardMediumIcon");
    removeDisplayNone("activeMediumIcon");
  } else if (priorityMedium) {
    resetAllPriorities();
  }
}

function setPriorityLow(id) {
  if (!priorityLow) {
    resetAllPriorities();
    priorityLow = true;
    let urgentRef = document.getElementById(id);
    urgentRef.classList.toggle("priorityLowBg");
    addDisplayNone("standardLowIcon");
    removeDisplayNone("activeLowIcon");
  } else if (priorityLow) {
    resetAllPriorities();
  }
}

function resetAllPriorities() {
  priorityUrgent = false;
  priorityMedium = false;
  priorityLow = false;

  document.getElementById("urgent").classList.remove("priorityUrgentBg");
  removeDisplayNone("standardUrgentIcon");
  addDisplayNone("activeUrgentIcon");

  document.getElementById("medium").classList.remove("priorityMediumBg");
  removeDisplayNone("standardMediumIcon");
  addDisplayNone("activeMediumIcon");

  document.getElementById("low").classList.remove("priorityLowBg");
  removeDisplayNone("standardLowIcon");
  addDisplayNone("activeLowIcon");
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

function createTask() {
  checkEmptyTitle();
  checkEmptyDate();
}

function checkEmptyTitle() {
  let titleRef = document.getElementById("title");
  let errorTitleRef = document.getElementById("errorTitle");
  if (!titleRef.value) {
    titleRef.classList.add("inputError");
    errorTitleRef.classList.remove("opacity");
  } else {
    titleRef.classList.remove("inputError");
    errorTitleRef.classList.add("opacity");
  }
}

function checkEmptyDate() {
  let dateRef = document.getElementById("date");
  let errorDateRef = document.getElementById("errorDate");
  if (!dateRef.value) {
    dateRef.classList.add("inputError");
    errorDateRef.classList.remove("opacity");
  } else {
    dateRef.classList.remove("inputError");
    errorDateRef.classList.add("opacity");
  }
}

function chooseSubTask(){
  let inputRef = document.getElementById("subTaskInput");
  let addedTaskRef = document.getElementById("subTasks");

  if (addedTaskRef.innerHTML == ''){
    inputRef.value = 'Contact Form';
    inputRef.innerHTML = inputRef.value;
    addPlusIcon("plusIcon");
    toggleCancelOrCheck("cancelOrCheck");
  }else if(addedTaskRef.innerHTML == '<li>Contact Form</li><li>Write Legal Imprint</li>'){
    inputRef.value = 'Contact Form';
    inputRef.innerHTML = inputRef.value;
    addedTaskRef.innerHTML = '';
    addPlusIcon("plusIcon");
    toggleCancelOrCheck("cancelOrCheck");
  }else if(addedTaskRef.innerHTML != ''){
    inputRef.value = 'Write Legal Imprint';
    inputRef.innerHTML = inputRef.value;
    addPlusIcon("plusIcon");
    toggleCancelOrCheck("cancelOrCheck");
  }
}

function deleteTask(){
  let inputRef = document.getElementById("subTaskInput");
  inputRef.value = '';
  togglePlusIcon("plusIcon");
  toggleCancelOrCheck("cancelOrCheck");
}

function addTask(){
  let inputRef = document.getElementById("subTaskInput");
  let addedTaskRef = document.getElementById("subTasks");
  addedTaskRef.innerHTML += `<div class="relative">
                                <input type ="text" value="${inputRef.value}"/>
                                  <div id="cancelOrCheck" class="editOrTrash">
                                    <img onclick="deleteTask()" src="/assets/icons/Property 1=edit.png" alt="">
                                    <div class="subTasksSeperator"></div>
                                    <img onclick="addTask()" src="/assets/icons/Property 1=delete.png" alt="">
                                  </div>
            
                            </div`;




  togglePlusIcon("plusIcon");
  toggleCancelOrCheck("cancelOrCheck");
  inputRef.value = '';
}

function addPlusIcon(id){
  let ref = document.getElementById(id);
  if (!ref) return;
  ref.classList.add("d-none");
}

function togglePlusIcon(id){
    let ref = document.getElementById(id);
    if (!ref) return;
    ref.classList.remove("d-none");
}

function toggleCancelOrCheck(id) {
  let ref = document.getElementById(id);
  if (!ref) return;
  ref.classList.toggle("d-none");
}