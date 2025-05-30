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
  let name = document.getElementById("inputName").value;
  let email = document.getElementById("inputEmail").value;
  let password = document.getElementById("inputPassword").value;
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

function validateNameInput() {
  const nameInputRef = document.getElementById("inputName");
  const feedbackElementRef = document.getElementById("nameFeedback");

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

function validateEmailInput() {
  const emailInputRef = document.getElementById("inputEmail");
  const feedbackElementRef = document.getElementById("emailFeedback");
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

function validatePasswordInput() {
  const pwInputRef = document.getElementById("inputPassword");
  const feedbackElementRef = document.getElementById("passwortFeedback");

  if (pwInputRef.value.trim() === "") {
    pwInputRef.style.border = "1px solid var(--error-color)";
    feedbackElementRef.textContent = "This Field is required";
    pwCheck = false;
  } else {
    feedbackElementRef.textContent = "";
    pwInputRef.style.border = "1px solid var(--input-border)";
    pwCheck = true;
  }
}

function validateConfirmPassword() {
  let pwInput = "";
  let confirmPwInput = "";
  pwConfirmCheck = false;
  pwInput = document.getElementById("inputPassword").value;
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

function clearPasswordInputs() {
  document.getElementById("inputPassword").value = "";
  document.getElementById("inputPasswordConfirm").value = "";
}

function showUserFeedback() {
  const confirmPwInputRef = document.getElementById("inputPasswordConfirm");
  const feedbackElementRef = document.getElementById("confirmPasswortFeedback");
  confirmPwInputRef.style.border = "1px solid var(--error-color)";
  feedbackElementRef.textContent =
    "Your passwords don`t match. Please try again";
}

function setChecksToFalse() {
  nameCheck = false;
  emailCheck = false;
  pwCheck = false;
  pwConfirmCheck = false;
}

function showSuccesMessage() {
  const ref = document.getElementById("overlay");
  ref.classList.remove("d-none");
  ref.classList.add("overlay");
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

    if (inputRef.type === 'password') {
        inputRef.type = 'text';
        iconRef.src = '../assets/icons/visibility.svg'
        iconRef.alt ='Hide password';
    } else {
        inputRef.type = 'password';
        iconRef.src = '../assets/icons/visibility_off.svg'
        iconRef.alt ='Show password';
    }
}