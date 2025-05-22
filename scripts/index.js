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
  email = document.getElementById("inputEmail").value;
  password = document.getElementById("inputPassword").value;

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
    clearPasswordInput()
    showAlert();
  }
}

function clearPasswordInput() {
  pwRef = document.getElementById('inputPassword');
  pwRef.value = "";
}

function showAlert() {
  textRef = document.getElementById("logInAlert");
  textRef.classList.remove('d-none');

  const collection = document.getElementsByClassName("log-in__inputs__inputfield");
  for (let i = 0; i < collection.length; i++) {
    collection[i].style.border = "1px solid var(--error-color)";
  }
}
