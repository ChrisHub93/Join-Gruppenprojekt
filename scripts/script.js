const BASE_URL = 'https://join-464-default-rtdb.europe-west1.firebasedatabase.app/';


function init() {
    activeMenuStorage();
    sidebarVisibility();
}

// function loginAsGuest() {
//     sessionStorage.setItem('loginStatus', 'guest');
//     sidebarVisibility();
// }

// function loginAsUser() {
//     sessionStorage.setItem('loginStatus', 'user');
//     sidebarVisibility();
// }

function logout() {
    sessionStorage.setItem('loginStatus', 'none');
    sidebarVisibility();
}

function sidebarVisibility() {
    let status = sessionStorage.getItem('loginStatus');
    let isLoggedIn = status === 'user' || status === 'guest';

    document.querySelectorAll('.logged-in').forEach(el =>
        el.style.display = isLoggedIn ? 'flex' : 'none'
    );

    document.querySelectorAll('.logged-out').forEach(el =>
        el.style.display = isLoggedIn ? 'none' : 'flex'
    );
    setSideBarMenu(isLoggedIn);
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
    clearMenu();

        document.querySelectorAll(`[menu-data="${menuKey}"]`).forEach(menuElement => {
        menuElement.classList.add('sidebar-menu-active');
        let activeLink = menuElement.querySelector('.sidebar-text');
        if (activeLink) activeLink.classList.add('a-active');
    });
}

function activeMenuStorage() {
    let activeMenu = sessionStorage.getItem('activeMenu') || 'summary';
    clearMenu();
        
        document.querySelectorAll(`[menu-data="${activeMenu}"]`).forEach(menuElement => {
        menuElement.classList.add('sidebar-menu-active');
        let activeLink = menuElement.querySelector('.sidebar-text');
        if (activeLink) activeLink.classList.add('a-active');
    });    
}

function clearMenu() {
    document.querySelectorAll('.sidebar-menu').forEach(menu => {
        menu.classList.remove('sidebar-menu-active');
        let link = menu.querySelector('.sidebar-text');
        if (link) link.classList.remove('a-active');
    })
}