function setCheckBoxFalse() {
  let inputRef = allMembers.querySelectorAll("input");
  for (const element of inputRef) {
    element.checked = false;
  }
}

function checkEmptyCategory() {
  const category = document.getElementById("select").innerText;
  const errorCatRef = document.getElementById("selectCategoryField");
  if (category === "Select task category") {
    errorCatRef.classList.add("inputError");
    checkCategory = false;
  } else {
    errorCatRef.classList.remove("inputError");
    checkCategory = true;
  }
}

function checkEmptyTitle() {
  let titleRef = document.getElementById("title");
  let errorTitleRef = document.getElementById("errorTitle");
  if (!titleRef.value) {
    titleRef.classList.add("inputError");
    errorTitleRef.classList.remove("opacity");
    checkTitle = false;
  } else {
    titleRef.classList.remove("inputError");
    errorTitleRef.classList.add("opacity");
    checkTitle = true;
  }
}

function checkEmptyDate() {
  const dateRef = document.getElementById("date");
  const errorDateRef = document.getElementById("errorDate");
  const inputValue = dateRef.value.trim();
  const todayStr = getTodayStr();
  if (!inputValue || inputValue < todayStr) {
    dateRef.classList.add("inputError");
    errorDateRef.classList.remove("opacity");
    checkDate = false;
  } else {
    dateRef.classList.remove("inputError");
    errorDateRef.classList.add("opacity");
    checkDate = true;
  }
}

function getDefaultCheckBoxImg() {
  let checkBoxImg = allMembers.querySelectorAll("img");
  for (const element of checkBoxImg) {
    element.src = "../assets/icons/Check button.png";
    element.classList.remove("filterChecked");
  }
}

function checkInputCheckBox(membersRef, inputRef, checkBoxImg){
  if (!inputRef.checked) {
    getInputCheckedTrue(membersRef, inputRef, checkBoxImg);
  } else if (inputRef.checked && membersRef.classList.contains("assignedBg")) {
    getInputCheckedFalse(membersRef, inputRef, checkBoxImg);
  }
}

function getInputCheckedFalse(membersRef, inputRef, checkBoxImg) {
  inputRef.checked = false;
  checkBoxImg.src = "../assets/icons/Check button.png";
  membersRef.classList.remove("assignedBg");
  checkBoxImg.classList.remove("filterChecked");
}

function getInputCheckedTrue(membersRef, inputRef, checkBoxImg) {
  inputRef.checked = true;
  checkBoxImg.src = "../assets/icons/Check button true.png";
  membersRef.classList.add("assignedBg");
  checkBoxImg.classList.add("filterChecked");
}

function getCheckBoxFalse(id) {
  let membersRef = document.getElementById(id);
  inputRef = membersRef.querySelector("input");
  imgRef = membersRef.querySelector("img");
  inputRef.checked = false;
  imgRef.src = "../assets/icons/Check button.png";
  imgRef.classList.remove("filterChecked");
}