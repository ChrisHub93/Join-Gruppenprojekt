function getProfile() {
  return `
                <a href="../html/help.html"><img class="help-icon" src="../assets/icons/help.png" alt=""></a>
                <p onclick="showNavbar()" class="personal-icon">    </p>
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
