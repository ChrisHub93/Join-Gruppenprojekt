function getProfileRender(colorClass, username) { 
  return `
          <p onclick="showNavbar()" class="personal-icon ${colorClass}">${username}</p>
    `;
}

function getProfileRenderGuest() {
  return `                
          <p onclick="showNavbar()" class="personal-icon">G</p>`
}

function getBasicSelectTemplate(){
  return `<span id="select">Select task category</span>
                <img
                  id="arrowCategory"
                  class="arrow"
                  src="/assets/icons/arrow_drop_down.png"
                  alt=""
                />`;
}

function getContactList(contact, assignedColor) {
  return `  <li
                  onclick="getContact('${contact.id}')"
                  id="contact${contact.id}"
                  class="optionsCategory inputFlex">
                  <div class="contacts_name_icon">
                    <p id="contacts_name_icon${contact.id}" class="assigned_to_icon ${assignedColor}">${contact.firstname.toUpperCase().charAt(0)}${contact.lastname.toUpperCase().charAt(0)}</p>
                    ${contact.firstname + " "} ${contact.lastname}
                  </div>
                  <input type="checkbox" class="checkBox" />
                  <img
                    onclick="setCheckBox('contact${contact.id}', event)"
                    id="checkBoxImg${contact.id}"
                    class="checkBoxImg"
                    src="/assets/icons/Check button.png"
                    alt=""
                  />
                </li>
  `;
}

function getContactListLoggedInUser(contact, assignedColor) {
  return `  <li
                  onclick="getContact('${contact.id}')"
                  id="contact${contact.id}"
                  class="optionsCategory inputFlex">
                  <div class="contacts_name_icon">
                    <p id="contacts_name_icon${contact.id}" class="assigned_to_icon ${assignedColor}">${contact.name.toUpperCase().charAt(0)}</p>
                    ${contact.name + " (You)"}
                  </div>
                  <input type="checkbox" class="checkBox" />
                  <img
                    onclick="setCheckBox('contact${contact.id}', event)"
                    id="checkBoxImg${contact.id}"
                    class="checkBoxImg"
                    src="/assets/icons/Check button.png"
                    alt=""
                  />
                </li>
  `;
}

function getSubTasksTemplate(inputRef) {
  return `<div id="${inputRef.value}" class="relative">
            <div id="bullet${inputRef.value}" class="bullet"></div>
                <input onclick="editTask('${inputRef.value}')" type ="text" value="${inputRef.value}" class="subTaskAdded"/>

            <div id="editOrTrash${inputRef.value}" class="editOrTrash d-nonevip">
                <img onclick="editTask('${inputRef.value}')" src="/assets/icons/Property 1=edit.png" alt="">
                    <div class="subTasksSeperatorSecond"></div>
                <img onclick="completeDeleteTask('${inputRef.value}')" src="/assets/icons/Property 1=delete.png" alt="">
            </div>
                <div id="trashOrCheck${inputRef.value}" class="trashOrCheck d-nonevip">
                    <img onclick="completeDeleteTask('${inputRef.value}')" src="/assets/icons/Property 1=delete.png" alt="">
                        <div class="subTasksSeperatorSecond"></div>
                    <img onclick="acceptTask('${inputRef.value}')" src="/assets/icons/Property 1=check.png" alt="">
                </div>               
            </div>`;

}

function getDetailsOfContact(
  divRef,
  firstNameOfUser,
  lastNameOfUser,
  emailOfUser,
  phoneOfUser
) {
  return `<div class="moreAboutcontactInfo">
            <div id="moreAboutcircleFirstLetters" class="moreAboutcircleFirstLetters ${
              divRef[1]
            }">
              <span>${firstNameOfUser.charAt(0)}</span>
              <span>${lastNameOfUser.charAt(0)}</span>
            </div>

            <div class="editinfoAboutContact">
              <h2>${firstNameOfUser} ${lastNameOfUser}</h2>
              <div id="editOrDeleteSection" class="editOrDeleteFlex">
                <div onclick ="openEditOverlay(event)" class="edit editOrDeleteFlex">
                  <img  class="defaultIcon" src="/assets/icons/Property 1=edit.png" alt="" />
                  <img class="hoverIcon" src="/assets/icons/edit-hover.png" alt="" />
                  <span>Edit</span>
                </div>

                <div onclick ="deleteUser()" class="delete editOrDeleteFlex">
                  <img class="defaultIcon" src="/assets/icons/Property 1=delete.png" alt="" />
                  <img class="hoverIcon" src="/assets/icons/delete-hover.png" alt="" />
                  <span>Delete</span>
                </div>
              </div>
            </div>
          </div>

          <div class="contactInformation">
            <span>Contact Information</span>
          </div>

          <div class="emailOverlay">
            <span class="subTitleEmail">Email</span>
            <span class="email">${emailOfUser}</span>
          </div>

          <div class="phoneOverlay" id="phoneOverlay">
            <span class="subTitlePhoneOverlay">Phone</span>
            <span>${phoneOfUser}</span>
          </div>`;
}

function getBasicInfoAboutContact(
  emailOfUser,
  firstNameOfUser,
  lastNameOfUser,
  phoneOfUser
) {
  return `<div id="order${firstNameOfUser.charAt(0).toUpperCase()}"></div>
            <div id="allMainInfoAbout${firstNameOfUser+lastNameOfUser}">
            <div id="setNewBgFor${
              firstNameOfUser + lastNameOfUser
            }" class="contactInfo" onclick="moreDetailsAboutContact('${emailOfUser}', '${firstNameOfUser}', '${lastNameOfUser}', '${phoneOfUser}')">
              <div id="circleFirstLetters${
                firstNameOfUser + lastNameOfUser
              }" class="circleFirstLetters">
                <span>${firstNameOfUser.charAt(0)}</span>
                <span>${lastNameOfUser.charAt(0)}</span>
              </div>
              <div class="maininfoAboutContact">
                <span class="name">${firstNameOfUser} ${lastNameOfUser}</span>
                <span class="email">${emailOfUser}</span>
              </div>
            </div>
          </div>`;
}

function getEditedBasicInfoAboutContact(
  divRef, 
  firstNameOfUser,
  lastNameOfUser,
  emailOfUser,
  phoneOfUser
) {
  return `<div id="order${firstNameOfUser.charAt(0).toUpperCase()}"></div>
            <div id="allMainInfoAbout${firstNameOfUser+lastNameOfUser}">
            <div id="setNewBgFor${
              firstNameOfUser + lastNameOfUser
            }" class="contactInfo" onclick="moreDetailsAboutContact('${emailOfUser}', '${firstNameOfUser}', '${lastNameOfUser}', '${phoneOfUser}')">
              <div id="circleFirstLetters${
                firstNameOfUser+lastNameOfUser}" class="circleFirstLetters ${divRef[1]}">
                <span>${firstNameOfUser.charAt(0)}</span>
                <span>${lastNameOfUser.charAt(0)}</span>
              </div>
              <div class="maininfoAboutContact">
                <span class="name">${firstNameOfUser} ${lastNameOfUser}</span>
                <span class="email">${emailOfUser}</span>
              </div>
            </div>
          </div>
          `;
}

function getSortTitleTemplate(firstNameOfUser) {
  return `<div class="paddingTop">  
                          <span>${firstNameOfUser
                            .charAt(0)
                            .toUpperCase()}</span>
                          </div>
                          <div class="seperator"></div>`;
}

function getCheckboxSummary(tasksToDo, tasksDone, tasksProgress, tasksFeedback, tasksUrgent, todos, urgentDate) {
  return `
          <div class="center-between">
            <div onclick="location.href = '../html/board.html'; activateMenu(this, 'board')" class="summary-box checkboxtodo">
                <img class="todone-icon" src="../assets/icons/todo.png" data-alt-src="../assets/icons/todo-hover.png" alt="">
                <div>
                    <p class="summary-number">${tasksToDo.length}</p>
                    <p class="summary-text">To-do</p>
                </div>
            </div>
            <div onclick="location.href = '../html/board.html'; activateMenu(this, 'board')" class="summary-box checkboxtodo">
                <img class="todone-icon" src="../assets/icons/done.png" data-alt-src="../assets/icons/done-hover.png" alt="">
                <div>
                    <p class="summary-number">${tasksDone.length}</p>
                    <p class="summary-text">Done</p>
                </div>
            </div>
        </div>
        <div onclick="location.href = '../html/board.html'; activateMenu(this, 'board')" class="checkboxurgent summary-box space-evenly">
            <div class="flex-gap18">
                <img class="summary-urgent" src="../assets/icons/prio-summary.png" alt="">
                <div>
                    <p class="summary-number">${tasksUrgent.length}</p>
                    <p class="summary-text">Urgent</p>
                </div>
            </div>
            <div class="seperator-urgent"></div>
                <div class="deadline">
                    <p class="deadline-date">${urgentDate}</p>
                    <p class="deadline-text">Upcoming Deadline</p>
                </div>
        </div>
        <div class="page-box center-between">
            <div onclick="location.href = '../html/board.html'; activateMenu(this, 'board')" class="summary-box checkboxoverall">
                <div class="checkboxbottom">
                    <p class="summary-number">${todos.length}</p>
                    <p class="summary-text">Tasks in Board</p>
                </div>
            </div>
            <div onclick="location.href = '../html/board.html'; activateMenu(this, 'board')" class="summary-box checkboxoverall">
                <div class="checkboxbottom">
                    <p class="summary-number">${tasksProgress.length}</p>
                    <p class="summary-text">Tasks in Progress</p>
                </div>
            </div>
            <div onclick="location.href = '../html/board.html'; activateMenu(this, 'board')" class="summary-box checkboxoverall">
                <div class="checkboxbottom">
                    <p class="summary-number">${tasksFeedback.length}</p>
                    <p class="summary-text">Awaiting Feedback</p>
                </div>
            </div>
        </div>
  `
}

function getCheckboxSummaryEmpty() {
  return `
          <div class="center-between">
            <div onclick="location.href = '../html/board.html'; activateMenu(this, 'board')" class="summary-box checkboxtodo">
                <img class="todone-icon" src="../assets/icons/todo.png" data-alt-src="../assets/icons/todo-hover.png" alt="">
                <div>
                    <p class="summary-number">0</p>
                    <p class="summary-text">To-do</p>
                </div>
            </div>
            <div onclick="location.href = '../html/board.html'; activateMenu(this, 'board')" class="summary-box checkboxtodo">
                <img class="todone-icon" src="../assets/icons/done.png" data-alt-src="../assets/icons/done-hover.png" alt="">
                <div>
                    <p class="summary-number">0</p>
                    <p class="summary-text">Done</p>
                </div>
            </div>
        </div>
        <div onclick="location.href = '../html/board.html'; activateMenu(this, 'board')" class="checkboxurgent summary-box space-evenly">
            <div class="flex-gap18">
                <img class="summary-urgent" src="../assets/icons/prio-summary.png" alt="">
                <div>
                    <p class="summary-number">0</p>
                    <p class="summary-text">Urgent</p>
                </div>
            </div>
            <div class="seperator-urgent"></div>
                <div class="deadline">
                    <p class="deadline-date"></p>
                    <p class="deadline-text">Upcoming Deadline</p>
                </div>
        </div>
        <div class="page-box center-between">
            <div onclick="location.href = '../html/board.html'; activateMenu(this, 'board')" class="summary-box checkboxoverall">
                <div class="checkboxbottom">
                    <p class="summary-number">0</p>
                    <p class="summary-text">Tasks in Board</p>
                </div>
            </div>
            <div onclick="location.href = '../html/board.html'; activateMenu(this, 'board')" class="summary-box checkboxoverall">
                <div class="checkboxbottom">
                    <p class="summary-number">0</p>
                    <p class="summary-text">Tasks in Progress</p>
                </div>
            </div>
            <div onclick="location.href = '../html/board.html'; activateMenu(this, 'board')" class="summary-box checkboxoverall">
                <div class="checkboxbottom">
                    <p class="summary-number">0</p>
                    <p class="summary-text">Awaiting Feedback</p>
                </div>
            </div>
        </div>
  `
}