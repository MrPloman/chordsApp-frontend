import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appFadeAndSlideDirective]',
  standalone: true,
})
export class FadeAndSlideDirective implements OnChanges {
  @Input({ alias: 'appFadeAndSlide' })
  visible = true;

  private initialized = false;

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2
  ) {
    this.renderer.addClass(this.el.nativeElement, 'fade-and-slide');
  }

  ngOnChanges(): void {
    if (!this.initialized) {
      this.initialized = true;
      requestAnimationFrame(() => {
        this.applyState();
      });
    } else {
      this.applyState();
    }
  }

  private applyState() {
    if (this.visible) {
      this.renderer.addClass(this.el.nativeElement, 'show');
      this.renderer.removeClass(this.el.nativeElement, 'hide');
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'show');
      this.renderer.addClass(this.el.nativeElement, 'hide');
    }
  }
}
