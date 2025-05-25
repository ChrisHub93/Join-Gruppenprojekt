function getHeader() {
  return `
            <p class="header-name">Kanban Project Management Tool</p>
            <img class="headerLogo d-none" src="/assets/img/Capa 1.png" alt="">
            <div class="header-top-profile">
                <a href="../html/help.html"><img class="help-icon" src="../assets/icons/help.png" alt=""></a>
                <p onclick="showNavbar()" class="personal-icon">G</p>
            </div>
            <div id="navbar" class="navbar d-none">
                    <a class="navbarlink d-none" href="../html/help.html">Help</a>
                    <a class="navbarlink" href="../html/legal_notice.html">Legal Notice</a>
                    <a class="navbarlink" href="../html/privacy_policy.html">Privacy Policy</a>
                    <a class="navbarlink" href="../index.html">Log Out</a>
            </div>
    `;
}

function getSidebar() {
  return `
            <img class="sidebar-logo" src="../assets/img/Capa 1 white.png" alt="">
                <div class="menu-box">
                    <div class="sidebar-menu" menu-data="summary" onclick="activateMenu(this, 'summary')"><a class="sidebar-text" href="../html/summary.html"><img src="../assets/icons/Summary.png" class="sidebar-icon" alt="">Summary</a></div>
                    <div class="sidebar-menu" menu-data="add_task" onclick="activateMenu(this, 'add_task')"><a class="sidebar-text" href="../html/add_task.html"><img src="../assets/icons/Add task.png" class="sidebar-icon" alt="">Add Task</a></div>
                    <div class="sidebar-menu" menu-data="board" onclick="activateMenu(this, 'board')"><a class="sidebar-text" href="../html/board.html"><img src="../assets/icons/Board.png" class="sidebar-icon" alt="">Board</a></div>
                    <div class="sidebar-menu" menu-data="contacts" onclick="activateMenu(this, 'contacts')"><a class="sidebar-text" href="../html/contacts.html"><img src="../assets/icons/Contacts.png" class="sidebar-icon" alt="">Contacts</a></div>
                </div>
                <div class="sidebar-policy">
                    <a class="sidebar-text policy-color pt-policy" href="../html/privacy_policy.html">Privacy Policy</a>
                    <a class="sidebar-text policy-color" href="../html/legal_notice.html">Legal Notice</a>
                </div>
    `;
}

function getSubTasksTemplate(inputRef) {
  return `<div id="${inputRef.value}" class="relative">
            <div id="bullet${inputRef.value}" class="bullet"></div>
                <input onclick="editTask('${inputRef.value}')" type ="text" value="${inputRef.value}"/>

            <div id="editOrTrash" class="editOrTrash">
                <img onclick="editTask('${inputRef.value}')" src="/assets/icons/Property 1=edit.png" alt="">
                    <div class="subTasksSeperatorSecond"></div>
                <img onclick="completeDeleteTask('${inputRef.value}')" src="/assets/icons/Property 1=delete.png" alt="">
            </div>
                <div id="trashOrCheck" class="editOrTrash d-none">
                    <img onclick="completeDeleteTask('${inputRef.value}')" src="/assets/icons/Property 1=delete.png" alt="">
                        <div class="subTasksSeperatorSecond"></div>
                    <img onclick="acceptTask('${inputRef.value}')" src="/assets/icons/Property 1=check.png" alt="">
                </div>               
            </div>`;
}
