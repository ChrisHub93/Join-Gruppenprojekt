let nameCheck = false;
let emailCheck = false;
let pwCheck = false;
let pwConfirmCheck = false;
let checkBox = false;

function initSignUp() {}

async function signUp() {
  validateSignUpInputs();
  if (nameCheck && emailCheck && pwCheck && pwConfirmCheck && checkBox) {
    await getInpuValueAndPost();
    showSuccesMessage();
    setTimeout(() => {
      skipAnimationAndGoBack();
    }, 1000);
  } 
}

async function getInpuValueAndPost() {
  let name = document.getElementById("signUpInputName").value;
  let email = document.getElementById("signUpInputEmail").value;
  let password = document.getElementById("signUpInputPassword").value;
  await postData("/users/", { name: name, email: email, password: password, id:getId() });
}

function getId() {
  return self.crypto.randomUUID()
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

function skipAnimationAndGoBack() {
  sessionStorage.setItem("skipAnimation", "1");
  location.href = "../index.html";
}