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
    clearInput()
    showAlertText();
  }
}

function clearInput() {
  pwRef = document.getElementById('inputPassword');
  pwRef.value = "";
}

function showAlertText() {
  alertRef = document.getElementById("logInAlert");
  alertRef.classList.remove('d-none');
}
