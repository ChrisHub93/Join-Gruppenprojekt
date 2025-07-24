function openAddTaskOverlay(status) {
    const addOverlayRef = document.getElementById("overlayAddTask");
    const openAddTaskOverlayRef = document.getElementById("addTaskContent");
  
    document.body.style.overflow = "hidden";
    addOverlayRef.classList.remove("d-nonevip");
    openAddTaskOverlayRef.innerHTML = getAddTaskTemplate();
  
    const taskContentRef = document.getElementById("addTaskOverlay");
    taskContentRef.classList.remove("animate-out");
    void taskContentRef.offsetWidth;
    taskContentRef.classList.add("animate-in");
  
    setMinDate();
    initAddTask();
  
    currentStatus = status;
  }
  
  function closeAddTaskOverlay() {
    const addOverlayRef = document.getElementById("overlayAddTask");
    const taskContentRef = document.getElementById("addTaskOverlay");
  
    taskContentRef.classList.remove("animate-in");
    void taskContentRef.offsetWidth;
    taskContentRef.classList.add("animate-out");
  
    taskContentRef.addEventListener("animationend", function handler() {
      taskContentRef.removeEventListener("animationend", handler);
      addOverlayRef.classList.add("d-nonevip");
      document.body.style.overflow = "";
      resetAllPriorities();
    });
  }

  function setMinDate() {
    const dateInput = document.getElementById('date');
    dateInput.min = getTodayStr();
  }

  function checkEmptyTitleEdit() {
    let titleRef = document.getElementById("titleEdit");
    let errorTitleRef = document.getElementById("errorTitleEdit");
    if (!titleRef.value) {
      titleRef.classList.add("inputError");
      errorTitleRef.classList.remove("opacity");
      checkTitle = false;
    } else {
      titleRef.classList.remove("inputError");
      errorTitleRef.classList.add("opacity");
      checkTitle = true;
    }
  }

  function closeAddTaskOverlaySuccses() {
    const addOverlayRef = document.getElementById("overlayAddTask");
    addOverlayRef.classList.remove("d-nonevip");
  
    document.getElementById("AddTaskSuccesMessage").style.display = "flex";
    setTimeout(() => {
      resetAllPriorities();
      document.body.style.overflow = "";
      addOverlayRef.classList.add("d-nonevip");
      document.getElementById("AddTaskSuccesMessage").style.display = "none";
    }, 700);
  }
  
  function deleteOverlaySuccses() {
    const addOverlayRef = document.getElementById("overlayDeleteTask");
    addOverlayRef.classList.remove("d-nonevip");
  
    document.getElementById("deleteSuccesMessage").style.display = "flex";
    setTimeout(() => {
      document.body.style.overflow = "";
      addOverlayRef.classList.add("d-nonevip");
      document.getElementById("deleteSuccesMessage").style.display = "none";
    }, 800);
  }