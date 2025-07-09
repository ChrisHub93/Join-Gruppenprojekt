function initSummary() {
    showGreeting();
    filterTaskSummary();
}

function iconHoverSwaps() {
    let boxes = document.getElementsByClassName("summary-box");
    for (let i = 0; i < boxes.length; i++) {
        const box = boxes[i];
        const img = box.getElementsByClassName("todone-icon")[0];
    if (!img) continue;
        let original = img.src;
        let hover = img.dataset.altSrc;
    if (!hover) continue;
        box.addEventListener("mouseenter", () => img.src = hover);
        box.addEventListener("mouseleave", () => img.src = original);
    }
}

function getGreeting() {
    let time = new Date().getHours();
    
    	if (time >= 5 && time < 12) {
        return "Good Morning";
        } else if (time >= 12 && time < 18) {
        return "Good Afternoon";
        } else {
        return "Good Evening";
        }
}

function showGreeting() {
    let greeting = getGreeting();
    let username = sessionStorage.getItem('loggedInUser');
    let fullGreeting = checkUserOrGuest(greeting, username);
    document.querySelectorAll(".greeting").forEach(gr => gr.textContent = greeting);
    let loadingMobile = window.innerWidth < 768;
    let overlay = document.getElementById("greeting-overlay");
    let mainContent = document.getElementById("main-content");
    if (loadingMobile) {
        mobileGreeting(fullGreeting, overlay, mainContent);
    } else {
        document.getElementById("greeting-main-text").innerHTML = fullGreeting;
        overlay.style.display = "none";
        mainContent.style.display = "block";
    }
}

function checkUserOrGuest(greeting, username) {
    if (username) {
        let colorClass = getUserNameColorClass(username);
        return `${greeting},<br> <span class="${colorClass} active_user_greeting">${username}</span>`;
    } else {
        return greeting;
    }
}

function mobileGreeting(fullGreeting, overlay, mainContent) {
    document.getElementById("greeting-overlay-text").innerHTML = fullGreeting;
    overlay.style.display = "flex";
        setTimeout(() => {
            overlay.style.display = "none";
            mainContent.style.display = "block";
        }, 2000);
}

async function filterTaskSummary() {
    let tasks = await fetchData("/tasks/");
    todos = Object.values(tasks);
    let checkboxRef = document.getElementById('checkbox')
    let tasksToDo = todos.filter(task => task.status === "To do");
    let tasksDone = todos.filter(task => task.status === "Done");
    let tasksProgress = todos.filter(task => task.status === "In progress");
    let tasksFeedback = todos.filter(task => task.status === "Await feedback");
    let tasksUrgent = todos.filter(task => task.priority === "urgent");
    tasksUrgent.sort((a,b) => new Date(a.date) - new Date(b.date));
    let tasksPrioDate = tasksUrgent[0]?.date ?? "";
    let urgentDate = tasksPrioDate ? formatDatetoEnglish(tasksPrioDate) : "";
    checkboxRef.innerHTML = getCheckboxSummary(tasksToDo, tasksDone, tasksProgress, tasksFeedback, tasksUrgent, todos, urgentDate);
    iconHoverSwaps();   
}

async function fetchData(path) {
  let response = await fetch(BASE_URL + path + ".json");
  let responseAsJson = await response.json();
  return responseAsJson;
}

function formatDatetoEnglish(tasksPrioDate) {
    let date = new Date(tasksPrioDate);
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return `${month} ${day}, ${year}`;
}


