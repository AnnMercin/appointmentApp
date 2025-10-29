import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[clickOutside]',
  standalone: false
})
export class ClickOutsideDirective {
  @Output() clickOutside = new EventEmitter<void>();

  constructor(private readonly elementRef: ElementRef) {}

  @HostListener('document:click', ['$event.target'])
  public onClick(target: EventTarget | null): void {
    if (target && this.elementRef.nativeElement) {
      const clickedInside = this.elementRef.nativeElement.contains(target as Node);
      if (!clickedInside) {
        this.clickOutside.emit();
      }
    }
  }
}