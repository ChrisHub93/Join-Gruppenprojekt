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
  let selectMemberRef = document.getElementById("selectMember");
  selectMemberRef.innerText = "";
  toggleBorderColor("assignedContainer");
  toggleArrow("arrow");
}

function closeAssignedTo() {
  toggleVisibility("allMembers");
  toggleBorderColor("assignedContainer");
  toggleArrow("arrow");
}

function getContact(id) {
  let selectMemberRef = document.getElementById("selectMember");
  let membersRef = document.getElementById(id);
  selectMemberRef.value = membersRef.innerText;
  closeAssignedTo();
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
