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
                <div id="trashOrCheck" class="editOrTrash d-nonevip">
                    <img onclick="completeDeleteTask('${inputRef.value}')" src="/assets/icons/Property 1=delete.png" alt="">
                        <div class="subTasksSeperatorSecond"></div>
                    <img onclick="acceptTask('${inputRef.value}')" src="/assets/icons/Property 1=check.png" alt="">
                </div>               
            </div>`;
}

function getDetailsOfContact(divRef,firstNameOfUser,lastNameOfUser,emailOfUser,phoneOfUser) {
  return `<div class="moreAboutcontactInfo">
            <div id="moreAboutcircleFirstLetters" class="moreAboutcircleFirstLetters ${divRef[1]}">
              <span>${firstNameOfUser.charAt(0)}</span>
              <span>${lastNameOfUser.charAt(0)}</span>
            </div>

            <div class="editinfoAboutContact">
              <h2>${firstNameOfUser} ${lastNameOfUser}</h2>
              <div class="editOrDeleteFlex">
                <div onclick ="openEditOverlay(event)" class="edit editOrDeleteFlex">
                  <img  class="defaultIcon" src="/assets/icons/Property 1=edit.png" alt="" />
                  <img class="hoverIcon" src="/assets/icons/edit-hover.png" alt="" />
                  <span>Edit</span>
                </div>

                <div class="delete editOrDeleteFlex">
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

          <div class="phoneOverlay">
            <span class="subTitlePhoneOverlay">Phone</span>
            <span>${phoneOfUser}</span>
          </div>`;
}

function getBasicInfoAboutContact(emailOfUser,firstNameOfUser,lastNameOfUser,phoneOfUser) {
  return `<div id="order${firstNameOfUser.charAt(0).toUpperCase()}"></div>
            <div id="setNewBgFor${firstNameOfUser+lastNameOfUser}" class="contactInfo" onclick="moreDetailsAboutContact('${emailOfUser}', '${firstNameOfUser}', '${lastNameOfUser}', '${phoneOfUser}')">
              <div id="circleFirstLetters${firstNameOfUser+lastNameOfUser}" class="circleFirstLetters">
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

function getSortTitleTemplate(firstNameOfUser) {
  return `<div class="paddingTop">  
                          <span>${firstNameOfUser
                            .charAt(0)
                            .toUpperCase()}</span>
                          </div>
                          <div class="seperator"></div>`;
}
