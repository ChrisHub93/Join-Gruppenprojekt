function initSummary() {
    iconHoverSwaps();
    showGreeting();
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
    document.getElementById("greeting").textContent = greeting;
    let loadingMobile = window.innerWidth < 768;
    let overlay = document.getElementById("greeting-overlay");
    let mainContent = document.getElementById("main-content");

    if (loadingMobile) {
        overlay.style.display = "flex";
        setTimeout(() => {
            overlay.style.display = "none";
            mainContent.style.display = "block";
        }, 2000);
    } else {
        overlay.style.display = "none";
        mainContent.style.display = "block";
    }
}