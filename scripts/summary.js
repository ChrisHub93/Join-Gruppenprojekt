function initSummary() {
    showGreeting();
    filterTaskSummary();
}

/**
 * This function is used to swap the icons when hovering the top two div elements
 */
function iconHoverSwaps() {
    let boxes = document.getElementsByClassName("summary-box");
    for (let i = 0; i < boxes.length; i++) {
        let box = boxes[i];
        let img = box.getElementsByClassName("todone-icon")[0];
    if (!img) continue;
        let original = img.src;
        let hover = img.dataset.altSrc;
    if (!hover) continue;
        box.addEventListener("mouseenter", () => img.src = hover);
        box.addEventListener("mouseleave", () => img.src = original);
    }
}

/**
 * This function declares the Greeting Text shown by the time a user logs in
 * 
 * @returns {string} based on the timezone of user
 */
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

/**
 * This function is used to differ between a mobile or desktop greeting for a logged in user
 */
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
        desktopGreeting(fullGreeting, overlay, mainContent);
    }
}

/**
 * This function checks if its a logged in user or a guest
 * 
 * @param {string} greeting - goes through the getGreeting function
 * @param {string} username - shows the name of the logged in user based on the session storage
 * @returns the full greeting based on a user or a guest
 */
function checkUserOrGuest(greeting, username) {
    if (username) {
        let colorClass = getUserNameColorClass(username);
        return `${greeting},<br> <span class="${colorClass} active_user_greeting">${username}</span>`;
    } else {
        return greeting;
    }
}

/**
 * This function shows the greeting in the desktop version
 * 
 * @param {*} fullGreeting - shows the full greeting based on user or guest
 * @param {*} overlay - overlay just for the mobile version to show the greeting
 * @param {*} mainContent - displays the main content, needs to have a timeout for the mobile version
 */
function desktopGreeting(fullGreeting, overlay, mainContent) {
    document.getElementById("greeting-main-text").innerHTML = fullGreeting;
    overlay.style.display = "none";
    mainContent.style.display = "block";
}

/**
 * This function shows the greeting in the mobile version
 * 
 * @param {*} fullGreeting - shows the full greeting based on user or guest
 * @param {*} overlay - overlay just for the mobile version to show the greeting
 * @param {*} mainContent - displays the main content, needs to have a timeout for the mobile version
 */
function mobileGreeting(fullGreeting, overlay, mainContent) {
    document.getElementById("greeting-overlay-text").innerHTML = fullGreeting;
    overlay.style.display = "flex";
        setTimeout(() => {
            overlay.style.display = "none";
            mainContent.style.display = "block";
        }, 2000);
}

/**
 * This function filters through all tasks just to find all urgent dates and shows the nearest to come
 * @returns {date}
 */
async function filterTaskSummary() {
    let checkboxRef = document.getElementById('checkbox');
    let tasks = await fetchData("/tasks/");
    if (tasks === null){
        checkboxRef.innerHTML = getCheckboxSummaryEmpty();
        iconHoverSwaps();
        return; 
    }
    todos = Object.values(tasks);
    let {tasksToDo,tasksDone,tasksProgress,tasksFeedback,tasksUrgent,urgentDate} = getTasksFiltered(todos);
    checkboxRef.innerHTML = getCheckboxSummary(tasksToDo, tasksDone, tasksProgress, tasksFeedback, tasksUrgent, todos, urgentDate);
    iconHoverSwaps();   
}

/**
 * This is a function to help the filter process
 * @param {Array} todos - all available tasks
 * @returns filtered task or tasks based on priority urgent
 */
function getTasksFiltered(todos) {
    let tasksToDo = todos.filter(task => task.status === "To do");
    let tasksDone = todos.filter(task => task.status === "Done");
    let tasksProgress = todos.filter(task => task.status === "In progress");
    let tasksFeedback = todos.filter(task => task.status === "Await feedback");
    let tasksUrgent = todos.filter(task => task.priority === "urgent");
    tasksUrgent.sort((a, b) => new Date(a.date) - new Date(b.date));
    let tasksPrioDate = tasksUrgent[0]?.date ?? "";
    let urgentDate = tasksPrioDate ? formatDatetoEnglish(tasksPrioDate) : "";
    return {tasksToDo,tasksDone,tasksProgress,tasksFeedback,tasksUrgent,urgentDate};
}

/**
 * This function gets us our data from our backend
 * 
 * @param {URL} path - our database URL
 * @returns an object or objects from our database
 */
async function fetchData(path) {
  let response = await fetch(BASE_URL + path + ".json");
  let responseAsJson = await response.json();
  return responseAsJson;
}

/**
 * This function helps us to define the nearest urgent date and let it display
 * 
 * @param {date} tasksPrioDate - nearest urgent date 
 * @returns the nearest urgent date
 */
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


