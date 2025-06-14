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

function getBasicInfoAboutContact(
  emailOfUser,
  firstNameOfUser,
  lastNameOfUser,
  phoneOfUser
) {
  return `<div id="order${firstNameOfUser.charAt(0).toUpperCase()}"></div>
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
  return `
            
              <div id="circleFirstLetters${
                firstNameOfUser + lastNameOfUser
              }" class="circleFirstLetters ${divRef[1]}">
                <span>${firstNameOfUser.charAt(0)}</span>
                <span>${lastNameOfUser.charAt(0)}</span>
              </div>
              <div class="maininfoAboutContact">
                <span class="name">${firstNameOfUser} ${lastNameOfUser}</span>
                <span class="email">${emailOfUser}</span>
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

function getAddTaskTemplate() {
  return `<div class="form">
        <div class="hedalineAddTask">
          <h1>Add Task</h1>
          <button class="hedalineAddTask__closeBtn">
            <img
              
              src="../assets/icons/close.png"
              alt="add icon mobile"
            />
          </button>
        </div>
        <div class="AddTaskContentContainer">
        <div class="typeOfTask">
          <div class="column mb12">
            <span class=" ">Title<mark>*</mark></span>
            <input
              onfocusout="checkEmptyTitle()"
              type="text"
              name="title"
              id="title"
              placeholder="Enter a title"
              required
            />
            <span id="errorTitle" class="opacity">This field is required</span>
          </div>

          <div class="column">
            <span class="">Description</span>
            <textarea
              name="description"
              id="description"
              class="description"
              placeholder="Enter a Description"
            ></textarea>
          </div>

          <div class="column">
            <span class=" ">Due Date<mark>*</mark></span>
            <input
              onfocusout="checkEmptyDate()"
              type="date"
              name="date"
              id="date"
              required
            />
            <span id="errorDate" class="opacity">This field is required</span>
          </div>
        </div>

        <div class="seperator"></div>

        <div class="priority">
          <div class="column">
            <span class=" ">Priority</span>
            <div class="choose">
              <div
                id="urgent"
                class="priorityBtn"
                onclick="setPriorityUrgent('urgent')"
              >
                <span>Urgent</span>
                <img
                  id="standardUrgentIcon"
                  class=""
                  src="/assets/icons/Prio alta.png"
                  alt=""
                />
                <img
                  id="activeUrgentIcon"
                  class="d-nonevip"
                  src="/assets/icons/Prio alta active.png"
                  alt=""
                />
              </div>

              <div
                id="medium"
                class="priorityBtn priorityMediumBg"
                onclick="setPriorityMedium('medium')"
              >
                <span>Medium</span>
                <img
                  id="standardMediumIcon"
                  class="d-nonevip"
                  src="/assets/icons/Prio media.png"
                  alt=""
                />
                <img
                  id="activeMediumIcon"
                  class=""
                  src="/assets/icons/Prio media active.png"
                  alt=""
                />
              </div>

              <div id="low" class="priorityBtn" onclick="setPriorityLow('low')">
                <span id="low">Low</span>
                <img
                  id="standardLowIcon"
                  class=""
                  src="/assets/icons/Prio baja.png"
                  alt=""
                />
                <img
                  id="activeLowIcon"
                  class="d-nonevip"
                  src="/assets/icons/Prio baja active.png"
                  alt=""
                />
              </div>
            </div>
          </div>

          <div class="   ">
            <span class=" ">Assigned to</span>

            <div class="category">
              <div
                id="assigned "
                class="inputSelectContact"
                onclick="openAssignedTo()"
              >
                <span id="selectMember" class="select inputFlex">
                  Select Contacts to Assign
                </span>
                <img
                  id="arrow"
                  class="arrow inputStyleArrow"
                  src="/assets/icons/arrow_drop_down.png"
                  alt=""
                />
              </div>
              <ul id="allMembers" class="options">
                <li
                  onclick="getContact('contact1')"
                  id="contact1"
                  class="optionsCategory inputFlex"
                >
                  Contact 1
                  <input type="checkbox" class="checkBox" />
                  <img
                    onclick="setCheckBox('contact1', event)"
                    id="checkBoxImg1"
                    class="checkBoxImg"
                    src="/assets/icons/Check button.png"
                    alt=""
                  />
                </li>

                <li
                  onclick="getContact('contact2')"
                  id="contact2"
                  class="optionsCategory inputFlex"
                >
                  Contact 2
                  <input type="checkbox" class="checkBox" />
                  <img
                    onclick="setCheckBox('contact2', event)"
                    id="checkBoxImg2"
                    class="checkBoxImg"
                    src="/assets/icons/Check button.png"
                    alt=""
                  />
                </li>

                <li
                  onclick="getContact('contact3')"
                  id="contact3"
                  class="optionsCategory inputFlex"
                >
                  Contact 3
                  <input type="checkbox" class="checkBox" />
                  <img
                    onclick="setCheckBox('contact3', event)"
                    id="checkBoxImg3"
                    class="checkBoxImg"
                    src="/assets/icons/Check button.png"
                    alt=""
                  />
                </li>

                <li
                  onclick="getContact('contact4')"
                  id="contact4"
                  class="optionsCategory inputFlex"
                >
                  Contact 4
                  <input type="checkbox" class="checkBox" />
                  <img
                    onclick="setCheckBox('contact4', event)"
                    id="checkBoxImg4"
                    class="checkBoxImg"
                    src="/assets/icons/Check button.png"
                    alt=""
                  />
                </li>

                <li
                  onclick="getContact('contact5')"
                  id="contact5"
                  class="optionsCategory inputFlex"
                >
                  Contact 5
                  <input type="checkbox" class="checkBox" />
                  <img
                    onclick="setCheckBox('contact5', event)"
                    id="checkBoxImg5"
                    class="checkBoxImg"
                    src="/assets/icons/Check button.png"
                    alt=""
                  />
                </li>
              </ul>
            </div>
            <div id="assignedMembers"></div>
          </div>

          <div class="   ">
            <span class=" ">Category<mark>*</mark></span>
            <div class="category">
              <div class="select inputFlex" id="" onclick="openTaskCategory()">
                <span id="select">Select task category</span>
                <img
                  id="arrowCategory"
                  class="arrow"
                  src="/assets/icons/arrow_drop_down.png"
                  alt=""
                />
              </div>
              <ul id="allOptions" class="options">
                <li
                  onclick="getCategory('index1')"
                  id="index1"
                  class="optionsCategory"
                >
                  Technical Task
                </li>
                <li
                  onclick="getCategory('index2')"
                  id="index2"
                  class="optionsCategory"
                >
                  User Story
                </li>
              </ul>
            </div>
          </div>

          <div class="columnSubTask">
            <span class=" ">Subtasks</span>
            <input
              type="text"
              name="subtasks"
              id="subTaskInput"
              placeholder="Add new subtask"
            />
            <img
              onclick="chooseSubTask()"
              id="plusIcon"
              class="plusIcon"
              src="/assets/icons/Subtasks-plus.png"
              alt=""
            />

            <div id="cancelOrCheck" class="cancelOrCheck d-nonevip">
              <img
                onclick="deleteTask()"
                src="/assets/icons/iconoir_cancel.png"
                alt=""
              />
              <div class="subTasksSeperator"></div>
              <img
                onclick="addTask()"
                src="/assets/icons/Property 1=check.png"
                alt=""
              />
            </div>
          </div>

          <div id="subTasks"></div>

          <div class="markedFieldsResponsive d-none">
            <span><mark class="marked">*</mark>This field is required</span>
          </div>
        </div>
        </div>
        <div class="buttons">
          <div class="flexButtons">
            <button class="clear">
              Cancel
              <img
                class="defaultIcon"
                src="/assets/icons/iconoir_cancel.png"
                alt=""
              />
              <img
                class="hoverIcon"
                src="/assets/icons/iconoir_cancel_hover.png"
                alt=""
              />
            </button>

            <button class="createTask" onclick="createTask()">
              Create Task
              <img src="/assets/icons/check.png" alt="" />
            </button>
          </div>
        </div>
      </div>`;
}
