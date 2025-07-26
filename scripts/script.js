const BASE_URL =
  "https://join-464-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Function to show sidebar and active menu
 */
function init() {
  activeMenuStorage();
  sidebarVisibility();
}

/**
 * Function to set the user as a guest
 */
function loginAsGuest() {
  sessionStorage.setItem("loginStatus", "guest");
}

/**
 * Function to clear the session storage
 */
function logout() {
  sessionStorage.setItem("loginStatus", "none");
  sessionStorage.removeItem("loggedInUser");
  sessionStorage.removeItem("activeMenu");
  sessionStorage.removeItem("activePolicy");
}

/**
 * function to show the sidebar menu for logged in user or logged out user and show it after declaration
 */
function sidebarVisibility() {
  let status = sessionStorage.getItem("loginStatus");
  let isLoggedIn = status === "user" || status === "guest";
  document.querySelectorAll(".logged-in").forEach((el) => {
    el.classList.remove("hidden-init");
    el.style.display = isLoggedIn ? "flex" : "none";
  });
  document.querySelectorAll(".logged-out").forEach((el) => {
    el.classList.remove("hidden-init");
    el.style.display = isLoggedIn ? "none" : "flex";
  });
  setSideBarMenu(isLoggedIn);
  document.querySelectorAll(".menu-box").forEach((el) => el.classList.add("ready"));
}

/**
 * Function to declare which menu will be displayed
 * 
 * @param {boolean} isLoggedIn - session storage item
 */
function setSideBarMenu(isLoggedIn) {
  let menuBox = document.querySelector(".menu-box");
  if (!isLoggedIn) {
    menuBox.classList.add("logged-out");
  } else {
    menuBox.classList.remove("logged-out");
  }
}

/**
 * function to declare when the navbar is shown
 */
function toggleNavbar() {
  let navbar = document.getElementById("navbar");
  let isHidden = navbar.classList.contains("d-none");
  if (isHidden) {
    showNavbar(navbar);
  } else {
    hideNavbar(navbar);
  }
}

/**
 * function to show the navbar based on desktop or mobile Version
 * 
 * @param {HTMLElement} navbar - DOM Element of navbar
 */
function showNavbar(navbar) {
  let mobileCheck = window.innerWidth <= 768;
  navbar.classList.remove("d-none");
  outsideNavbar();
  if (mobileCheck) {
    setTimeout(() => {
      navbar.style.right = "20px";
    }, 0);
  } else {
    navbar.style.right = "";
  }
}

/**
 * function to hide the navbar
 * 
 * @param {HTMLElement} navbar - DOM Element of navbar
 */
function hideNavbar(navbar) {
  let mobileCheck = window.innerWidth <= 768;
  if (mobileCheck) {
    navbar.style.right = "-250px";
    setTimeout(() => {
      navbar.classList.add("d-none");
    }, 300);
  } else {
    navbar.classList.add("d-none");
  }
}

/**
 * function to close the navbar with an outside click
 */
function outsideNavbar() {
  let navbar = document.getElementById("navbar");
  let isTransitioning = navbar.style.transitionDuration === "0.5s";
  function outsideClick(event) {
    if (isTransitioning) return;
    if (!navbar.contains(event.target)) {
      hideNavbar(navbar);
      document.removeEventListener("click", outsideClick);
    }
  }
  setTimeout(() => {
    document.addEventListener("click", outsideClick);
  }, 0);
}

/**
 * function to show the clicked element of the sidebar
 * @param {HTMLElement} clickedElement - clicked DOM Element
 * @param {string} menuKey - key to identify the clicked menu
 */
function activateMenu(clickedElement, menuKey) {
  if (menuKey !== "help") {
    sessionStorage.setItem("activeMenu", menuKey);
    if (policyCheck(clickedElement)) {
      sessionStorage.setItem("activePolicy", menuKey);
    } else {
      sessionStorage.removeItem("activePolicy");
    }
  }
  clearAllMenus();
  addMenuactive(menuKey);
    let anchor = clickedElement.querySelector("a");
  if (anchor && anchor.href) {
    window.location.href = anchor.href;
  }
}

/**
 * function to get the active menu from the session storage
 * @returns active menu element with active classes
 */
function activeMenuStorage() {
  let helpPage = window.location.pathname.includes("help.html");
  let activeMenu = sessionStorage.getItem("activeMenu") || "summary";
  let activePolicy = sessionStorage.getItem("activePolicy");
  clearAllMenus();
  if (helpPage) {return;}
  document.querySelectorAll(`[menu-data="${activeMenu}"]`)
    .forEach((menuElement) => {
      menuElement.classList.add("sidebar-menu-active");
      if (
        activePolicy && policyCheck(menuElement)) {
        menuElement.classList.add("policy-text-active");
      }
    });
}

/**
 * function to add the active menu classes to the clicked menu
 * 
 * @param {string} menuKey - key to identify the clicked menu
 */
function addMenuactive(menuKey) {
  document.querySelectorAll(`[menu-data="${menuKey}"]`).forEach(setMenuActive);
}

/**
 * function to check for policy elements in the project
 * 
 * @param {string} el - clicked element/key
 * @returns logic to identify policy HTML Elements
 */
function policyCheck(el) {
  return (
    el.classList.contains("policy-text") ||
    el.classList.contains("navbarlink") ||
    el.classList.contains("footer-login__link")
  );
}

/**
 * function to give classes to the active menu
 * 
 * @param {string} el - clicked element/key
 */
function setMenuActive(el) {
    el.classList.add("sidebar-menu-active");
  if (policyCheck(el)) {
    el.classList.add("policy-text-active");
  }
}

/**
 * function to clear all classes of the sidebar menu
 */
function clearAllMenus() {
    document.querySelectorAll(".sidebar-menu, .navbarlink, .policy-text")
    .forEach((menu) => {
      menu.classList.remove("sidebar-menu-active", "policy-text-active");
    });
}

/**
 * function to get the Icon letters
 * 
 * @param {string} name 
 * @returns the first letters of the firstname and last name
 */
function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

/**
 * function to iterate through all contacts
 * 
 * @param {string} id - id of all contacts 
 * @returns {initials: string, name: string, assignedColor: string, id: string} - object with the named parameters
 */
function contactRenderData(id) {
  let contact = globalContacts.find((c) => c.id === id);
  if (!contact) return null;

  let name = `${contact.firstname} ${contact.lastname}`;
  let initials = getInitials(name);
  let assignedColor = getAvatarColorClass(name);

  return { initials, name, assignedColor, id };
}

/**
 * function to show the assigned contacts as initials of a task
 * 
 * @param {Array} assignedToIds - list of assigned contacts
 * @returns {string} - Initials or a text if nobody is assigned
 */
function getAssignedInitials(assignedToIds) {
  if (!assignedToIds) {
    return `
    <p class="assigned_to_empty">Nobody assigned yet</p>`;
  } else {
    return assignedToIds
      .map((id) => {
        let data = contactRenderData(id);
        if (!data) return "";
        return assignedLineRender(data);
      })
      .join("");
  }
}

/**
 * function to show the assigned contacts as initials on an edited task
 * 
 * @param {Array} assignedToIds - list of assigned contacts
 * @returns {string} - Initials or nothing
 */
function getAssignedInitialsEditIcons(assignedToIds) {
  if (!assignedToIds) {
    return "";
  } else {
    return assignedToIds
      .map((id) => {
        let data = contactRenderData(id);
        if (!data) return "";
        return assignedIconEditRender(data);
      })
      .join("");
  }
}

/**
 * function to identify a color index based on a name, 
 * where the index ist between 0 and 14
 *
 * @param {string} name - name to identify the color index
 * @returns {number} - integer between 0 and 14
 */
function getHashedColorIndex(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 15;
}

/**
 * function to define the CSS class of an user
 *
 * @param {string} name - full name of an user
 * @returns {string} - CSS class name
 */
function getAvatarColorClass(name) {
  let index = getHashedColorIndex(name);
  return `initials_color_${index}`;
}

/**
 * function to define the CSS class of a user
 *
 * @param {string} name - full name of an user
 * @returns {string} - CSS class name
 */
function getUserNameColorClass(name) {
  let index = getHashedColorIndex(name);
  return `user_color_${index}`;
}

/**
 * function to render the profile icon based on the login status.
 * Differs between a true logged in user, guest or no icon.
 * 
 * @returns {void}
 */
function getProfile() {
    let status = sessionStorage.getItem("loginStatus");
  if (status !== "user" && status !== "guest") return;
  let profileRef = document.getElementById("profile");
  let username = sessionStorage.getItem("loggedInUser");
  if (username) {
    let usernameInitials = getInitials(username);
    let colorClass = getUserNameColorClass(username);
    profileRef.innerHTML = getProfileRender(colorClass, usernameInitials);
  } else {
    profileRef.innerHTML = getProfileRenderGuest();
  }
}
