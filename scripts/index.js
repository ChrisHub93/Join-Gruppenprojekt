let pwAndUserFound = false;

async function logIn() {
  let data = await loadData("/users");
  let dataValues = Object.values(data);

  search(dataValues);
}

async function loadData(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseToJson = await response.json();

  return responseToJson;
}

function search(dataValues) {
  const email = document.getElementById("logInInputEmail").value;
  const password = document.getElementById("logInInputPassword").value;

  for (listOfUser of dataValues) {
    let mails = listOfUser.email;
    let passwords = listOfUser.password;

    if (mails == email && passwords == password) {
      pwAndUserFound = true;
      window.location.href = "../html/summary.html";
      return;
    }
  }
  if (!pwAndUserFound) {
    clearPasswordInput();
    showAlert();
  }
}

function showAlert() {
  const textRef = document.getElementById("logInAlert");
  textRef.classList.remove("d-none");

  const collection = document.getElementsByClassName(
    "log-in__inputs__inputfield"
  );
  for (let i = 0; i < collection.length; i++) {
    collection[i].style.border = "1px solid var(--error-color)";
  }
}

function clearPasswordInput() {
  const pwRef = document.getElementById("logInInputPassword");
  pwRef.value = "";
}

// Ab hier input validations
function validateEmailInput() {
  const emailInputRef = document.getElementById("logInInputEmail");
  const feedbackElementRef = document.getElementById("logInEmailFeedback");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (emailRegex.test(emailInputRef.value)) {
    feedbackElementRef.textContent = "";
    emailInputRef.style.border = "1px solid var(--focus-color)";
  } else {
    emailInputRef.style.border = "1px solid var(--error-color)";
    feedbackElementRef.textContent = "Please enter a valid email address.";
  }
}

function validatePwInput() {
  const pwInputRef = document.getElementById("logInInputPassword");
  const feedbackElementRef = document.getElementById("pwFeedback");

  if(!pwInputRef.value) {
    pwInputRef.style.border = "1px solid var(--error-color)";
    feedbackElementRef.textContent = "This Field is required";
  } else {
    feedbackElementRef.textContent = "";
    pwInputRef.style.border = "1px solid var(--focus-color)";
  }
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

function showEyeIcon(inputId, btnId) {
  const inputLockIconRef = document.getElementById(inputId);
  const iconBtnRef = document.getElementById(btnId);

  inputLockIconRef.classList.remove("icon-lock");
  iconBtnRef.classList.remove("d-none");
}