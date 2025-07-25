/**
 * Initializes the login screen.
 * If the user came from the sign-up page (indicated by 'skipAnimation' in sessionStorage),
 * the logo animation is skipped. Otherwise, the animation is played.
 */
function initLogin() {
  const skip = sessionStorage.getItem("skipAnimation");

  if (skip === "1") {
    sessionStorage.removeItem("skipAnimation");
    skipLogoAnimation();
  } else {
    logoAnimation();
  }
}

/**
 * Loads user data from the server and passes it to the search function.
 */
async function logIn() {
  let data = await loadData("/users");
  let dataValues = Object.values(data);

  search(dataValues);
}

/**
 *
 * @param {string} path - Loads data from the given path on the server.
 * @returns - A promise that resolves to the parsed JSON data
 */
async function loadData(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseToJson = await response.json();

  return responseToJson;
}

/**
 * Searches the provide user data for a matching email and password
 * If a match is found, logs the user in by setting session data and redirecting in the summary page
 * if no match is found, it clears the password input and shows an alert
 *
 * @param {Array<Object>} dataValues - Array of user objects to search through
 * @returns - void
 */
function search(dataValues) {
  const email = document.getElementById("logInInputEmail").value;
  const password = document.getElementById("logInInputPassword").value;

  for (let user of dataValues) {
    let mails = user.email;
    let passwords = user.password;

    if (mails == email && passwords == password) {
      sessionStorage.setItem("loginStatus", "user");
      sessionStorage.setItem("loggedInUser", user.name);
      window.location.href = "./html/summary.html";
      return;
    }
  }

  clearPasswordInput();
  showAlert();
}

/**
 * Displays a login error alert and highlights input fields with a red border.
 */
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

/**
 * Clears the value of the password input field
 */
function clearPasswordInput() {
  const pwRef = document.getElementById("logInInputPassword");
  pwRef.value = "";
}

/**
 * Shows a logo animation and hides it after at least 1 second.
 */
function logoAnimation() {
  const headerLogoRef = document.getElementById("logInLogo");
  headerLogoRef.classList.add("d-none");
  setTimeout(() => {
    hideOverlay(headerLogoRef);
  }, 1000);
}

/**
 * Hides the login overlay element and re-displays the logo element.
 *
 * @param {HTMLElement} logoRef - Reference to the logo DOM element
 */
function hideOverlay(logoRef) {
  const overlayRef = document.getElementById("overlay-login");
  overlayRef.classList.add("d-none");
  logoRef.classList.remove("d-none");
}

/**
 * Skips the logo animation by immediattely hiding the overlay
 * and displaying the logo element
 */
function skipLogoAnimation() {
  const headerLogoRef = document.getElementById("logInLogo");
  const overlayRef = document.getElementById("overlay-login");

  overlayRef.classList.add("d-none");
  headerLogoRef.classList.remove("d-none");
}
