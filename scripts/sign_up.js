let nameCheck = false;
let emailCheck = false;
let pwCheck = false;
let pwConfirmCheck = false;
let checkBox = false;

function initSignUp() {
  setChecksToFalse();
  clearPasswordInputs();
}

async function signUp() {
  validateAllInputs();
  if (nameCheck && emailCheck && pwCheck && pwConfirmCheck && checkBox) {
    await getInpuValueAndPost();
    showSuccesMessage();
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 1000);
  } else {
    validateAllInputs();
  }
}

function validateAllInputs() {
  validateNameInput();
  validateEmailInput();
  validatePasswordInput();
  validateConfirmPassword();
  validateCheckbox();
}

async function getInpuValueAndPost() {
  let name = document.getElementById("signUpInputName").value;
  let email = document.getElementById("signUpInputEmail").value;
  let password = document.getElementById("signUpInputPassword").value;
  await postData("/users/", { name: name, email: email, password: password });
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

function showSuccesMessage() {
  const ref = document.getElementById("overlay");
  ref.classList.remove("d-none");
  ref.classList.add("overlay");
}

function setChecksToFalse() {
  nameCheck = false;
  emailCheck = false;
  pwCheck = false;
  pwConfirmCheck = false;
}

function clearPasswordInputs() {
  document.getElementById("signUpInputPassword").value = "";
  document.getElementById("inputPasswordConfirm").value = "";
}

// Ab hier inpt valdidations ->

// doppelt
function validateNameInput() {
  const nameInputRef = document.getElementById("signUpInputName");
  const feedbackElementRef = document.getElementById("signUpNameFeedback");

  if (nameInputRef.value.trim() === "") {
    nameInputRef.style.border = "1px solid var(--error-color)";
    feedbackElementRef.textContent = "This Field is required";
    nameCheck = false;
  } else {
    feedbackElementRef.textContent = "";
    nameInputRef.style.border = "1px solid var(--input-border)";
    nameCheck = true;
  }
}
// doppelt
// funktion muss mit übergabe von variablen umgeschrieben werden!!!
// Name der funktionsausführung ändern!!!
function validateEmailInput() {
  const emailInputRef = document.getElementById("signUpInputEmail");
  const feedbackElementRef = document.getElementById("signUpEmailFeedback");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (emailRegex.test(emailInputRef.value)) {
    feedbackElementRef.textContent = "";
    emailInputRef.style.border = "1px solid var(--input-border)";
    emailCheck = true;
  } else {
    emailInputRef.style.border = "1px solid var(--error-color)";
    feedbackElementRef.textContent = "Please enter a valid email address.";
    emailCheck = false;
  }
}

// doppelt aber anderer Name !!! nehme von signUp.js
function validatePasswordInput() {
  const pwInputRef = document.getElementById("signUpInputPassword");
  const feedbackElementRef = document.getElementById("passwortFeedback");

  if (pwInputRef.value.trim() === "") {
    pwInputRef.style.border = "1px solid var(--error-color)";
    feedbackElementRef.textContent = "This Field is required";
    pwInputRef.value = "";
    showLockIcon("signUpInputPassword", "signUpInputPasswortBtn");
    pwCheck = false;
  } else {
    feedbackElementRef.textContent = "";
    pwInputRef.style.border = "1px solid var(--input-border)";
    pwCheck = true;
  }
}

// einmalig
// kann ohne Änderungen eingefügt werden
function validateConfirmPassword() {
  let pwInput = "";
  let confirmPwInput = "";
  pwConfirmCheck = false;
  pwInput = document.getElementById("signUpInputPassword").value;
  confirmPwInput = document.getElementById("inputPasswordConfirm").value;
  if (pwInput === confirmPwInput && confirmPwInput != "") {
    hideUserFeedback();
    pwConfirmCheck = true;
  } else {
    pwConfirmCheck = false;
    showUserFeedback();
  }
}

// einmalig
// kann ohne Änderungen eingefügt werden
function validateCheckbox() {
  const boxRef = document.getElementById("check-privacy").checked;
  const feedbackElementRef = document.getElementById("checkBoxFeedback");
  if (boxRef) {
    feedbackElementRef.textContent = "";
    checkBox = true;
  } else {
    feedbackElementRef.innerHTML = "<br>Please accept the Privacy Policy";
    checkBox = false;
  }
}

// einmalig
// kann ohne Änderungen eingefügt werden
function hideUserFeedback() {
  const confirmPwInputRef = document.getElementById("inputPasswordConfirm");
  const feedbackElementRef = document.getElementById("confirmPasswortFeedback");

  confirmPwInputRef.style.border = "1px solid var(--input-border)";
  feedbackElementRef.textContent = "";
}

// einmalig
// kann ohne Änderungen eingefügt werden
function showUserFeedback() {
  const confirmPwInputRef = document.getElementById("inputPasswordConfirm");
  const feedbackElementRef = document.getElementById("confirmPasswortFeedback");
  confirmPwInputRef.style.border = "1px solid var(--error-color)";
  feedbackElementRef.textContent =
    "Your passwords don`t match. Please try again";
}

// doppelt
// kann ohne Änderungen eingefügt werden
function showEyeIcon(inputId, btnId) {
  const inputLockIconRef = document.getElementById(inputId);
  const iconBtnRef = document.getElementById(btnId);

  inputLockIconRef.classList.remove("icon-lock");
  iconBtnRef.classList.remove("d-none");
}

// doppelt
// kann ohne Änderungen eingefügt werden
function togglePwVisibility(inputId, imgId) {
  const inputRef = document.getElementById(inputId);
  const iconRef = document.getElementById(imgId);

  if (inputRef.type === "password") {
    inputRef.type = "text";
    iconRef.src = "../assets/icons/visibility.svg";
    iconRef.alt = "Hide password";
  } else {
    inputRef.type = "password";
    iconRef.src = "../assets/icons/visibility_off.svg";
    iconRef.alt = "Show password";
  }
}

// einmalig
// kann ohne Änderungen eingefügt werden
function showLockIcon(inputId, btnId) {
  const inputLockIconRef = document.getElementById(inputId);
  const iconBtnRef = document.getElementById(btnId);

  inputLockIconRef.classList.add("icon-lock");
  iconBtnRef.classList.add("d-none");
}
