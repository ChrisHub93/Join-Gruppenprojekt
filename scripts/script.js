const BASE_URL = 'https://join-464-default-rtdb.europe-west1.firebasedatabase.app/';


function init() {
    activeMenuStorage();
    sidebarVisibility();
}

function loginAsGuest() {
    sessionStorage.setItem('loginStatus', 'guest');
}

// function loginAsUser() {
//     sessionStorage.setItem('loginStatus', 'user');
// }

function logout() {
    sessionStorage.setItem('loginStatus', 'none');
}

function sidebarVisibility() {
    let status = sessionStorage.getItem('loginStatus');
    let isLoggedIn = status === 'user' || status === 'guest';

    document.querySelectorAll('.logged-in').forEach(el => {
        el.classList.remove('hidden-init');
        el.style.display = isLoggedIn ? 'flex' : 'none';
    });

    document.querySelectorAll('.logged-out').forEach(el => {
        el.classList.remove('hidden-init');
        el.style.display = isLoggedIn ? 'none' : 'flex';
    });
    setSideBarMenu(isLoggedIn);
    document.querySelectorAll('.menu-box').forEach(el =>
        el.classList.add('ready')
    );
}

function setSideBarMenu(isLoggedIn) {
    let menuBox = document.querySelector('.menu-box');

    if (!isLoggedIn) {
        menuBox.classList.add('logged-out');
    } else {
        menuBox.classList.remove('logged-out');
    }
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
    if (clickedElement.classList.contains('policy-text') || clickedElement.classList.contains('navbarlink')) {
        sessionStorage.setItem('activePolicy', menuKey);
    } else {
        sessionStorage.removeItem('activePolicy');
    }
    clearMenu();
    addMenuactive(menuKey);
}

function activeMenuStorage() {
    if (checkBlacklist()) return;
    let activeMenu = sessionStorage.getItem('activeMenu') || 'summary';
    let activePolicy = sessionStorage.getItem('activePolicy');
    clearMenu();
        
        document.querySelectorAll(`[menu-data="${activeMenu}"]`).forEach(menuElement => {
        menuElement.classList.add('sidebar-menu-active');
        if (activePolicy && (menuElement.classList.contains('policy-text') || menuElement.classList.contains('navbarlink'))) {
            menuElement.classList.add('policy-text-active');
        }
    });
}

function clearMenu() {
    document.querySelectorAll('.sidebar-menu, .navbarlink, .policy-text').forEach(menu => {
        menu.classList.remove('sidebar-menu-active');
        menu.classList.remove('policy-text-active');
    })
}

function addMenuactive(menuKey) {
        document.querySelectorAll(`[menu-data="${menuKey}"]`).forEach(menuElement => {
        menuElement.classList.add('sidebar-menu-active');
        if (menuElement.classList.contains('policy-text') || menuElement.classList.contains('navbarlink')) {
            menuElement.classList.add('policy-text-active');
        }
    })
}

function checkBlacklist() {
    let excludedPages = ['help.html'];
    let currentPage = window.location.pathname.split('/').pop();

    if (excludedPages.includes(currentPage)) {
        clearMenu();
        sessionStorage.removeItem('activeMenu');
        sessionStorage.removeItem('activePolicy');
        return true;
    }
    return false;
}