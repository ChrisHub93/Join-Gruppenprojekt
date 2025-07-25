/**
 * Runs all input validation functions for the sign-up form,
 * including name, email, password, confirm password, and checkbox.
 */
function validateSignUpInputs() {
  validateNameInput("signUpInputName", "signUpNameFeedback");
  validateEmailInput("signUpInputEmail", "signUpEmailFeedback");
  validatePasswordInput(
    "signUpInputPassword",
    "passwortFeedback",
    "signUpInputPasswortBtn"
  );
  validateConfirmPassword(
    "signUpInputPassword",
    "inputPasswordConfirm",
    "confirmPasswortFeedback"
  );
  validateCheckbox("check-privacy", "checkBoxFeedback");
}

/**
 * Validates the name input field by checking if it contains at least two words
 * (first and last name). Trims extra spaces before validation.
 *
 * If the input has fewer than two words, it sets the global variable `nameCheck` to false
 * and displays a feedback message. Otherwise, it sets `nameCheck` to true
 * and hides any existing feedback message.
 *
 * @param {string} inputId - ID of the name input field
 * @param {string} feedbackId - ID of the feedback element
 */
function validateNameInput(inputId, feedbackId) {
  const nameInputRef = document.getElementById(inputId);
  const nameValue = nameInputRef.value.trim();
  const nameParts = nameValue.split(" ").filter((part) => part.length > 0);

  if (nameParts.length < 2) {
    showUserFeedback(
      inputId,
      feedbackId,
      "Please enter your first and last name"
    );
    nameCheck = false;
  } else {
    hideUserFeedback(inputId, feedbackId);
    nameCheck = true;
  }
}

/**
 * Validates the email input field using a regular expression.
 *
 * If the input matches the expected email format, it sets the global variable `emailCheck` to true
 * and hides any existing feedback message. Otherwise, it sets `emailCheck` to false
 * and displays a corresponding feedback message.
 *
 * @param {string} inputId - ID of the email input field
 * @param {string} feedbackId - ID of the feedback element
 */
function validateEmailInput(inputId, feedbackId) {
  const emailInputRef = document.getElementById(inputId).value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (emailRegex.test(emailInputRef)) {
    hideUserFeedback(inputId, feedbackId);
    emailCheck = true;
  } else {
    showUserFeedback(
      inputId,
      feedbackId,
      "Please enter a valid email address."
    );
    emailCheck = false;
  }
}

/**
 * Validates the password input. If the input is empty, it sets the global variable `pwCheck` to false
 * and displays a feedback message. Otherwise, it sets `pwCheck` to true and hides any existing feedback.
 *
 * @param {string} inputId - ID of the password input field
 * @param {string} feedbackId - ID of the feedback element
 * @param {string} btnId - ID of the button element
 */
function validatePasswordInput(inputId, feedbackId, btnId) {
  const pwInputRef = document.getElementById(inputId);

  if (pwInputRef.value.trim() === "") {
    showUserFeedback(inputId, feedbackId, "This field is required.");
    showLockIcon(inputId, btnId);
    pwCheck = false;
  } else {
    hideUserFeedback(inputId, feedbackId);
    pwCheck = true;
  }
}

/**
 * Compares the password and confirm password input values.
 *
 * If both match and are not empty, sets the global variable `pwConfirmCheck` to true
 * and hides any existing feedback message.
 * Otherwise, sets `pwConfirmCheck` to false and displays a feedback message.
 *
 * @param {string} pwInputId - ID of the original password input field
 * @param {string} confirmInputId - ID of the confirm password input field
 * @param {string} feedbackId - ID of the feedback element
 */
function validateConfirmPassword(pwInputId, confirmInputId, feedbackId) {
  let pwInput = document.getElementById(pwInputId).value.trim();
  let confirmPwInput = document.getElementById(confirmInputId).value.trim();

  if (pwInput === confirmPwInput && confirmPwInput != "") {
    hideUserFeedback(confirmInputId, feedbackId);
    pwConfirmCheck = true;
  } else {
    showUserFeedback(
      confirmInputId,
      feedbackId,
      "Passwords don`t match. Please try again"
    );
    pwConfirmCheck = false;
  }
}

/**
 * Checks whether the checkbox input is selected.
 *
 * If the box is checked, sets the global variable `checkBox` to true
 * and hides any existing feedback message.
 * Otherwise, sets `checkBox` to false and displays a feedback message.
 *
 * @param {string} boxId - ID of the checkbox input element
 * @param {string} feedbackId - ID of the feedback element
 */
function validateCheckbox(boxId, feedbackId) {
  const isChecked = document.getElementById(boxId).checked;
  const feedbackElementRef = document.getElementById(feedbackId);

  if (isChecked) {
    feedbackElementRef.textContent = "";
    checkBox = true;
  } else {
    feedbackElementRef.innerHTML = "<br>Please accept the Privacy Policy";
    checkBox = false;
  }
}

/**
 * Replaces the visibility icon with a lock icon by updating CSS classes.
 *
 * @param {string} inputId - ID of the password input element
 * @param {string} btnId - ID of the button element
 */
function showLockIcon(inputId, btnId) {
  const inputLockIconRef = document.getElementById(inputId);
  const iconBtnRef = document.getElementById(btnId);

  inputLockIconRef.classList.add("icon-lock");
  iconBtnRef.classList.add("d-none");
}

/**
 * Restores the visibility icon by removing the lock icon class
 * and showing the visibility toggle button.
 *
 * @param {string} inputId - ID of the password input element
 * @param {string} btnId - ID of the visibility toggle button element
 */
function showEyeIcon(inputId, btnId) {
  const inputLockIconRef = document.getElementById(inputId);
  const iconBtnRef = document.getElementById(btnId);

  inputLockIconRef.classList.remove("icon-lock");
  iconBtnRef.classList.remove("d-none");
}

/**
 * Toggles the password input visibility and switches the corresponding icon.
 *
 * If the password is currently hidden, it will be shown and the icon changes to "visibility".
 * If it is visible, it will be hidden again and the icon changes to "visibility_off".
 *
 * @param {string} inputId - ID of the password input element
 * @param {string} imgId - ID of the image element used as the visibility toggle icon
 */
function togglePwVisibility(inputId, imgId) {
  const inputRef = document.getElementById(inputId);
  const iconRef = document.getElementById(imgId);

  if (inputRef.type === "password") {
    inputRef.type = "text";
    iconRef.src = "../assets/icons/visibility.svg";
    iconRef.alt = "Hide password";
  } else {
    inputRef.type = "password";
    iconRef.src = "../assets/icons/visibility_off.svg";
    iconRef.alt = "Show password";
  }
}

/**
 * This function resets the border color of the input field to the default
 * and clears the feedback message.
 *
 * @param {string} inputId - ID of the input field
 * @param {string} feedbackId - ID of the feedback element
 */
function hideUserFeedback(inputId, feedbackId) {
  const inputRef = document.getElementById(inputId);
  const feedbackRef = document.getElementById(feedbackId);

  inputRef.style.border = "1px solid var(--input-border)";
  feedbackRef.textContent = "";
}

/**
 * Sets the input field border to the error color and displays a feedback message.
 * 
 * @param {string} inputId - ID of the input field
 * @param {string} feedbackId - ID of the feedback element
 * @param {string} alertText - Message to display in the feedback element
 */
function showUserFeedback(inputId, feedbackId, alertText) {
  const inputRef = document.getElementById(inputId);
  const feedbackRef = document.getElementById(feedbackId);

  inputRef.style.border = "1px solid var(--error-color)";
  feedbackRef.textContent = alertText;
}
