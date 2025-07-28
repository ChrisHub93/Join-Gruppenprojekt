/**
 * Checks each task category (status) for assigned tasks and renders them accordingly.
 * If a category is empty, an empty template will be rendered in its place.
 *
 * @param {Array<object>} statusToDo - List of tasks with status "To do"
 * @param {HTMLElement} toDoContentRef - Container element for "To do" tasks
 * @param {Array<object>} statusInProgress - List of tasks with status "In progress"
 * @param {HTMLElement} inProgressContentRef - Container element for "In progress" tasks
 * @param {Array<object>} statusAwaitFeedback - List of tasks with status "Await feedback"
 * @param {HTMLElement} awaitFeedbackContentRef - Container element for "Await feedback" tasks
 * @param {Array<object>} statusDone - List of tasks with status "Done"
 * @param {HTMLElement} doneContentRef - Container element for "Done" tasks
 */
function checkAllStatus(
  statusToDo,
  toDoContentRef,
  statusInProgress,
  inProgressContentRef,
  statusAwaitFeedback,
  awaitFeedbackContentRef,
  statusDone,
  doneContentRef
) {
  checkStatusToDo(statusToDo, toDoContentRef);
  checkStatusInProgress(statusInProgress, inProgressContentRef);
  checkStatusAwaitFeedback(statusAwaitFeedback, awaitFeedbackContentRef);
  checkStatusDone(statusDone, doneContentRef);
}

/**
 * Renders tasks with the status "To do" into the provided container.
 * If no tasks are present, it renders an empty template instead.
 *
 * @param {Array<object>} statusToDo - List of tasks with status "To do"
 * @param {HTMLElement} toDoContentRef - Container element for "To do" tasks
 */
function checkStatusToDo(statusToDo, toDoContentRef) {
  if (statusToDo.length === 0) {
    toDoContentRef.innerHTML = getEmptyTemplate();
  } else {
    for (let index = 0; index < statusToDo.length; index++) {
      const element = statusToDo[index];
      toDoContentRef.innerHTML += getTaskTemplate(element);
      calculateAndRenderProgressBar(element);
    }
  }
}

/**
 * Renders tasks with the status "In progress" into the provided container.
 * If no tasks are present, it renders an empty template instead.
 *
 * @param {Array<object>} statusInProgress - List of tasks with status "In progress"
 * @param {HTMLElement} inProgressContentRef - Container element for "In progress" tasks
 */
function checkStatusInProgress(statusInProgress, inProgressContentRef) {
  if (statusInProgress.length == 0) {
    inProgressContentRef.innerHTML = getEmptyTemplate();
  } else {
    for (let index = 0; index < statusInProgress.length; index++) {
      const element = statusInProgress[index];
      inProgressContentRef.innerHTML += getTaskTemplate(element);
      calculateAndRenderProgressBar(element);
    }
  }
}

/**
 * Renders tasks with the status "Await feedback" into the provided container.
 * If no tasks are present, it renders an empty template instead.
 *
 * @param {Array<object>} statusAwaitFeedback - List of tasks with status "Await feedback"
 * @param {HTMLElement} awaitFeedbackContentRef - Container element for "Await feedback" tasks
 */
function checkStatusAwaitFeedback(
  statusAwaitFeedback,
  awaitFeedbackContentRef
) {
  if (statusAwaitFeedback.length == 0) {
    awaitFeedbackContentRef.innerHTML = getEmptyTemplate();
  } else {
    for (let index = 0; index < statusAwaitFeedback.length; index++) {
      const element = statusAwaitFeedback[index];
      awaitFeedbackContentRef.innerHTML += getTaskTemplate(element);
      calculateAndRenderProgressBar(element);
    }
  }
}

/**
 * Renders tasks with the status "Done" into the provided container.
 * If no tasks are present, it renders an empty template instead.
 *
 * @param {Array<object>} statusDone - List of tasks with status "Done"
 * @param {HTMLElement} doneContentRef - Container element for "Done" tasks
 */
function checkStatusDone(statusDone, doneContentRef) {
  if (statusDone.length == 0) {
    doneContentRef.innerHTML = getEmptyTemplate();
  } else {
    for (let index = 0; index < statusDone.length; index++) {
      const element = statusDone[index];

      doneContentRef.innerHTML += getTaskTemplate(element);
      calculateAndRenderProgressBar(element);
    }
  }
}

/**
 * Sends updated task data to the server using a PUT request.
 *
 * @param {string} [path=""] - Relative path to the resource (e.g. "tasks/123")
 * @param {object} [data={}] - Data object to update on the server
 * @returns {Promise<object>} - The parsed JSON response from the server
 */
async function putDataStatus(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responseToJson = await response.json());
}

/**
 * Renders a list of tasks to the given DOM element.
 * If no tasks are present, it renders an empty template.
 *
 * @param {Array<object>} status - List of tasks with any given status
 * @param {HTMLElement} elementId - DOM element where the tasks will be rendered
 */
function renderStatus(status, elementId) {
  if (status.length === 0) {
    elementId.innerHTML = getEmptyTemplate();
  } else {
    for (let index = 0; index < status.length; index++) {
      const element = status[index];
      elementId.innerHTML += getTaskTemplate(element);
      calculateAndRenderProgressBar(element);
    }
  }
}
