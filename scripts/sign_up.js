let nameCheck = false;
let emailCheck = false;
let pwCheck = false;
let pwConfirmCheck = false;

function initSignUp() {
    setChecksToFalse();
}

async function signUp() {
  validateAllInputs();
  if (nameCheck && emailCheck && pwCheck && pwConfirmCheck) {
    await getInpuValueAndPost();
    window.location.href = "../index.html";
  } else {
    validateAllInputs();
  }
}

function validateAllInputs() {
  validateNameInput();
  validateEmailInput();
  validatePasswordInput();
  validateConfirmPassword();
  console.log(nameCheck, emailCheck, pwCheck, pwConfirmCheck);
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

  if (nameInputRef.value.trim() === '') {
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

  if (pwInputRef.value.trim() === '') {
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
    clearPasswordInputs();
    showUserFeedback();
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
