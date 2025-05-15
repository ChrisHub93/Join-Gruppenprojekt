function openTaskCategory(){
    let allOptionsRef = document.getElementById("allOptions");
    allOptionsRef.classList.toggle("show");
    let selectRef = document.getElementById("select");
    selectRef.innerText = `Select task category`;
}

function closeTaskCategory(){
    let allOptionsRef = document.getElementById("allOptions");
    allOptionsRef.classList.toggle("show");
}

function getCategory(id){
    let selectRef = document.getElementById("select");
    let optionsRef = document.getElementById(id);
    selectRef.innerHTML ='';
    selectRef.innerHTML = optionsRef.innerText ;
    closeTaskCategory();
}