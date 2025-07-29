/**
 * Creates a new contact after validating and sanitizing user input.
 * Submits the data to the backend and updates the UI accordingly.
 * 
 * @param {Event} event - The event triggered by the user (e.g. form submission or button click).
 */
async function createContact(event) {
  const refs = getRefs();
  const values = getSanitizedValues(refs);
  
  if (isAllEmptyOrInvalid(values, refs)) return;

  const error = getFirstValidationError(values, refs);
  if (error) return;

  const { firstName, lastName } = splitAndCapitalizeName(values.name);

  await postData(`/contacts/`, {
    id: getId(),
    email: values.email,
    firstname: firstName,
    lastname: lastName,
    phone: values.phone,
  });

  getListOfCreatedContact(firstName, lastName, refs.email, refs.phone);
  closeOverlayAfterCreatedContact(event);
  moreDetailsAboutContact(values.email, firstName, lastName, values.phone);
  clearInputFields(refs.name, refs.email, refs.phone);
  resetErrorStatus(
    [refs.name, refs.email, refs.phone],
    [refs.errorName, refs.errorEmail, refs.errorPhone]
  );
  showSuccess();
}

/**
 * Retrieves input and error label DOM references from the contact form.
 * @returns {{name: HTMLElement, email: HTMLElement, phone: HTMLElement, errorName: HTMLElement, errorEmail: HTMLElement, errorPhone: HTMLElement}}
 */
function getRefs() {
  return {
    name: document.getElementById("name"),
    email: document.getElementById("email"),
    phone: document.getElementById("phone"),
    errorName: document.getElementById("requiredNameField"),
    errorEmail: document.getElementById("requiredEmailField"),
    errorPhone: document.getElementById("requiredPhoneField"),
  };
}

/**
 * Extracts and trims user input values from input fields.
 * 
 * @param {Object} refs - The DOM element references returned by getRefs().
 * @returns {{name: string, email: string, phone: string}} - Cleaned user input values.
 */
function getSanitizedValues(refs) {
  return {
    name: refs.name.value.trim().replace(/\s+/g, " "),
    email: refs.email.value.trim().replace(/\s+/g, ""),
    phone: refs.phone.value.trim().replace(/\s+/g, ""),
  };
}

/**
 * Checks whether the name is invalid and both email and phone are empty.
 * Displays all error states if true.
 * 
 * @param {{name: string, email: string, phone: string}} values - The cleaned input values.
 * @param {Object} refs - DOM references to input and error fields.
 * @returns {boolean} - True if the form is completely invalid; false otherwise.
 */
function isAllEmptyOrInvalid(values, refs) {
  const namePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ]+( [A-Za-zÀ-ÖØ-öø-ÿ]+)+$/;
  if (!namePattern.test(values.name) && values.email === "" && values.phone === "") {
    addError(refs.name, refs.email, refs.phone);
    removeOpacity(refs.errorName, refs.errorEmail, refs.errorPhone);
    return true;
  }
  return false;
}

/**
 * Validates name, email, and phone inputs individually.
 * Highlights the first invalid input and displays the corresponding error message.
 * 
 * @param {{name: string, email: string, phone: string}} values - The cleaned input values.
 * @param {Object} refs - DOM references to input and error fields.
 * @returns {boolean} - True if an error is found and displayed; false otherwise.
 */
function getFirstValidationError(values, refs) {
  const patterns = {
    name: /^[A-Za-zÀ-ÖØ-öø-ÿ]+( [A-Za-zÀ-ÖØ-öø-ÿ]+)+$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[\d +()-]{6,}$/,
  };

  const fields = [
    { key: "name", pattern: patterns.name, ref: refs.name, label: refs.errorName },
    { key: "email", pattern: patterns.email, ref: refs.email, label: refs.errorEmail },
    { key: "phone", pattern: patterns.phone, ref: refs.phone, label: refs.errorPhone },
  ];

  for (let { key, pattern, ref, label } of fields) {
    if (!pattern.test(values[key])) {
      ref.classList.add("error");
      label.classList.remove("opacity");
      return true;
    }
  }
  return false;
}

/**
 * Show a temporary success message after contact creation.
 */
function showSuccess() {
  let successfullyCreatedRef = document.getElementById("successfullyCreated");
  successfullyCreatedRef.style.display = "flex";
  setTimeout(() => {
    successfullyCreatedRef.classList.add("showSuccess");
    successfullyCreatedRef.classList.remove("hideSuccess");
  }, 500);
  setTimeout(() => {
    successfullyCreatedRef.classList.remove("showSuccess");
    successfullyCreatedRef.classList.add("hideSuccess");
  }, 2000);
  setTimeout(() => {
    successfullyCreatedRef.style.display = "none";
  }, 2500);
}

/**
 * Splits the full name string into first and last name, and capitalizes the first letter of each.
 * 
 * @param {string} name - Full name input from the user.
 * @returns {{firstName: string, lastName: string}} - Capitalized first and last name.
 */
function splitAndCapitalizeName(name) {
  const [firstRaw, lastRaw] = name.split(" ");
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  return {
    firstName: capitalize(firstRaw),
    lastName: capitalize(lastRaw),
  };
}