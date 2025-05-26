function initSignUp() {}

async function submit() {
  await getInpuValueAndPost();
  window.location.href = "../index.html";
}

async function getInpuValueAndPost() {
  let name = document.getElementById("inputName").value;
  let email = document.getElementById("inputEmail").value;
  let password = document.getElementById("inputPassword").value;
  let passwordConfirm = document.getElementById("inputePasswordConfirm").value;
  await postData("/users/", {name: name, email: email, password: password });
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

  function validateEmailInput() {
    const emailInputRef = document.getElementById("inputEmail");
    const feedbackElementRef = document.getElementById("emailFeedback");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (emailRegex.test(emailInputRef.value)) {
      feedbackElementRef.textContent = "";
      emailInputRef.style.border = "1px solid var(--input-border)";
    } else {
      emailInputRef.style.border = "1px solid var(--error-color)";
      feedbackElementRef.textContent = "Please enter a valid email address.";
    }
  }

  function validateInput(id, textId) {
    const pwInputRef = document.getElementById(id);
    const feedbackElementRef = document.getElementById(textId);
  
    if(!pwInputRef.value) {
      pwInputRef.style.border = "1px solid var(--error-color)";
      feedbackElementRef.textContent = "This Field is required";
    } else {
      feedbackElementRef.textContent = "";
      pwInputRef.style.border = "1px solid var(--input-border)";
    }
  }