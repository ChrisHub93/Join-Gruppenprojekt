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
    document.getElementById("greeting").textContent = greeting;
}