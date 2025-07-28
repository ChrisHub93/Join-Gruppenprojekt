function checkEmptyPhone() {
  let phoneRef = document.getElementById("phone");
  let requiredPhoneFieldRef = document.getElementById("requiredPhoneField");
  let phoneNumber = phoneRef.value.trim();
  let phoneValidation = /^\d+$/;
  if (!phoneNumber || !phoneValidation.test(phoneNumber)) {
    phoneRef.classList.add("error");
    requiredPhoneFieldRef.classList.remove("opacity");
  } else {
    phoneRef.classList.remove("error");
    requiredPhoneFieldRef.classList.add("opacity");
  }
}

function checkEmptyEmail() {
  let emailRef = document.getElementById("email");
  let requiredEmailFieldRef = document.getElementById("requiredEmailField");
  let email = emailRef.value.trim();
  let emailValidation = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!email || !emailValidation.test(email)) {
    emailRef.classList.add("error");
    requiredEmailFieldRef.classList.remove("opacity");
  } else {
    emailRef.classList.remove("error");
    requiredEmailFieldRef.classList.add("opacity");
  }
}


function checkEmptyName() {
  let nameRef = document.getElementById("name");
  let fullName = nameRef.value.split(" ");
  let requiredNameFieldRef = document.getElementById("requiredNameField");
  if (fullName.length <= 1 || fullName[1] == "") {
    nameRef.classList.add("error");
    requiredNameFieldRef.classList.remove("opacity");
  } else {
    nameRef.classList.remove("error");
    requiredNameFieldRef.classList.add("opacity");
  }
}