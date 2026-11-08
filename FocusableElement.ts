export default class FocusableElement {
  public readonly bounds: DOMRect;
  private style: string = "";

  public constructor(readonly element: HTMLElement) {
    this.element = element;
    this.bounds = element.getBoundingClientRect();
  }

  public x(): number {
    return this.bounds.x;
  }

  public y(): number {
    return this.bounds.y;
  }

  public width(): number {
    return this.bounds.width;
  }

  public height(): number {
    return this.bounds.height;
  }

  public centerX(): number {
    return this.x() + this.width() / 2;
  }

  public centerY(): number {
    return this.y() + this.height() / 2;
  }

  public isToTheRightOf(otherElement: FocusableElement): boolean {
    return this.centerX() > otherElement.centerX();
  }

  public isToTheLeftOf(otherElement: FocusableElement): boolean {
    return !this.isToTheRightOf(otherElement);
  }

  public isOnTopOf(otherElement: FocusableElement): boolean {
    return this.centerY() < otherElement.centerY();
  }

  public isBelow(otherElement: FocusableElement): boolean {
    return !this.isOnTopOf(otherElement);
  }

  public focus() {
    this.style = this.element.style.border;
    this.element.style.border = "3px solid red";
    this.element.scrollIntoView({ behavior: "smooth", block: "center" });
    this.element.focus();
  }

  public click() {
    this.element.click();
  }

  public unfocus() {
    this.element.style.border = this.style;
  }
}
