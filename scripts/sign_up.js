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
  } 
}

function validateAllInputs() {
  validateNameInput();
  validateEmailInput("signUpInputEmail", "signUpEmailFeedback");
  validatePasswordInput("signUpInputPassword","passwortFeedback","signUpInputPasswortBtn");
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