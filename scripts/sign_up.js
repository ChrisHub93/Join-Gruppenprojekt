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