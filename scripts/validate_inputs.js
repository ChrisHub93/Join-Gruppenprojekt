function validateSignUpInputs() {
  validateNameInput('signUpInputName','signUpNameFeedback');
  validateEmailInput("signUpInputEmail", "signUpEmailFeedback");
  validatePasswordInput(
    "signUpInputPassword",
    "passwortFeedback",
    "signUpInputPasswortBtn"
  );
  validateConfirmPassword(
    "signUpInputPassword",
    "inputPasswordConfirm",
    "confirmPasswortFeedback"
  );
  validateCheckbox("check-privacy", "checkBoxFeedback");
}

function validateNameInput(inputId, feddbackId) {
  const nameInputRef = document.getElementById(inputId);

  if (nameInputRef.value.trim() === "") {
    showUserFeedback(inputId, feddbackId, "This Field is required");
    nameCheck = false;
  } else {
    hideUserFeedback(inputId, feddbackId);
    nameCheck = true;
  }
}

function validateEmailInput(inputId, feedbackId) {
  const emailInputRef = document.getElementById(inputId);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (emailRegex.test(emailInputRef.value)) {
    hideUserFeedback(inputId, feedbackId);
    emailCheck = true;
  } else {
    showUserFeedback(
      inputId,
      feedbackId,
      "Please enter a valid email address."
    );
    emailCheck = false;
  }
}

function validatePasswordInput(inputId, feedbackId, btnId) {
  const pwInputRef = document.getElementById(inputId);

  if (pwInputRef.value.trim() === "") {
    showUserFeedback(inputId, feedbackId, "This Field is required");
    pwInputRef.value = "";
    showLockIcon(inputId, btnId);
    pwCheck = false;
  } else {
    hideUserFeedback(inputId, feedbackId);
    pwCheck = true;
  }
}

function validateConfirmPassword(pwInputId, confirmInputId, feedbackId) {
  let pwInput = document.getElementById(pwInputId).value;
  let confirmPwInput = document.getElementById(confirmInputId).value;

  if (pwInput === confirmPwInput && confirmPwInput != "") {
    hideUserFeedback(confirmInputId, feedbackId);
    pwConfirmCheck = true;
  } else {
    showUserFeedback(
      confirmInputId,
      feedbackId,
      "Your passwords don`t match. Please try again"
    );
    pwConfirmCheck = false;
  }
}

function validateCheckbox(boxId, feddbackId) {
  const boxRef = document.getElementById(boxId).checked;
  const feedbackElementRef = document.getElementById(feddbackId);
  if (boxRef) {
    feedbackElementRef.textContent = "";
    checkBox = true;
  } else {
    feedbackElementRef.innerHTML = "<br>Please accept the Privacy Policy";
    checkBox = false;
  }
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

function hideUserFeedback(inpuId, feedbackId) {
  const inputRef = document.getElementById(inpuId);
  const feedbackRef = document.getElementById(feedbackId);

  inputRef.style.border = "1px solid var(--input-border)";
  feedbackRef.textContent = "";
}

function showUserFeedback(inputId, feedbackId, alertText) {
  const inputRef = document.getElementById(inputId);
  const feedbacktRef = document.getElementById(feedbackId);

  inputRef.style.border = "1px solid var(--error-color)";
  feedbacktRef.textContent = alertText;
}