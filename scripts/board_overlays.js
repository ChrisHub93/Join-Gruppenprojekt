/**
 * Retrieves references to the main overlay elements in the DOM.
 *
 * @returns {Object} An object containing references to overlay-related DOM elements:
 *  - {HTMLElement|null} addOverlayTaskRef - The task overlay container element.
 *  - {HTMLElement|null} dialogTaskContentRef - The content container for the task overlay.
 *  - {HTMLElement|null} addOverlayEditRef - The edit task overlay container element.
 *  - {HTMLElement|null} dialogTaskEditContent - The content container for the edit task overlay.
 */
function getOverlayElements() {
  return {
    addOverlayTaskRef: document.getElementById("overlayTask"),
    dialogTaskContentRef: document.getElementById("dialogTaskContent"),
    addOverlayEditRef: document.getElementById("overlayTaskEdit"),
    dialogTaskEditContent: document.getElementById("dialogTaskEditContent"),
  };
}

/**
 * Animates the given element by sliding it in from the right and fading it in.
 *
 * @param {HTMLElement} element - The DOM element to animate.
 */
function overlaySlide(element) {
  element.style.transform = "translateX(100%)";
  element.style.opacity = "0";
  requestAnimationFrame(() => {
    element.style.transform = "translateX(0)";
    element.style.opacity = "1";
  });
}

/**
 * Handles closing of task or edit overlays when the user clicks outside the content area
 * or on specific close/delete elements.
 *
 *@param {MouseEvent} event - The click event that triggered the handler
 */
function closeOverlay(event) {
  let {addOverlayTaskRef, dialogTaskContentRef, addOverlayEditRef, dialogTaskEditContent,} = getOverlayElements();
  if (
    event.target === addOverlayTaskRef ||
    event.target.closest("#overlayTask .closeIcon") ||
    event.target.closest(".delete_task")
  ) {
    closeOverlayAnimation(dialogTaskContentRef, addOverlayTaskRef);
  } else if (
    event.target === addOverlayEditRef ||
    event.target.closest("#overlayTaskEdit .closeIcon")
  ) {
    closeOverlayAnimation(dialogTaskEditContent, addOverlayEditRef);
  }
}

/**
 * Animates the closing of an overlay by sliding it out to the right and fading it out.
 * After the animation (300ms), it removes the "active" class from the overlay and resets styles.
 *
 * @param {HTMLElement} contentRef - The DOM element containing the overlay content.
 * @param {HTMLElement} overlayRef - The overlay container element to hide.
 */
function closeOverlayAnimation(contentRef, overlayRef) {
  contentRef.style.transform = "translateX(100%)";
  contentRef.style.opacity = "0";
  setTimeout(() => {
    overlayRef.classList.remove("active");
    contentRef.style.transform = "";
    contentRef.style.opacity = "";
  }, 300);
}

/**
 * Synchronizes the height of the task edit overlay with the height of the task view overlay.
 * 
 * Ensures a consistent layout when switching between view and edit mode.
 */
function taskOverlaySync() {
  let dialogTaskContentRef = document.getElementById("dialogTaskContent");
  let dialogTaskEditContentRef = document.getElementById(
    "dialogTaskEditContent"
  );
  if (dialogTaskContentRef && dialogTaskEditContentRef) {
    dialogTaskEditContentRef.style.height =
      dialogTaskContentRef.offsetHeight + "px";
  }
}