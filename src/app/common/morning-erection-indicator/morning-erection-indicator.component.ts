import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'mv-morning-erection-indicator',
  standalone: true,
  template: `
    <button class="indicator" type="button" (click)="toggle()" [class.indicator--down]="isDown()" aria-label="Morning erection indicator">
      <span class="label">{{ label }}</span>
      <span class="eggplant" [class.eggplant--down]="isDown()">🍆</span>
    </button>
  `,
  styles: [
    `
    :host {display:flex;flex-grow:1;}
    .indicator{width:100%;display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-radius:14px;border:1px solid #1d2533;background:#141923;box-shadow:0 1px 0 rgba(255,255,255,.02) inset}
     .label{color:#e6ecf8;font-size:16px}
     .eggplant{display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:999px;border:1px solid #1d2533;background:#0f1420;font-size:22px;transition:transform .2s ease-in-out;transform:scaleX(-1)}
     .eggplant--down{transform:scaleX(-1) rotate(-45deg)}
    `
  ]
})
export class MorningErectionIndicatorComponent {
  @Input() label: string = 'Morning erection';
  protected readonly isDown = signal(true);
  protected toggle(): void { this.isDown.update(v => !v); }
}


