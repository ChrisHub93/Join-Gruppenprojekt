function validateSignUpInputs() {
  validateNameInput();
  validateEmailInput("signUpInputEmail", "signUpEmailFeedback");
  validatePasswordInput(
    "signUpInputPassword",
    "passwortFeedback",
    "signUpInputPasswortBtn"
  );
  validateConfirmPassword();
  validateCheckbox();
}

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

function hideUserFeedback() {
  const confirmPwInputRef = document.getElementById("inputPasswordConfirm");
  const feedbackElementRef = document.getElementById("confirmPasswortFeedback");

  confirmPwInputRef.style.border = "1px solid var(--input-border)";
  feedbackElementRef.textContent = "";
}

function showUserFeedback() {
  const confirmPwInputRef = document.getElementById("inputPasswordConfirm");
  const feedbackElementRef = document.getElementById("confirmPasswortFeedback");
  confirmPwInputRef.style.border = "1px solid var(--error-color)";
  feedbackElementRef.textContent =
    "Your passwords don`t match. Please try again";
}

function showLockIcon(inputId, btnId) {
  const inputLockIconRef = document.getElementById(inputId);
  const iconBtnRef = document.getElementById(btnId);

  inputLockIconRef.classList.add("icon-lock");
  iconBtnRef.classList.add("d-none");
}

function showEyeIcon(inputId, btnId) {
  const inputLockIconRef = document.getElementById(inputId);
  const iconBtnRef = document.getElementById(btnId);

  inputLockIconRef.classList.remove("icon-lock");
  iconBtnRef.classList.remove("d-none");
}

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

function validateEmailInput(inputId, feedbackId) {
  const emailInputRef = document.getElementById(inputId);
  const feedbackElementRef = document.getElementById(feedbackId);
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

function validatePasswordInput(inputId, feedbackId, btnId) {
  const pwInputRef = document.getElementById(inputId);
  const feedbackElementRef = document.getElementById(feedbackId);

  if (pwInputRef.value.trim() === "") {
    pwInputRef.style.border = "1px solid var(--error-color)";
    feedbackElementRef.textContent = "This Field is required";
    pwInputRef.value = "";
    showLockIcon(inputId, btnId);
    pwCheck = false;
  } else {
    feedbackElementRef.textContent = "";
    pwInputRef.style.border = "1px solid var(--input-border)";
    pwCheck = true;
  }
}
