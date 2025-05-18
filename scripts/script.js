


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