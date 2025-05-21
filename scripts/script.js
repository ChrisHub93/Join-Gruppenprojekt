const BASE_URL = 'https://join-464-default-rtdb.europe-west1.firebasedatabase.app/';


function init() {
    renderHeader();
    renderSidebar();
}

function renderHeader() {
    let contentHeader = document.getElementById('header');
    contentHeader.innerHTML = getHeader();
}

function renderSidebar() {
    let contentSidebar = document.getElementById('sidebar');
    contentSidebar.innerHTML = getSidebar();
}

function test(params) {
    
}