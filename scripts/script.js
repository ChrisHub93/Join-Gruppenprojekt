const BASE_URL =
  "https://join-464-default-rtdb.europe-west1.firebasedatabase.app/";

function init() {
  let loginStatus = sessionStorage.getItem("loginStatus")
  if (loginStatus !== "user" && loginStatus !== "guest") {
      window.location.href = "../index.html";
      return;
  }
  activeMenuStorage();
  sidebarVisibility();
}

function loginAsGuest() {
  sessionStorage.setItem("loginStatus", "guest");
}

function logout() {
  sessionStorage.setItem("loginStatus", "none");
  sessionStorage.removeItem("loggedInUser");
}

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
  document
    .querySelectorAll(".menu-box")
    .forEach((el) => el.classList.add("ready"));
}

function setSideBarMenu(isLoggedIn) {
  let menuBox = document.querySelector(".menu-box");

  if (!isLoggedIn) {
    menuBox.classList.add("logged-out");
  } else {
    menuBox.classList.remove("logged-out");
  }
}

function showNavbar() {
  let navbar = document.getElementById("navbar");
  let navbarhidden = navbar.classList.contains("d-none");
  let mobileCheck = window.innerWidth <= 768;

  if (navbarhidden) {
    navbar.classList.remove("d-none");
    outsideNavbar();
    if (mobileCheck) {
      setTimeout(function () {
        navbar.style.right = "20px";
      }, 0);
    } else {
      navbar.style.right = "";
    }
  } else {
    if (mobileCheck) {
      navbar.style.right = "-250px";
      setTimeout(function () {
        navbar.classList.add("d-none");
      }, 300);
    } else {
      navbar.classList.add("d-none");
    }
  }
}

function outsideNavbar() {
  let navbar = document.getElementById("navbar");
  let isTransitioning = navbar.style.transitionDuration === "0.5s";
  function outsideClick(event) {
    if (isTransitioning) return;

    if (!navbar.contains(event.target)) {
      navbar.style.right = "-250px";
      setTimeout(function () {
        navbar.classList.add("d-none");
      }, 300);
      document.removeEventListener("click", outsideClick);
    }
  }
  setTimeout(() => {
    document.addEventListener("click", outsideClick);
  }, 0);
}

function activateMenu(clickedElement, menuKey) {
  if (menuKey !== "help") {
    sessionStorage.setItem("activeMenu", menuKey);
  }
  if (
    menuKey !== "help" &&
    (clickedElement.classList.contains("policy-text") ||
      clickedElement.classList.contains("navbarlink"))
  ) {
    sessionStorage.setItem("activePolicy", menuKey);
  } else if (menuKey !== "help") {
    sessionStorage.removeItem("activePolicy");
  }
  clearMenu();
  addMenuactive(menuKey);
}

function activeMenuStorage() {
  if (window.location.pathname.includes("../html/help.html")) return;
  let activeMenu = sessionStorage.getItem("activeMenu") || "summary";
  let activePolicy = sessionStorage.getItem("activePolicy");
  clearMenu();

  document
    .querySelectorAll(`[menu-data="${activeMenu}"]`)
    .forEach((menuElement) => {
      menuElement.classList.add("sidebar-menu-active");
      if (
        activePolicy &&
        (menuElement.classList.contains("policy-text") ||
          menuElement.classList.contains("navbarlink"))
      ) {
        menuElement.classList.add("policy-text-active");
      }
    });
}

function clearMenu() {
  document
    .querySelectorAll(".sidebar-menu, .navbarlink, .policy-text")
    .forEach((menu) => {
      menu.classList.remove("sidebar-menu-active");
      menu.classList.remove("policy-text-active");
    });
}

function addMenuactive(menuKey) {
  document
    .querySelectorAll(`[menu-data="${menuKey}"]`)
    .forEach((menuElement) => {
      menuElement.classList.add("sidebar-menu-active");
      if (
        menuElement.classList.contains("policy-text") ||
        menuElement.classList.contains("navbarlink")
      ) {
        menuElement.classList.add("policy-text-active");
      }
    });
}

function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function getAssignedInitials(assignedToIds) {
  if (assignedToIds === undefined) {
    return `
    <p class="assigned_to_empty">Nobody assigned yet</p>`;
  } else {
    return assignedToIds
      .map((id) => {
        let contactRef = globalContacts.find((contact) => contact.id === id);
        if (!contactRef) return "";
        let name = `${contactRef.firstname} ${contactRef.lastname}`;
        let initials = getInitials(name);
        let assignedColor = getAvatarColorClass(name);
        return assignedLineRender(initials, name, assignedColor);
      })
      .join("");
  }
}

function getAssignedInitialsEditIcons(assignedToIds) {
  if (assignedToIds === undefined) {
    return "";
  } else {
    return assignedToIds
      .map((id) => {
        let contactRef = globalContacts.find((contact) => contact.id === id);
        if (!contactRef) return "";
        let name = `${contactRef.firstname} ${contactRef.lastname}`;
        let initials = getInitials(name);
        let assignedColor = getAvatarColorClass(name);
        return assignedIconEditRender(initials, assignedColor);
      })
      .join("");
  }
}

function getAvatarColorClass(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  let index = Math.abs(hash) % 15;
  return `initials_color_${index}`;
}

function getUserNameColorClass(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  let index = Math.abs(hash) % 15;
  return `user_color_${index}`;
}

function getProfile() {
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
