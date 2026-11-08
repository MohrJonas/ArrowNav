import KeyCodes from "./KeyCodes.ts";
import NavigationDirection from "./NavigationDirection.ts";
import FocusableElement from "./FocusableElement.ts";
import selectNextElement from "./ElementSelector.ts";

let pageLoaded = false;
let focusableElements: FocusableElement[] | null = null;
let focusedElement: FocusableElement | null = null;

function getInitialElement(
  elements: FocusableElement[],
): FocusableElement | null {
  console.log("Getting initial page element");
  function getElementValue(element: FocusableElement) {
    return element.centerX() + 2 * element.centerY();
  }
  if (elements.length == 0) {
    console.log("Elements are empty, doing noting");
    return null;
  }
  let element = elements[0]!;
  let value = getElementValue(element);

  for (let i = 1; i < elements.length; i++) {
    let e = elements[i]!;
    let v = getElementValue(e);
    if (v < value) {
      element = e;
      value = v;
    }
  }
  console.log("Initial element is");
  console.log(element);
  return element;
}

function processDomChanges() {
  console.log("DOM changed, adjusting...");

  focusableElements = Array.from(document.querySelectorAll("*"))
    .filter((e) => e.tagName === "BUTTON" || e.tagName === "A")
    .map((e) => new FocusableElement(e as HTMLElement))
    .filter((e) => e.width() > 0 && e.height() > 0 && e.x() > 0 && e.y() > 0);

  console.log(focusableElements);

  if (focusedElement == null) {
    console.log("No element is currently focused, focusing initial element");
    focusedElement = getInitialElement(focusableElements);
    focusedElement?.focus();
  } else if (!focusableElements.includes(focusedElement)) {
    console.log("Focused element no longer exists, focusing initial element");
    focusedElement = getInitialElement(focusableElements);
    focusedElement?.focus();
  }
}

function onDirectionPress(direction: NavigationDirection) {
  console.log(`Direction key pressed: ${direction}`);
  const nextElement = selectNextElement(
    direction,
    focusedElement!,
    200,
    focusableElements!,
  );
  console.log("Next element is:");
  console.log(nextElement);
  if (nextElement == null) return;

  focusedElement?.unfocus();
  focusedElement = nextElement;
  focusedElement?.focus();
}

function onEnterPress() {
  console.log("Enter pressed");
  focusedElement?.click();
}

async function onPageLoad() {
  console.log("Page loaded");
  await new Promise((resolve) => setTimeout(resolve, 3000));
  processDomChanges();
  pageLoaded = true;
}

if (document.readyState == "loading")
  document.addEventListener("DOMContentLoaded", onPageLoad);
else onPageLoad();

//document.addEventListener("load", processDomChanges)

document.addEventListener("keydown", (event) => {
  switch (event.keyCode) {
    case KeyCodes.upKeycode:
      event.preventDefault();
      onDirectionPress(NavigationDirection.Up);
      break;
    case KeyCodes.downKeycode:
      event.preventDefault();
      onDirectionPress(NavigationDirection.Down);
      break;
    case KeyCodes.leftKeycode:
      event.preventDefault();
      onDirectionPress(NavigationDirection.Left);
      break;
    case KeyCodes.rightKeycode:
      event.preventDefault();
      onDirectionPress(NavigationDirection.Right);
      break;
    case KeyCodes.enterKeycode:
      event.preventDefault();
      onEnterPress();
      break;
  }
});

const body = document.getElementsByTagName("body")[0]!;
const observer = new MutationObserver((records) => {
  if (!pageLoaded) return;

  function isButtonOrAnchor(element: HTMLElement) {
    return element.tagName == "BUTTON" || element.tagName == "A";
  }

  for (const record of records) {
    for (const node of record.addedNodes) {
      const element = node as HTMLElement;
      if (isButtonOrAnchor(element)) {
        console.log("Relevant node was added during mutation, processing");
        processDomChanges();
        return;
      }
    }
    for (const node of record.removedNodes) {
      const element = node as HTMLElement;
      if (isButtonOrAnchor(element)) {
        console.log("Relevant node was removed during mutation, processing");
        processDomChanges();
        return;
      }
    }
  }

  console.log(
    "Discarding mutation events since no buttons or anchors were added / removed",
  );
});

observer.observe(body, {
  subtree: true,
  childList: true,
});
