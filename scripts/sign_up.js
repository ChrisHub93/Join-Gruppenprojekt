let nameCheck = false;
let emailCheck = false;
let pwCheck = false;
let pwConfirmCheck = false;
let checkBox = false;

/**
 * This function checks whether the input fields have valid values.
 * If all inputs are valid, it displays a success message.
 * After one second, it sets a pointer to skip the animation and redirects to index.html.
 */
async function signUp() {
  validateSignUpInputs();
  if (nameCheck && emailCheck && pwCheck && pwConfirmCheck && checkBox) {
    await getInputValueAndPost();
    showSuccessMessage();
    setTimeout(() => {
      skipAnimationAndGoBack();
    }, 1000);
  } 
}

/**
 * This function retrieves the input values from the sign-up form.
 * It posts two objects to the server:
 * 1. The user data used for login (name, email, password, id).
 * 2. The contact data for the same user (firstname, lastname, email, password, id).
 */
// muss noch geklärt werden, warum user nochmal vom server geladen werden
async function getInputValueAndPost() {
  let name = document.getElementById("signUpInputName").value;
  let email = document.getElementById("signUpInputEmail").value;
  let password = document.getElementById("signUpInputPassword").value;
  await postData("/users/", { name: name, email: email, password: password, id:getId() });

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

// Alternative function
// async function getInputValueAndPost() {
//   const name = document.getElementById("signUpInputName").value;
//   const email = document.getElementById("signUpInputEmail").value;
//   const password = document.getElementById("signUpInputPassword").value;
//   const id = getId(); 

//   await postData("/users/", {
//     name,
//     email,
//     password,
//     id
//   });

//   let fullName = name.split(" ");
//   let firstNameOfUser = fullName[0].charAt(0).toUpperCase(0) + fullName[0].slice(1);
//   let lastNameOfUser = fullName[1].charAt(0).toUpperCase(0) + fullName[1].slice(1);

//   await postData("/contacts/", {
//     firstname: formattedFirstName,
//     lastname: formattedLastName,
//     email,
//     password,
//     id
//   });
// }

/**
 * Loads data from the given path on the server.
 * 
 * @param {string} path - The relative path to the resource (e.g., "users")
 * @returns - A promise that resolves to the parsed JSON data
 */
async function fetchData(path) {
  let response = await fetch(BASE_URL + path + ".json");
  let responseAsJson = await response.json();
  return responseAsJson;
}

/**
 * Generates a random UUID string using the Web Crypto API.
 * 
 * @returns {string} - A randomly generated UUID
 */
function getId() {
  return self.crypto.randomUUID()
}

/**
 * Sends data to the server using a POST request.
 * 
 * @param {string} path - The relative path to the resource (e.g., "users")
 * @param {object} data - The data object to be saved
 * @returns {Promise<object>} The server's response as a parsed JSON object
 */
async function postData(path, data = {}) {
  const response = await fetch(BASE_URL + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseToJson = await response.json();
  return responseToJson;
}

/**
 * Shows a success message overlay.
 */
function showSuccessMessage() {
  const refOverlay = document.getElementById("overlay");
  refOverlay.classList.remove("d-none");
  refOverlay.classList.add("overlay");
}


/**
 * Sets a key-value pair in session storage to skip the animation on index.html visit,
 * then redirects the user to index.html.
 */
function skipAnimationAndGoBack() {
  sessionStorage.setItem("skipAnimation", "1");
  location.href = "../index.html";
}