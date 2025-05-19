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


//do not behave like mockup
lastClickedFromCheckBox = false;

function getContact(id) {
  let membersRef = document.getElementById(id);
  inputRef = membersRef.querySelector('input');
  if(!inputRef.checked){
    inputRef.checked =  true;
    checkBoxImg.src = "/assets/icons/Check button true.png";
    membersRef.classList.add("assignedBg");
    checkBoxImg.classList.add("filterChecked");
  } else if (inputRef.checked || lastClickedFromCheckBox == true) {
    lastClickedFromCheckBox = false;
    inputRef.checked = false;
    checkBoxImg.src = "/assets/icons/Check button.png";
    membersRef.classList.remove("assignedBg");
    checkBoxImg.classList.remove("filterChecked");
  }
  console.log("inputRef.checked =",inputRef.checked);
  console.log("lastClickedFromCheckBox =",lastClickedFromCheckBox);
 
}

function setCheckBox(id, event){
  if(lastClickedFromCheckBox){
    lastClickedFromCheckBox = false;
  } 

  let membersRef = document.getElementById(id);
  inputRef = membersRef.querySelector('input');
  if(!inputRef.checked && lastClickedFromCheckBox == false){
    // lastClickedFromCheckBox = true;
    inputRef.checked = false;
    checkBoxImg.src = "/assets/icons/Check button true.png";
    // checkBoxImg.classList.add("filterChecked");
  } else {
    // inputRef.checked = false;
    checkBoxImg.src = "/assets/icons/Check button.png";
    checkBoxImg.classList.remove("filterChecked");
  }
  event.stopPropagation(event);
  console.log("inputRef.checked =",inputRef.checked);
  console.log("lastClickedFromCheckBox =",lastClickedFromCheckBox);
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

function createTask(){
  checkEmptyTitle();
  checkEmptyDate();
}

function checkEmptyTitle(){
  let titleRef = document.getElementById("title");
  let errorTitleRef = document.getElementById("errorTitle");
  if(!titleRef.value){
    titleRef.classList.add("inputError");
    errorTitleRef.classList.remove("opacity");
  } else {
    titleRef.classList.remove("inputError");
    errorTitleRef.classList.add("opacity"); 
  }
}

function checkEmptyDate(){
  let dateRef = document.getElementById("date");
  let errorDateRef = document.getElementById("errorDate");
   if(!dateRef.value){
    dateRef.classList.add("inputError");
    errorDateRef.classList.remove("opacity");
  } else {
    dateRef.classList.remove("inputError");
    errorDateRef.classList.add("opacity"); 
  }
}