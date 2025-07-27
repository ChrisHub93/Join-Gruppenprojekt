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

function renderStatus(status, elementId){
  if (status.length === 0) {
    elementId.innerHTML = getEmptyTemplate();
  } else {
    for (let index = 0; index < status.length; index++) {
      const element = statusToDo[index];
      elementId.innerHTML += getTaskTemplate(element);
      calculateAndRenderProgressBar(element);
    }
  }
}