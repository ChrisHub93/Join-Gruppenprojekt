function getHeader() {
    return `
        <div class="header-top">
            <p class="header-name">Kanban Project Management Tool</p>
            <div class="header-top-profile">
                <a href="/Join-Gruppenprojekt/html/help.html"><img class="help-icon" src="/Join-Gruppenprojekt/assets/icons/help.png" alt=""></a>
                <p class="personal-icon">G</p>
            </div>
        </div>
    `
}

function getSidebar() {
    return `
            <img class="sidebar-logo" src="/Join-Gruppenprojekt/assets/img/Capa 1 white.png" alt="">
                <div class="menu-box">
                    <div class="sidebar-menu sidebar-menu-active"><a class="sidebar-text a-active" href="/Join-Gruppenprojekt/html/summary.html"><img src="/Join-Gruppenprojekt/assets/icons/Summary.png" class="sidebar-icon" alt="">Summary</a></div>
                    <div class="sidebar-menu"><a class="sidebar-text" href="/Join-Gruppenprojekt/html/add_task.html"><img src="/Join-Gruppenprojekt/assets/icons/Add task.png" class="sidebar-icon" alt="">Add Task</a></div>
                    <div class="sidebar-menu"><a class="sidebar-text" href="/Join-Gruppenprojekt/html/board.html"><img src="/Join-Gruppenprojekt/assets/icons/Board.png" class="sidebar-icon" alt="">Board</a></div>
                    <div class="sidebar-menu"><a class="sidebar-text" href="/Join-Gruppenprojekt/html/contacts.html"><img src="/Join-Gruppenprojekt/assets/icons/Contacts.png" class="sidebar-icon" alt="">Contacts</a></div>
                </div>
                <div class="sidebar-policy">
                    <a class="sidebar-text policy-color pt-policy" href="/Join-Gruppenprojekt/html/privacy_policy.html">Privacy Policy</a>
                    <a class="sidebar-text policy-color" href="/Join-Gruppenprojekt/html/legal_notice.html">Legal Notice</a>
                </div>
    `
}