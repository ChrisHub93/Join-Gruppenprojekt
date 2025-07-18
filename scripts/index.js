let pwAndUserFound = false;

function initLogin() {
  const skip = sessionStorage.getItem("skipAnimation");

  if (skip === "1") {
    sessionStorage.removeItem("skipAnimation");
    skipLogoAnimation();
  } else {
    logoAnimation(); 
  }
}

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
      sessionStorage.setItem('loginStatus', 'user');
      sessionStorage.setItem('loggedInUser', listOfUser.name);
      window.location.href = "./html/summary.html";
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

function logoAnimation() {
  const headerLogoRef = document.getElementById("logInLogo");
  headerLogoRef.classList.add("d-none");
  setTimeout(() => {
    hideOverlay(headerLogoRef);
  }, 1000);
}

function hideOverlay(logoRef) {
  const overlayRef = document.getElementById("overlay-login");
  overlayRef.classList.add("d-none")
  logoRef.classList.remove("d-none");
}

function skipLogoAnimation() {
  const headerLogoRef = document.getElementById("logInLogo");
  const overlayRef = document.getElementById("overlay-login");

  overlayRef.classList.add("d-none");
  headerLogoRef.classList.remove("d-none");  
}