import type FocusableElement from "./FocusableElement.ts";
import NavigationDirection from "./NavigationDirection.ts";

export default function selectNextElement(
    direction: NavigationDirection,
    currentElement: FocusableElement,
    selectionMargin: number,
    availableElements: FocusableElement[]): FocusableElement | null {

    return availableElements
        .filter(e => e != currentElement)
        .filter(e => filterByDirection(e, currentElement, direction))
        .filter(e => filterByMargin(e, currentElement, direction, selectionMargin))
        .toSorted((e1, e2) => {
            const e1Distance = getDistance(e1, currentElement, direction, 3)
            const e2Distance = getDistance(e2, currentElement, direction, 3)
            return e1Distance - e2Distance
        })[0] || null;
}

function filterByDirection(element: FocusableElement, currentElement: FocusableElement, direction: NavigationDirection) {
    switch (direction) {
        case NavigationDirection.Up:
            return element.isOnTopOf(currentElement)
        case NavigationDirection.Down:
            return element.isBelow(currentElement)
        case NavigationDirection.Left:
            return element.isToTheLeftOf(currentElement)
        case NavigationDirection.Right:
            return element.isToTheRightOf(currentElement)
    }
}

function filterByMargin(element: FocusableElement, currentElement: FocusableElement, direction: NavigationDirection, margin: number) {
    console.log("Checking element")
    console.log(element)

    let min: number;
    let max: number;
    switch (direction) {
        case NavigationDirection.Up:
        case NavigationDirection.Down:
            min = Math.max(currentElement.centerX() - margin, 0);
            max = currentElement.centerX() + margin;
            break;
        case NavigationDirection.Left:
        case NavigationDirection.Right:
            min = Math.max(currentElement.centerY() - margin);
            max = currentElement.centerY() + margin;
            break;
    }

    console.log(`Min -> ${min}`)
    console.log(`Max -> ${max}`)

    switch (direction) {
        case NavigationDirection.Up:
        case NavigationDirection.Down:
        {
            const biggerThanMin = element.centerX() >= min
            const smallerThanMax = element.centerX() <= max
            console.log(`${element.centerX()} >= ${min} ? ${biggerThanMin}`)
            console.log(`${element.centerX()} <= ${max} ? ${smallerThanMax}`)
            return biggerThanMin && smallerThanMax;
        }
        case NavigationDirection.Left:
        case NavigationDirection.Right:
        {
            const biggerThanMin = element.centerY() >= min
            const smallerThanMax = element.centerY() <= max
            console.log(`${element.centerY()} >= ${min} ? ${biggerThanMin}`)
            console.log(`${element.centerY()} <= ${max} ? ${smallerThanMax}`)
            return biggerThanMin && smallerThanMax;
        }
    }
}

function getDistance(element: FocusableElement, currentElement: FocusableElement, direction: NavigationDirection, directionMultiplier: number) {
    console.log("Checking distance to element:")
    console.log(element)
    switch (direction) {
        case NavigationDirection.Up:
        case NavigationDirection.Down:
        {
            const distance =
                Math.abs(element.centerY() - currentElement.centerY())
                + directionMultiplier * Math.abs(element.centerX() - currentElement.centerX())
            console.log(`Distance Y: ${distance}`)
            return distance
        }
        case NavigationDirection.Left:
        case NavigationDirection.Right:
        {
            const distance = Math.abs(element.centerX() - currentElement.centerX())
            + directionMultiplier * Math.abs(element.centerY() - currentElement.centerY())
            console.log(`Distance X: ${distance}`)
            return distance
        }
    }
}