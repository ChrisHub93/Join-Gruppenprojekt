/**
 * Unchecks all checkboxes in the `allMembers` container.
 */
function setCheckBoxFalse() {
  let inputRef = allMembers.querySelectorAll("input");
  for (const element of inputRef) {
    element.checked = false;
  }
}

/**
 * Checks if a task category has been selected. Adds error styling if not.
 * Sets the global variable `checkCategory` accordingly.
 */
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

/**
 * Checks if the title field is empty. Adds error styling if needed.
 * Sets the global variable `checkTitle` accordingly.
 */
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

/**
 * Validates the date input to ensure it is not empty and not in the past.
 * Adds/removes error styling accordingly.
 * Sets the global variable `checkDate` accordingly.
 */
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

/**
 * Resets all checkbox images in the `allMembers` container to default (unchecked).
 */
function getDefaultCheckBoxImg() {
  let checkBoxImg = allMembers.querySelectorAll("img");
  for (const element of checkBoxImg) {
    element.src = "../assets/icons/Check button.png";
    element.classList.remove("filterChecked");
  }
}

/**
 * Toggles the checked state of a user checkbox and updates styles/icons.
 * @param {HTMLElement} membersRef - The parent container element.
 * @param {HTMLInputElement} inputRef - The checkbox input element.
 * @param {HTMLImageElement} checkBoxImg - The image element representing the checkbox.
 */
function checkInputCheckBox(membersRef, inputRef, checkBoxImg){
  if (!inputRef.checked) {
    getInputCheckedTrue(membersRef, inputRef, checkBoxImg);
  } else if (inputRef.checked && membersRef.classList.contains("assignedBg")) {
    getInputCheckedFalse(membersRef, inputRef, checkBoxImg);
  }
}

/**
 * Unchecks a user input checkbox and resets the styles/icons.
 * @param {HTMLElement} membersRef - The parent container element.
 * @param {HTMLInputElement} inputRef - The checkbox input element.
 * @param {HTMLImageElement} checkBoxImg - The image element representing the checkbox.
 */
function getInputCheckedFalse(membersRef, inputRef, checkBoxImg) {
  inputRef.checked = false;
  checkBoxImg.src = "../assets/icons/Check button.png";
  membersRef.classList.remove("assignedBg");
  checkBoxImg.classList.remove("filterChecked");
}

/**
 * Checks a user input checkbox and applies the selected styles/icons.
 * @param {HTMLElement} membersRef - The parent container element.
 * @param {HTMLInputElement} inputRef - The checkbox input element.
 * @param {HTMLImageElement} checkBoxImg - The image element representing the checkbox.
 */
function getInputCheckedTrue(membersRef, inputRef, checkBoxImg) {
  inputRef.checked = true;
  checkBoxImg.src = "../assets/icons/Check button true.png";
  membersRef.classList.add("assignedBg");
  checkBoxImg.classList.add("filterChecked");
}

/**
 * Unchecks a single checkbox and resets the corresponding image/icon.
 * @param {string} id - The ID of the container element wrapping the checkbox and icon.
 */
function getCheckBoxFalse(id) {
  let membersRef = document.getElementById(id);
  inputRef = membersRef.querySelector("input");
  imgRef = membersRef.querySelector("img");
  inputRef.checked = false;
  imgRef.src = "../assets/icons/Check button.png";
  imgRef.classList.remove("filterChecked");
}