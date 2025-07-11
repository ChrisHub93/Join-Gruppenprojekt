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

  // need to get logged in user to contacts json
  let newUser = await fetchData("/users/");
  let values = Object.values(newUser);
  let findUser = values.find((currentUser)=> currentUser.name == name);
  let fullName = name.split(" ");
  let firstNameOfUser = fullName[0].charAt(0).toUpperCase(0) + fullName[0].slice(1);
  let lastNameOfUser = fullName[1].charAt(0).toUpperCase(0) + fullName[1].slice(1);
  if (findUser){
    await postData("/contacts/", { firstname: firstNameOfUser, lastname: lastNameOfUser, email: email, password: password, id:findUser.id });
  }
}

async function fetchData(path) {
  let response = await fetch(BASE_URL + path + ".json");
  let responseAsJson = await response.json();
  return responseAsJson;
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