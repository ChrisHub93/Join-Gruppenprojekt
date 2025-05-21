let name = "";
let email = "";
let password = "";
let passwordConfirm = "";

function initSignUp() {}

function submit() {
  name = document.getElementById("inputName").value;
  email = document.getElementById("inputEmail").value;
  password = document.getElementById("inputPassword").value;
  passwordConfirm = document.getElementById("inputePasswordConfirm").value;
  postData("/users/", {email: email, password : password});
  window.location.href = '../index.html'
}

async function postData(path, data={}) {
    let response = await fetch(BASE_URL + path + ".json",{
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(data)
    });
    return responseToJson = await response.json();
}

