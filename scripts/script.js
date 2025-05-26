const BASE_URL = 'https://join-464-default-rtdb.europe-west1.firebasedatabase.app/';


function init() {
    renderHeader();
    renderSidebar();
    activeMenuStorage();
}

function renderHeader() {
    let contentHeader = document.getElementById('header');
    contentHeader.innerHTML = getHeader();
}

function renderSidebar() {
    let contentSidebar = document.getElementById('sidebar');
    contentSidebar.innerHTML = getSidebar();
}

function showNavbar() {
    let navbar = document.getElementById('navbar');
    let navbarhidden = navbar.classList.contains('d-none');

    if (navbarhidden) {
        navbar.classList.remove('d-none');
        outsideNavbar();
    } else {
        navbar.classList.add('d-none');
    }
}

function outsideNavbar() {
    function outsideClick(event) {
        let navbar = document.getElementById('navbar');
        if (!navbar.contains(event.target)) {
            navbar.classList.add('d-none');
            document.removeEventListener('click', outsideClick);
        }
    }
    setTimeout(() => {
        document.addEventListener('click', outsideClick);
    }, 0);
}

function activateMenu(clickedElement, menuKey) {
    sessionStorage.setItem('activeMenu', menuKey);
    clearMenu();

    clickedElement.classList.add('sidebar-menu-active');
    let activeLink = clickedElement.querySelector('.sidebar-text');
    if (activeLink) activeLink.classList.add('a-active');
}

function activeMenuStorage() {
    let activeMenu = sessionStorage.getItem('activeMenu');
        if (!activeMenu) {
        activeMenu = 'summary';
    }
    if (activeMenu) {
        let menuElement = document.querySelector(`[menu-data="${activeMenu}"]`);
        if (menuElement) {
            clearMenu();
            menuElement.classList.add('sidebar-menu-active');
            let activeLink = menuElement.querySelector('.sidebar-text');
            if (activeLink) activeLink.classList.add('a-active');
        }
    }}

function clearMenu() {
    document.querySelectorAll('.sidebar-menu').forEach(menu => {
        menu.classList.remove('sidebar-menu-active');
        let link = menu.querySelector('.sidebar-text');
        if (link) link.classList.remove('a-active');
    })
}